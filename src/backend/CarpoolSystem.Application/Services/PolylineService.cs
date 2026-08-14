using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Services
{
    public class PolylineService : IPolylineService
    {
        /// <summary>
        /// Encodes a collection of geographic points into a single Polyline string.
        /// </summary>
        public string Encode(IEnumerable<GeoPoint> points)
        {
            if (points == null) return string.Empty;

            var str = new StringBuilder();
            int lastLat = 0;
            int lastLng = 0;

            foreach (var point in points)
            {
                // Scale values to 5 decimal places and round to nearest integer
                int lat = (int)Math.Round(point.Latitude * 1e5);
                int lng = (int)Math.Round(point.Longitude * 1e5);

                // Encode the relative differences (deltas)
                EncodeValue(lat - lastLat, str);
                EncodeValue(lng - lastLng, str);

                lastLat = lat;
                lastLng = lng;
            }

            return str.ToString();
        }

        /// <summary>
        /// Decodes an encoded Polyline string back into an enumeration of geographic points.
        /// </summary>
        public IEnumerable<GeoPoint> Decode(string encodedPolyline)
        {
            if (string.IsNullOrEmpty(encodedPolyline)) yield break;

            int index = 0;
            int len = encodedPolyline.Length;
            int lat = 0;
            int lng = 0;

            while (index < len)
            {
                lat += DecodeValue(encodedPolyline, ref index);
                lng += DecodeValue(encodedPolyline, ref index);

                // Convert back to double and truncate to maximum 5 decimal places
                double latVal = lat * 1e-5;
                double lngVal = lng * 1e-5;
                latVal = Math.Truncate(latVal * 1e5) / 1e5;
                lngVal = Math.Truncate(lngVal * 1e5) / 1e5;
                yield return new GeoPoint(latVal, lngVal);
            }
        }

        private static void EncodeValue(int value, StringBuilder str)
        {
            // Zigzag encoding: shifts negative numbers so that the sign is in the least significant bit
            uint zigzagValue = (uint)((value << 1) ^ (value >> 31));

            while (zigzagValue >= 0x20)
            {
                // Mask 5 bits, OR with 0x20 (continuation bit), add 63 for ASCII offset
                str.Append((char)((int)((zigzagValue & 0x1F) | 0x20) + 63));
                zigzagValue >>= 5;
            }

            // Final chunk (no continuation bit)
            str.Append((char)((int)zigzagValue + 63));
        }

        private static int DecodeValue(string encoded, ref int index)
        {
            int result = 0;
            int shift = 0;
            int b;

            do
            {
                // Read next char, subtract 63 ASCII offset
                b = encoded[index++] - 63;
                // Mask out the continuation bit and place chunk into result
                result |= (b & 0x1F) << shift;
                shift += 5;
            } while (b >= 0x20); // Continue if the 6th bit is set

            // Reverse the zigzag encoding to recover negative values correctly
            int value = ((result & 1) != 0) ? ~(result >> 1) : (result >> 1);
            return value;
        }
    }
}
