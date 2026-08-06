using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarpoolSystem.Domain.Entities
{
    public class Route
    {
        [Key]
        public int RouteId { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        public int StartZoneId { get; set; }
        public Zone StartZone { get; set; }

        public int EndZoneId { get; set; }
        public Zone EndZone { get; set; }

        public TimeOnly StartTime { get; set; }

        [MaxLength(20)]
        public string DaysOfWeek { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
