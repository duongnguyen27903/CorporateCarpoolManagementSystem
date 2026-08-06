using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarpoolSystem.Domain.Entities
{
    public class Zone
    {
        [Key]
        public int ZoneId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ZoneName { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal Latitude { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal Longitude { get; set; }

        [InverseProperty("StartZone")]
        public ICollection<Route> RoutesAsStartZone { get; set; } = new List<Route>();

        [InverseProperty("EndZone")]
        public ICollection<Route> RoutesAsEndZone { get; set; } = new List<Route>();
    }
}
