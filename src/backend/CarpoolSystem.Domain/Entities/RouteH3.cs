using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CarpoolSystem.Domain.Entities
{
    public class RouteH3
    {
        public required long H3Cell { get; init; }
        public required int RouteDetailId { get; init; }
        public required short Sequence { get; init; }
        public required TimeOnly DepartureTime { get; init; }

        // Navigation Property (nếu dùng)
        [JsonIgnore]
        public RouteDetail? RouteDetail { get; init; }
    }
}
