using CarpoolSystem.Application.DTOs;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Services
{
    public class MatchingService : IMatchingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MatchingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IReadOnlyList<RouteDetailResponseDto>> FindMatchingRouteDetailAsync(
            IReadOnlyCollection<long> pickupCells,
            IReadOnlyCollection<long> dropoffCells,
            TimeOnly desiredDepartureTime,
            TimeSpan tolerance,
            CancellationToken cancellationToken = default)
        {
            var from = desiredDepartureTime.Add(-tolerance);
            var to = desiredDepartureTime.Add(tolerance);

            var h3Repo = _unitOfWork.Repository<RouteH3>();

            var pickupMatches = (await h3Repo.FindAsync(x =>
                    pickupCells.Contains(x.H3Cell) &&
                    x.DepartureTime >= from &&
                    x.DepartureTime <= to)).ToList();

            var dropoffMatches = (await h3Repo.FindAsync(x =>
                    dropoffCells.Contains(x.H3Cell) &&
                    x.DepartureTime >= from &&
                    x.DepartureTime <= to)).ToList();

            var pickupCandidates = pickupMatches
                .GroupBy(x => x.RouteDetailId)
                .Select(g => new
                {
                    RouteDetailId = g.Key,
                    PickupSeq = g.Min(x => x.Sequence)
                });

            var dropoffCandidates = dropoffMatches
                .GroupBy(x => x.RouteDetailId)
                .Select(g => new
                {
                    RouteDetailId = g.Key,
                    DropoffSeq = g.Max(x => x.Sequence)
                });

            var resultIds = (from p in pickupCandidates
                             join d in dropoffCandidates
                                 on p.RouteDetailId equals d.RouteDetailId
                             where p.PickupSeq < d.DropoffSeq
                             select p.RouteDetailId)
                .Distinct()
                .ToList();

            if (!resultIds.Any())
                return Array.Empty<RouteDetailResponseDto>();

            var routeDetailRepo = _unitOfWork.Repository<RouteDetail>();
            var matchedRouteDetails = await routeDetailRepo.FindAsync(x => resultIds.Contains(x.RouteDetailId));
            var result = matchedRouteDetails.Select(rd => new RouteDetailResponseDto
            {
                RouteDetailId = rd.RouteDetailId,
                RouteDetailName = rd.RouteDetailName,
                RouteId = rd.RouteId,
                Direction = rd.Direction,
                DepartureTime = rd.DepartureTime,
                EncodedPolyline = rd.EncodedPolyline
            }).ToList();

            return result;
        }
    }
}
