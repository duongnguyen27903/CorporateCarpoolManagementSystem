using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarpoolSystem.Domain.Entities
{
    public class Trip
    {
        [Key]
        public int TripId { get; set; }

        public int RouteId { get; set; }
        public Route Route { get; set; }

        public int DriverId { get; set; }
        public Employee Driver { get; set; }

        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }

        public DateTime DepartureTime { get; set; }

        [Range(0, 8)]
        public int AvailableSeats { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

        public ICollection<CostTransaction> CostTransactions { get; set; } = new List<CostTransaction>();
    }
}
