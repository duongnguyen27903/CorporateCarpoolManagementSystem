using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class RouteService : IRouteService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RouteService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Route> CreateRouteAsync(int employeeId, int startZoneId, int endZoneId, TimeOnly startTime, string daysOfWeek)
        {
            // validate employee exists
            var employeeRepo = _unitOfWork.Repository<Employee>();
            var employee = await employeeRepo.GetByIdAsync(employeeId);
            if (employee == null)
                throw new InvalidOperationException("Employee not found");

            // check duplicate route for same employee
            var routeRepo = _unitOfWork.Repository<Route>();
            var existing = await routeRepo.FindAsync(r => r.EmployeeId == employeeId && r.StartZoneId == startZoneId && r.EndZoneId == endZoneId && r.StartTime == startTime);
            if (existing.Any())
            {
                throw new InvalidOperationException("Route duplicate");
            }

            var route = new Route
            {
                EmployeeId = employeeId,
                StartZoneId = startZoneId,
                EndZoneId = endZoneId,
                StartTime = startTime,
                DaysOfWeek = daysOfWeek,
                IsActive = true
            };

            await routeRepo.AddAsync(route);
            await _unitOfWork.SaveChangesAsync();

            return route;
        }

        public async Task<IEnumerable<Route>> GetRoutesByEmployeeAsync(int employeeId)
        {
            var routeRepo = _unitOfWork.Repository<Route>();
            return await routeRepo.FindAsync(r => r.EmployeeId == employeeId && r.IsActive);
        }

        public async Task<Route?> GetRouteByIdAsync(int id)
        {
            var routeRepo = _unitOfWork.Repository<Route>();
            return await routeRepo.GetByIdAsync(id);
        }

        public async Task<Route> UpdateRouteAsync(int employeeId, int routeId, int startZoneId, int endZoneId, TimeOnly startTime, string daysOfWeek)
        {
            var routeRepo = _unitOfWork.Repository<Route>();
            var route = await routeRepo.GetByIdAsync(routeId);
            if (route == null)
                throw new InvalidOperationException("Route not found");

            if (route.EmployeeId != employeeId)
                throw new UnauthorizedAccessException("Not allowed to update this route");

            // check duplicate (exclude current)
            var duplicates = await routeRepo.FindAsync(r => r.EmployeeId == employeeId && r.StartZoneId == startZoneId && r.EndZoneId == endZoneId && r.StartTime == startTime && r.RouteId != routeId);
            if (duplicates.Any())
                throw new InvalidOperationException("Another route with same parameters exists");

            route.StartZoneId = startZoneId;
            route.EndZoneId = endZoneId;
            route.StartTime = startTime;
            route.DaysOfWeek = daysOfWeek;

            routeRepo.Update(route);
            await _unitOfWork.SaveChangesAsync();

            return route;
        }

        public async Task<bool> DeleteRouteAsync(int employeeId, int routeId)
        {
            var routeRepo = _unitOfWork.Repository<Route>();
            var route = await routeRepo.GetByIdAsync(routeId);
            if (route == null)
                return false;

            if (route.EmployeeId != employeeId)
                throw new UnauthorizedAccessException("Not allowed to delete this route");

            // remove route
            routeRepo.Remove(route);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
