using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.DTOs
{
    public class RouteDetailResponseDto
    {
        public int RouteDetailId { get; set; }
        public string? RouteDetailName { get; set; }
        public int RouteId { get; set; }
        public int Direction { get; set; }
        public TimeOnly DepartureTime { get; set; }
        public string EncodedPolyline { get; set; } = string.Empty;
    }
}
