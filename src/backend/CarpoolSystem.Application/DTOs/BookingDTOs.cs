using System;
using System.Collections.Generic;

namespace CarpoolSystem.Application.DTOs
{
    // DTOs for Booking module
    public record CreateBookingRequest(int TripId);

    public record BookingResponse(int BookingId, int TripId, int PassengerId, string Status, string? CancelReason, DateTime? CheckInTime, DateTime CreatedAt);
}
