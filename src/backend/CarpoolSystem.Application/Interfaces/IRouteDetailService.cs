using CarpoolSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Interfaces
{
    public interface IRouteDetailService
    {
        Task<int> CreateRouteDetailAsync(RouteDetail route, IReadOnlyList<RouteH3> h3Cells);
        Task DeleteRouteDetailAsync(int routeId);
        Task<RouteDetail?> GetRouteDetailByIdAsync(int routeDetailId);
        Task UpdateRouteDetailAsync(int routeId, string encodedPolyline, IReadOnlyList<RouteH3> newH3Cells);
    }
}
