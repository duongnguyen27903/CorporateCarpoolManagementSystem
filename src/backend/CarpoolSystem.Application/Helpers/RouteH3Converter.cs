using CarpoolSystem.Application.Models;
using H3;
using H3.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Helpers
{
    public static class RouteH3Converter
    {
        /// <summary>
        /// Converts an ordered sequence of route points into an ordered
        /// sequence of H3 cells.
        ///
        /// Between every two consecutive route points, GridPathCells()
        /// is used to fill the H3 cells between them.
        /// </summary>
        public static List<H3Index> Convert(
            List<GeoPoint> routePoints,
            int resolution)
        {
            if (routePoints == null)
                throw new ArgumentNullException(nameof(routePoints));

            if (routePoints.Count == 0)
                return new List<H3Index>();

            if (resolution < 0 || resolution > 15)
                throw new ArgumentOutOfRangeException(
                    nameof(resolution),
                    "H3 resolution must be between 0 and 15.");

            // ---------------------------------------------------------
            // 1. Convert every lat/lng point to H3
            // ---------------------------------------------------------

            var pointCells = new List<H3Index>(
                routePoints.Count);

            foreach (var point in routePoints)
            {
                // H3 expects latitude/longitude in radians in the GeoCoord struct
                var geo = new GeoCoord { Latitude = ToRadians(point.Latitude), Longitude = ToRadians(point.Longitude) };
                var cell = H3Index.FromGeoCoord(geo, resolution);

                pointCells.Add(cell);
            }

            return pointCells;


        }

        private static double ToRadians(double degrees) => degrees * (Math.PI / 180.0);

    }
}
