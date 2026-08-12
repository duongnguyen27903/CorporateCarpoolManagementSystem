using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class TripService : ITripService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICostTransactionService? _costService;

        // Inject optional cost service to allow calculating costs when trip completes
        public TripService(IUnitOfWork unitOfWork, ICostTransactionService? costService = null)
        {
            _unitOfWork = unitOfWork;
            _costService = costService;
        }

        public async Task<Trip> CreateTripAsync(int employeeId, int routeId, int vehicleId, DateTime departureTime, int availableSeats)
        {
            // Validate route exists and belongs to the employee who created it
            var routeRepo = _unitOfWork.Repository<Route>();
            var route = await routeRepo.GetByIdAsync(routeId);
            if (route == null)
                throw new InvalidOperationException("Route not found");

            if (route.EmployeeId != employeeId)
                throw new UnauthorizedAccessException("Only the route owner can create a trip from this route");

            // Validate vehicle exists and belongs to driver
            var vehicleRepo = _unitOfWork.Repository<Vehicle>();
            var vehicle = await vehicleRepo.GetByIdAsync(vehicleId);
            if (vehicle == null)
                throw new InvalidOperationException("Vehicle not found");

            if (vehicle.EmployeeId != employeeId)
                throw new UnauthorizedAccessException("Vehicle does not belong to the driver");

            if (availableSeats < 0 || availableSeats > vehicle.SeatCount)
                throw new InvalidOperationException("Invalid available seats");

            var trip = new Trip
            {
                RouteId = routeId,
                DriverId = employeeId,
                VehicleId = vehicleId,
                DepartureTime = departureTime,
                AvailableSeats = availableSeats,
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            };

            var tripRepo = _unitOfWork.Repository<Trip>();
            await tripRepo.AddAsync(trip);
            await _unitOfWork.SaveChangesAsync();

            return trip;
        }

        public async Task<IEnumerable<Trip>> GetTripsByDriverAsync(int driverId)
        {
            var tripRepo = _unitOfWork.Repository<Trip>();
            return await tripRepo.FindAsync(t => t.DriverId == driverId);
        }

        public async Task<IEnumerable<Trip>> GetActiveTripsAsync()
        {
            var tripRepo = _unitOfWork.Repository<Trip>();
            return await tripRepo.FindAsync(t => t.Status == "Open" && t.AvailableSeats > 0);
        }

        public async Task<Trip?> GetTripByIdAsync(int id)
        {
            var tripRepo = _unitOfWork.Repository<Trip>();
            return await tripRepo.GetByIdAsync(id);
        }

        public async Task<Trip> UpdateTripStatusAsync(int employeeId, int tripId, string status)
        {
            var tripRepo = _unitOfWork.Repository<Trip>();
            var trip = await tripRepo.GetByIdAsync(tripId);
            if (trip == null)
                throw new InvalidOperationException("Trip not found");

            if (trip.DriverId != employeeId)
                throw new UnauthorizedAccessException("Not allowed to update this trip");

            // Only allow certain statuses
            var allowed = new[] { "Cancelled", "Completed", "InProgress", "Open" };
            if (!allowed.Contains(status))
                throw new InvalidOperationException("Invalid status");

            trip.Status = status;
            tripRepo.Update(trip);
            await _unitOfWork.SaveChangesAsync();

            // If status changed to Completed, trigger cost calculation if service available
            if (status == "Completed" && _costService != null)
            {
                // fire-and-forget is acceptable here; await to ensure calculation persisted synchronously
                await _costService.CalculateCostForTripAsync(trip.TripId);
            }

            return trip;
        }
    }
}
