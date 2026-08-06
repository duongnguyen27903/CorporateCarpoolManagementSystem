using System.Collections.Generic;
using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface IRouteService
    {
        Task<Route> CreateRouteAsync(int employeeId, int startZoneId, int endZoneId, TimeOnly startTime, string daysOfWeek);
        Task<IEnumerable<Route>> GetRoutesByEmployeeAsync(int employeeId);
        Task<Route?> GetRouteByIdAsync(int id);
        Task<Route> UpdateRouteAsync(int employeeId, int routeId, int startZoneId, int endZoneId, TimeOnly startTime, string daysOfWeek);
        Task<bool> DeleteRouteAsync(int employeeId, int routeId);
    }
}
