using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;
using CarpoolSystem.Application.DTOs;

namespace CarpoolSystem.Application.Services
{
    public interface ITripService
    {
        Task<Trip> CreateTripAsync(int employeeId, int routeId, int vehicleId, DateTime departureTime, int availableSeats);
        Task<IEnumerable<Trip>> GetTripsByDriverAsync(int driverId);
        Task<IEnumerable<Trip>> GetActiveTripsAsync();
        Task<Trip?> GetTripByIdAsync(int id);
        Task<Trip> UpdateTripStatusAsync(int employeeId, int tripId, string status);
        Task<IEnumerable<TripBookingResponse>> GetTripBookingsAsync(int tripId, int driverId);
    }
}
