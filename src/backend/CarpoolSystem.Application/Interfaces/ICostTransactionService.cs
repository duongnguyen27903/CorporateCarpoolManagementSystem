using System.Collections.Generic;
using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface ICostTransactionService
    {
        Task CalculateCostForTripAsync(int tripId);
        Task<IEnumerable<CostTransaction>> GetCostHistoryAsync(int employeeId, string? month);
        Task<IEnumerable<CostTransaction>> GetCostsByTripAsync(int tripId);
    }
}
