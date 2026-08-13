using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class CostTransactionService : ICostTransactionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private const decimal PricePerKm = 1000m; // VND per km, example

        public CostTransactionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CalculateCostForTripAsync(int tripId)
        {
            var tripRepo = _unitOfWork.Repository<Trip>();
            var trip = await tripRepo.GetByIdAsync(tripId);
            if (trip == null)
                throw new InvalidOperationException("Trip not found");

            if (trip.Status != "Completed")
                throw new InvalidOperationException("Trip must be completed to calculate costs");

            // Load route and zones
            var routeRepo = _unitOfWork.Repository<Route>();
            var route = await routeRepo.GetByIdAsync(trip.RouteId);
            if (route == null)
                throw new InvalidOperationException("Route not found");

            var zoneRepo = _unitOfWork.Repository<Zone>();
            var startZone = await zoneRepo.GetByIdAsync(route.StartZoneId);
            var endZone = await zoneRepo.GetByIdAsync(route.EndZoneId);
            if (startZone == null || endZone == null)
                throw new InvalidOperationException("Zones not found");

            // Calculate distance in km using Haversine
            var distanceKm = CalculateDistanceInKm((double)startZone.Latitude, (double)startZone.Longitude, (double)endZone.Latitude, (double)endZone.Longitude);

            // Count participants: bookings checked-in, fallback to confirmed
            var bookingRepo = _unitOfWork.Repository<Booking>();
            var bookings = (await bookingRepo.FindAsync(b => b.TripId == tripId)).ToList();
            var participants = bookings.Where(b => b.Status == "CheckedIn").ToList();
            if (!participants.Any())
            {
                participants = bookings.Where(b => b.Status == "Confirmed").ToList();
            }

            var count = participants.Count;
            if (count == 0)
                throw new InvalidOperationException("No participants to split cost");

            var total = (decimal)distanceKm * PricePerKm;
            var perPerson = Math.Round(total / count, 2);

            var ctRepo = _unitOfWork.Repository<CostTransaction>();

            var transactionMonth = DateTime.UtcNow.ToString("yyyy-MM", CultureInfo.InvariantCulture);

            // Create transactions for each participant (and optionally driver)
            foreach (var p in participants)
            {
                var ct = new CostTransaction
                {
                    TripId = tripId,
                    EmployeeId = p.PassengerId,
                    Amount = perPerson,
                    TransactionMonth = transactionMonth,
                    CreatedAt = DateTime.UtcNow
                };
                await ctRepo.AddAsync(ct);
            }

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<IEnumerable<CostTransaction>> GetCostHistoryAsync(int employeeId, string? month)
        {
            var ctRepo = _unitOfWork.Repository<CostTransaction>();
            var all = await ctRepo.FindAsync(ct => ct.EmployeeId == employeeId);
            if (!string.IsNullOrEmpty(month))
            {
                return all.Where(ct => ct.TransactionMonth == month);
            }
            return all;
        }

        public async Task<IEnumerable<CostTransaction>> GetCostsByTripAsync(int tripId)
        {
            var ctRepo = _unitOfWork.Repository<CostTransaction>();
            return await ctRepo.FindAsync(ct => ct.TripId == tripId);
        }

        // Haversine formula
        private static double CalculateDistanceInKm(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371; // Radius of the earth in km
            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            double distance = R * c; // Distance in km
            return distance;
        }

        private static double ToRadians(double deg) => deg * (Math.PI / 180);
    }
}
