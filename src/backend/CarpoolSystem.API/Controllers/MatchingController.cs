using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Application.Helpers;
using CarpoolSystem.Application.Models;
namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MatchingController : ControllerBase
    {
        private readonly IMatchingService _matchingService;

        public MatchingController(IMatchingService matchingService)
        {
            _matchingService = matchingService ?? throw new ArgumentNullException(nameof(matchingService));
        }

        [HttpPost("find")]
        public async Task<IActionResult> FindRoute([FromBody] FindRouteRequest request, CancellationToken cancellationToken = default)
        {
            if (request is null) return BadRequest("Request cannot be null.");

            var pickupPoint = new GeoPoint(request.Pickup.Latitude, request.Pickup.Longitude);
            var dropoffPoint = new GeoPoint(request.Dropoff.Latitude, request.Dropoff.Longitude);

            var resolution = 9; //magic number for H3 resolution, can be adjusted based on desired granularity

            // Convert pickup/dropoff to H3 cells and include 1-ring neighbors
            var pickupCell = H3Helper.ToCell(pickupPoint, resolution);
            var dropoffCell = H3Helper.ToCell(dropoffPoint, resolution);

            var pickupCells = H3Neighbors.GetDisk(pickupCell, 1)
                .Select(c => unchecked((long)(ulong)c))
                .ToList();

            var dropoffCells = H3Neighbors.GetDisk(dropoffCell, 1)
                .Select(c => unchecked((long)(ulong)c))
                .ToList();

            var tolerance = TimeSpan.FromMinutes(request.ToleranceMinutes ?? 15);

            var matches = await _matchingService.FindMatchingRouteDetailAsync(
                pickupCells,
                dropoffCells,
                request.DesiredDepartureTime,
                tolerance,
                cancellationToken);

            return Ok(matches);
        }
    }

    public class FindRouteRequest
    {
        public GeoPointDto Pickup { get; set; } = new GeoPointDto();
        public GeoPointDto Dropoff { get; set; } = new GeoPointDto();
        public TimeOnly DesiredDepartureTime { get; set; }
        public int? ToleranceMinutes { get; set; }
    }

    public class GeoPointDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
