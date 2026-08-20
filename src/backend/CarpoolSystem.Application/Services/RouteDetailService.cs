using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Services
{
    public class RouteDetailService : IRouteDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RouteDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CreateRouteDetailAsync(RouteDetail route, IReadOnlyList<RouteH3> h3Cells)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var RouteDetailRepo = _unitOfWork.Repository<RouteDetail>();
                await RouteDetailRepo.AddAsync(route);
                await _unitOfWork.SaveChangesAsync(); // Generates route.DriverRouteId

                var distinctCells = h3Cells
                    .GroupBy(c => c.H3Cell)
                    .Select(g => g.First());

                var h3Entities = distinctCells.Select(cell => new RouteH3
                {
                    RouteDetailId = route.RouteDetailId,
                    H3Cell = cell.H3Cell,
                    Sequence = cell.Sequence,
                    DepartureTime = route.DepartureTime
                });

                await _unitOfWork.Repository<RouteH3>().AddRangeAsync(h3Entities);
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitAsync();
                return route.RouteDetailId;
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task DeleteRouteDetailAsync(int routeDetailId)
        {
            var route = await _unitOfWork.Repository<RouteDetail>().GetByIdAsync(routeDetailId);
            if (route is null) return;

            _unitOfWork.Repository<RouteDetail>().Remove(route);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<RouteDetail?> GetRouteDetailByIdAsync(int routeDetailId)
        {
            return await _unitOfWork.Repository<RouteDetail>().GetByIdAsync(routeDetailId);
        }

        public async Task UpdateRouteDetailAsync(int routeId,string? routeDetailName, string encodedPolyline, IReadOnlyList<RouteH3> newH3Cells)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var route = await _unitOfWork.Repository<RouteDetail>().GetByIdAsync(routeId);
                if (route is null)
                    throw new InvalidOperationException($"DriverRoute {routeId} was not found.");

                // 1. Update route
                route.EncodedPolyline = encodedPolyline;
                route.RouteDetailName = routeDetailName;
                _unitOfWork.Repository<RouteDetail>().Update(route);

                // 2. Remove old H3 cells
                var h3Repo = _unitOfWork.Repository<RouteH3>();
                var old = await h3Repo.FindAsync(h => h.RouteDetailId == routeId);
                foreach (var item in old)
                {
                    h3Repo.Remove(item);
                }
                await _unitOfWork.SaveChangesAsync();

                // 3. Add new H3 cells
                var mapped = newH3Cells
                    .GroupBy(c => c.H3Cell)
                    .Select(g => g.First())
                    .Select(c => new RouteH3
                    {
                        RouteDetailId = routeId,
                        H3Cell = c.H3Cell,
                        Sequence = c.Sequence,
                        DepartureTime = c.DepartureTime
                    });

                await _unitOfWork.Repository<RouteH3>().AddRangeAsync(mapped);
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitAsync();
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
