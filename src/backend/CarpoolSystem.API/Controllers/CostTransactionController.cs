using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CarpoolSystem.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CostTransactionController : ControllerBase
    {
        private readonly ICostTransactionService _costService;

        public CostTransactionController(ICostTransactionService costService)
        {
            _costService = costService;
        }

        [HttpGet("my-history")]
        public async Task<IActionResult> GetMyHistory([FromQuery] string? month)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var history = await _costService.GetCostHistoryAsync(int.Parse(employeeIdClaim), month);
            var resp = history.Select(h => new { h.TransactionId, h.TripId, h.EmployeeId, h.Amount, h.TransactionMonth, h.CreatedAt });
            return Ok(resp);
        }

        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetCostsByTrip(int tripId)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            // Allow only Admin or trip driver - simple check: allow Admin for now; driver check in service (or extend)
            if (roleClaim != "Admin")
            {
                // For simplicity, we require Admin to call this endpoint. Extending to driver check requires loading trip and compare IDs.
                return Forbid();
            }

            var costs = await _costService.GetCostsByTripAsync(tripId);
            var resp = costs.Select(h => new { h.TransactionId, h.TripId, h.EmployeeId, h.Amount, h.TransactionMonth, h.CreatedAt });
            return Ok(resp);
        }
    }
}
