using CarpoolSystem.API.DTOs;
using CarpoolSystem.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ZoneController : ControllerBase
    {
        private readonly IZoneService _zoneService;

        public ZoneController(IZoneService zoneService)
        {
            _zoneService = zoneService;
        }

        // 1. Create a new zone (Admin only)
        [HttpPost]
        public async Task<IActionResult> CreateZone([FromBody] CreateZoneRequest request)
        {
            try
            {
                var zone = await _zoneService.CreateZoneAsync(request.ZoneName, request.Latitude, request.Longitude);
                return Ok(new ZoneResponse(zone.ZoneId, zone.ZoneName, zone.Latitude, zone.Longitude));
            }
            catch (System.ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 2. Get a zone by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetZone(int id)
        {
            var zone = await _zoneService.GetZoneByIdAsync(id);
            if (zone == null) return NotFound();
            return Ok(new ZoneResponse(zone.ZoneId, zone.ZoneName, zone.Latitude, zone.Longitude));
        }

        // 3. Update a zone (Admin only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateZone(int id, [FromBody] UpdateZoneRequest request)
        {
            try
            {
                var zone = await _zoneService.UpdateZoneAsync(id, request.ZoneName, request.Latitude, request.Longitude);
                return Ok(new ZoneResponse(zone.ZoneId, zone.ZoneName, zone.Latitude, zone.Longitude));
            }
            catch (System.InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (System.ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 4. Delete a zone (Admin only)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZone(int id)
        {
            var result = await _zoneService.DeleteZoneAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
