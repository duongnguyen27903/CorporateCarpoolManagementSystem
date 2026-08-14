using CarpoolSystem.Application.Helpers;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Application.Models;
using CarpoolSystem.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RouteDetailController : ControllerBase
    {
        private readonly IRouteDetailService _routeDetailService;
        private readonly IPolylineService _polylineService;

        public RouteDetailController(IRouteDetailService routeDetailService, IPolylineService polylineService)
        {
            _routeDetailService = routeDetailService ?? throw new ArgumentNullException(nameof(routeDetailService));
            _polylineService = polylineService ?? throw new ArgumentNullException(nameof(polylineService));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRouteDetailRequest request)
        {
            if (request is null)
                return BadRequest("Request cannot be null.");

            // Build domain entity
            var routeDetail = new RouteDetail
            {
                RouteId = request.RouteId,
                Direction = request.Direction,
                DepartureTime = request.DepartureTime,
                EncodedPolyline = request.EncodedPolyline
            };

            // Decode polyline to geo points
            var points = _polylineService.Decode(request.EncodedPolyline).ToList();

            // Convert geo points to H3 indexes
            var resolution = 9;
            var h3Indexes = RouteH3Converter.Convert(points, resolution);

            // Map to RouteH3 domain entities
            var h3Entities = h3Indexes.Select((cell, idx) => new RouteH3
            {
                RouteDetailId = 0,
                H3Cell = unchecked((long)(ulong)cell),
                Sequence = (short)idx,
                DepartureTime = request.DepartureTime
            }).ToList();

            var id = await _routeDetailService.CreateRouteDetailAsync(routeDetail, h3Entities);

            return CreatedAtAction(nameof(GetById), new { routeDetailId = id }, id);
        }

        [HttpGet("{routeDetailId:int}")]
        public async Task<IActionResult> GetById(int routeDetailId)
        {
            var route = await _routeDetailService.GetRouteDetailByIdAsync(routeDetailId);
            if (route is null) return NotFound();
            return Ok(route);
        }

        [HttpDelete("{routeDetailId:int}")]
        public async Task<IActionResult> Delete(int routeDetailId)
        {
            await _routeDetailService.DeleteRouteDetailAsync(routeDetailId);
            return NoContent();
        }

        [HttpPut("{routeDetailId:int}")]
        public async Task<IActionResult> Update(int routeDetailId, [FromBody] UpdateRouteDetailRequest request)
        {
            if (request is null) return BadRequest("Request cannot be null.");

            var points = _polylineService.Decode(request.EncodedPolyline).ToList();
            var resolution = 9; //magic number, consider making it configurable
            var h3Indexes = RouteH3Converter.Convert(points, resolution);

            var departure = request.DepartureTime == default
                ? TimeOnly.FromDateTime(DateTimeOffset.Now.DateTime)
                : request.DepartureTime;

            var h3Entities = h3Indexes.Select((cell, idx) => new RouteH3
            {
                RouteDetailId = 0,
                H3Cell = unchecked((long)(ulong)cell),
                Sequence = (short)idx,
                DepartureTime = departure
            }).ToList();

            await _routeDetailService.UpdateRouteDetailAsync(routeDetailId, request.EncodedPolyline, h3Entities);
            return NoContent();
        }
    }

    // DTOs used by the controller. Kept local to avoid adding new files.
    public class CreateRouteDetailRequest
    {
        public int RouteId { get; set; }
        public byte Direction { get; set; }
        public TimeOnly DepartureTime { get; set; }
        public required string EncodedPolyline { get; set; }
    }

    public class UpdateRouteDetailRequest
    {
        public required string EncodedPolyline { get; set; }
        public TimeOnly DepartureTime { get; set; } // made nullable
    }
}
//1. fiels and constructor
// create a private readonly field for IRouteDetailService
// create a constructor that takes IRouteDetailService as parameter and assigns it to the private field
//2. Create Method
// create RouteDetail using CreateRouteDetailRequest DTO, which contains RouteId, Direction, DepartureTime, and EncodedPolyline
// create List<GeoPoint> from RouteDetail.EncodedPolyline using PolylineDecoder.DecodePolyline
//create List<H3Index> from List<GeoPoint> using RouteH3Converter.Convert
// create a POST endpoint that takes a RouteDetail and a list of RouteH3 as parameters, calls the CreateRouteDetailAsync method of the service
//3. Delete Method
// create a DELETE endpoint that takes a routeDetailId as parameter, calls the DeleteRouteDetailAsync method of the service
//4. Get Method
// create a GET endpoint that takes a routeDetailId as parameter, calls the GetRouteDetailByIdAsync method of the service
//5. Update Method
// create a PUT endpoint that takes a routeDetailId and a RouteDetail as parameters, calls the UpdateRouteDetailAsync method of the service