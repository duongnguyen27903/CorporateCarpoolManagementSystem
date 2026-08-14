using CarpoolSystem.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using H3;
using H3.Model;

namespace CarpoolSystem.Application.Helpers
{
    public static class H3Helper
    {
        public static H3Index ToCell(
            GeoPoint point,
            int resolution)
        {
            return LatLngToCell(
                point.Latitude,
                point.Longitude,
                resolution);
        }

        private static H3Index LatLngToCell(
            double latitude,
            double longitude,
            int resolution)
        {
            // pocketken.H3 3.x
            // GeoCoord expects radians
            var latLng = new GeoCoord { Latitude = latitude * (Math.PI / 180.0), Longitude = longitude * (Math.PI / 180.0) };

            return H3Index.FromGeoCoord(
                latLng,
                resolution);
        }
    }
}
