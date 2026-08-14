using CarpoolSystem.Application.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Interfaces
{
    /// <summary>
    /// Abstraction for encoding/decoding polyline strings.
    /// </summary>
    public interface IPolylineService
    {
        string Encode(IEnumerable<GeoPoint> points);
        IEnumerable<GeoPoint> Decode(string encodedPolyline);
    }
}
