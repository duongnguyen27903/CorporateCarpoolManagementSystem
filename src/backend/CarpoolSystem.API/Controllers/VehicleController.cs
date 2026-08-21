using System;
using System.Linq;
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
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterVehicle([FromBody] RegisterVehicleRequest request)
        {
            try
            {
                var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
                if (employeeIdClaim == null) return Unauthorized();

                var vehicle = await _vehicleService.RegisterVehicleAsync(int.Parse(employeeIdClaim), request.LicensePlate, request.VehicleType, request.SeatCount);
                return Ok(new VehicleResponse(vehicle.VehicleId, vehicle.EmployeeId, vehicle.LicensePlate, vehicle.VehicleType, vehicle.SeatCount, vehicle.IsActive));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("my-vehicles")]
        public async Task<IActionResult> GetMyVehicles()
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            if (employeeIdClaim == null) return Unauthorized();

            var vehicles = await _vehicleService.GetVehiclesByEmployeeAsync(int.Parse(employeeIdClaim));
            var response = vehicles.Select(v => new VehicleResponse(v.VehicleId, v.EmployeeId, v.LicensePlate, v.VehicleType, v.SeatCount, v.IsActive));

            return Ok(response);
        }

        [HttpGet("employee/{employeeId:int}")]
        public async Task<IActionResult> GetEmployeeVehicles(int employeeId)
        {
            var vehicles = await _vehicleService.GetVehiclesByEmployeeAsync(employeeId);
            var response = vehicles.Select(v => new VehicleResponse(
                v.VehicleId,
                v.EmployeeId,
                v.LicensePlate,
                v.VehicleType,
                v.SeatCount,
                v.IsActive
            ));

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] UpdateVehicleRequest request)
        {
            try
            {
                var vehicle = await _vehicleService.UpdateVehicleAsync(id, request.VehicleType, request.SeatCount);
                return Ok(new VehicleResponse(vehicle.VehicleId, vehicle.EmployeeId, vehicle.LicensePlate, vehicle.VehicleType, vehicle.SeatCount, vehicle.IsActive));
            }
            catch (Exception ex) when (ex is ArgumentException || ex is InvalidOperationException)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeactivateVehicle(int id)
        {
            var result = await _vehicleService.DeactivateVehicleAsync(id);
            if (!result) return NotFound("Vehicle not found");
            return NoContent();
        }
    }
}