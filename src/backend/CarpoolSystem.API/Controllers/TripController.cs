using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CarpoolSystem.Application.DTOs;
using CarpoolSystem.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripController(ITripService tripService)
        {
            _tripService = tripService;
        }

        // Driver tạo chuyến từ route
        [HttpPost]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> CreateTrip([FromBody] CreateTripRequest request)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var trip = await _tripService.CreateTripAsync(int.Parse(employeeIdClaim), request.RouteId, request.VehicleId, request.DepartureTime, request.AvailableSeats);
            return Ok(new TripResponse(trip.TripId, trip.RouteId, trip.DriverId, trip.VehicleId, trip.DepartureTime, trip.AvailableSeats, trip.Status, trip.CreatedAt));
        }

        // Lấy chuyến của driver hiện tại
        [HttpGet("my-trips")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetMyTrips()
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var trips = await _tripService.GetTripsByDriverAsync(int.Parse(employeeIdClaim));
            var resp = trips.Select(t => new TripResponse(t.TripId, t.RouteId, t.DriverId, t.VehicleId, t.DepartureTime, t.AvailableSeats, t.Status, t.CreatedAt));
            return Ok(resp);
        }

        // Lấy các chuyến Open để passenger tìm
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveTrips()
        {
            var trips = await _tripService.GetActiveTripsAsync();
            var resp = trips.Select(t => new TripResponse(t.TripId, t.RouteId, t.DriverId, t.VehicleId, t.DepartureTime, t.AvailableSeats, t.Status, t.CreatedAt));
            return Ok(resp);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrip(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id);
            if (trip == null) return NotFound();
            return Ok(new TripResponse(trip.TripId, trip.RouteId, trip.DriverId, trip.VehicleId, trip.DepartureTime, trip.AvailableSeats, trip.Status, trip.CreatedAt));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTripStatusRequest request)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var trip = await _tripService.UpdateTripStatusAsync(int.Parse(employeeIdClaim), id, request.Status);
                return Ok(new TripResponse(trip.TripId, trip.RouteId, trip.DriverId, trip.VehicleId, trip.DepartureTime, trip.AvailableSeats, trip.Status, trip.CreatedAt));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
