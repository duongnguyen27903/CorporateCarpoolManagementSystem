using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CarpoolSystem.Domain.Entities
{
    public class RouteDetail
    {
        public int RouteDetailId { get; set; }

        public int RouteId { get; set; }

        /// <summary>
        /// 1 = Outbound (Sáng)
        /// 2 = Inbound (Chiều)
        /// </summary>
        public byte Direction { get; set; }

        public TimeOnly DepartureTime { get; set; }

        public required string EncodedPolyline { get; set; }

        // Navigation property
        public Route Route { get; set; } = null!;

        [JsonIgnore]
        public ICollection<RouteH3> H3Cells { get; init; }
        = new List<RouteH3>();
    }
}
