using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Models
{
    /// <summary>
    /// Simple latitude/longitude value type used across the application.
    /// </summary>
    public readonly struct GeoPoint
    {
        public double Latitude { get; }
        public double Longitude { get; }

        public GeoPoint(double latitude, double longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }
    }
}
