using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarpoolSystem.Domain.Entities
{
    public class Vehicle
    {
        [Key]
        public int VehicleId { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        [Required]
        [MaxLength(20)]
        public string LicensePlate { get; set; }

        [MaxLength(50)]
        public string VehicleType { get; set; }

        [Range(1, 8)]
        public int SeatCount { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
