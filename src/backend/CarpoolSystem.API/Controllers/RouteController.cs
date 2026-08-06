using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CarpoolSystem.API.DTOs;
using CarpoolSystem.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RouteController : ControllerBase
    {
        private readonly IRouteService _routeService;

        public RouteController(IRouteService routeService)
        {
            _routeService = routeService;
        }

        /// <summary>
        /// Tạo lộ trình mới cho employee hiện tại
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateRoute([FromBody] CreateRouteRequest request)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var route = await _routeService.CreateRouteAsync(int.Parse(employeeIdClaim), request.StartZoneId, request.EndZoneId, request.StartTime, request.DaysOfWeek);
            return Ok(new RouteResponse(route.RouteId, route.EmployeeId, route.StartZoneId, route.EndZoneId, route.StartTime, route.DaysOfWeek, route.IsActive));
        }

        /// <summary>
        /// Lấy danh sách lộ trình của employee hiện tại
        /// </summary>
        [HttpGet("my-routes")]
        public async Task<IActionResult> GetMyRoutes()
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var routes = await _routeService.GetRoutesByEmployeeAsync(int.Parse(employeeIdClaim));
            var response = routes.Select(r => new RouteResponse(r.RouteId, r.EmployeeId, r.StartZoneId, r.EndZoneId, r.StartTime, r.DaysOfWeek, r.IsActive));
            return Ok(response);
        }

        /// <summary>
        /// Lấy chi tiết lộ trình
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            var route = await _routeService.GetRouteByIdAsync(id);
            if (route == null) return NotFound();
            return Ok(new RouteResponse(route.RouteId, route.EmployeeId, route.StartZoneId, route.EndZoneId, route.StartTime, route.DaysOfWeek, route.IsActive));
        }

        /// <summary>
        /// Cập nhật lộ trình (chỉ owner)
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoute(int id, [FromBody] UpdateRouteRequest request)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var route = await _routeService.UpdateRouteAsync(int.Parse(employeeIdClaim), id, request.StartZoneId, request.EndZoneId, request.StartTime, request.DaysOfWeek);
                return Ok(new RouteResponse(route.RouteId, route.EmployeeId, route.StartZoneId, route.EndZoneId, route.StartTime, route.DaysOfWeek, route.IsActive));
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

        /// <summary>
        /// Xóa lộ trình (chỉ owner)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            try
            {
                var result = await _routeService.DeleteRouteAsync(int.Parse(employeeIdClaim), id);
                if (!result) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}
