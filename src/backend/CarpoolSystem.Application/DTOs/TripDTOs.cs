using System;
using System.Collections.Generic;

namespace CarpoolSystem.Application.DTOs
{
    // DTOs for Trip module
    public record CreateTripRequest(int RouteId, int VehicleId, DateTime DepartureTime, int AvailableSeats);
    public record UpdateTripStatusRequest(string Status);

    public record TripResponse(int TripId, int RouteId, int DriverId, int VehicleId, DateTime DepartureTime, int AvailableSeats, string Status, DateTime CreatedAt);
    public record TripBookingResponse(int BookingId, int TripId, int PassengerId, string Status);
}
