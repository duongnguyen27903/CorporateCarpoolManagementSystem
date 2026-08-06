using System;
using System.ComponentModel.DataAnnotations;

namespace CarpoolSystem.Domain.Entities
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        public int TripId { get; set; }
        public Trip Trip { get; set; }

        public int PassengerId { get; set; }
        public Employee Passenger { get; set; }

        public bool DriverConfirmed { get; set; } = false;

        public bool PassengerConfirmed { get; set; } = false;

        [MaxLength(20)]
        public string Status { get; set; } = "Pending";

        [MaxLength(255)]
        public string? CancelReason { get; set; }

        public DateTime? CheckInTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
