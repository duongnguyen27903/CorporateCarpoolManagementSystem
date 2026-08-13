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
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var booking = await _bookingService.CreateBookingAsync(int.Parse(employeeIdClaim), request.TripId);
                return Ok(new BookingResponse(booking.BookingId, booking.TripId, booking.PassengerId, booking.Status, booking.CancelReason, booking.CheckInTime, booking.CreatedAt));
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var bookings = await _bookingService.GetBookingsByPassengerAsync(int.Parse(employeeIdClaim));
            var resp = bookings.Select(b => new BookingResponse(b.BookingId, b.TripId, b.PassengerId, b.Status, b.CancelReason, b.CheckInTime, b.CreatedAt));
            return Ok(resp);
        }

        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> ConfirmBooking(int id)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var booking = await _bookingService.ConfirmBookingAsync(int.Parse(employeeIdClaim), id);
                return Ok(new BookingResponse(booking.BookingId, booking.TripId, booking.PassengerId, booking.Status, booking.CancelReason, booking.CheckInTime, booking.CreatedAt));
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

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var booking = await _bookingService.CancelBookingAsync(int.Parse(employeeIdClaim), id);
                return Ok(new BookingResponse(booking.BookingId, booking.TripId, booking.PassengerId, booking.Status, booking.CancelReason, booking.CheckInTime, booking.CreatedAt));
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

        [HttpPut("{id}/checkin")]
        public async Task<IActionResult> CheckInBooking(int id)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var booking = await _bookingService.CheckInBookingAsync(int.Parse(employeeIdClaim), id);
                return Ok(new BookingResponse(booking.BookingId, booking.TripId, booking.PassengerId, booking.Status, booking.CancelReason, booking.CheckInTime, booking.CreatedAt));
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
