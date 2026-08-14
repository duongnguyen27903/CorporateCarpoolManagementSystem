using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Interfaces
{
    public interface IMatchingService
    {
        Task<IReadOnlyList<int>> FindMatchingRouteDetailAsync(
            IReadOnlyCollection<long> pickupCells,
            IReadOnlyCollection<long> dropoffCells,
            TimeOnly desiredDepartureTime,
            TimeSpan tolerance,
            CancellationToken cancellationToken = default);
    }
}
