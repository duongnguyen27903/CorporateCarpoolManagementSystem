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
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("department/{departmentId}")]
        public async Task<IActionResult> GetEmployeesByDepartment(int departmentId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var employees = await _employeeService.GetEmployeesByDepartmentAsync(departmentId, pageNumber, pageSize);

            var response = employees.Select(e => new EmployeeResponse(
                e.EmployeeId, e.FullName, e.Email, e.Phone, e.DepartmentId, e.RoleId, e.IsActive, e.CreatedAt
            ));

            return Ok(response);
        }

        [HttpPut("{id}/profile")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
        {
            try
            {
                var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;

                if (employeeIdClaim == null || int.Parse(employeeIdClaim) != id)
                {
                    return Forbid();
                }

                var employee = await _employeeService.UpdateProfileAsync(id, request.FullName, request.Phone);
                return Ok(new EmployeeResponse(employee.EmployeeId, employee.FullName, employee.Email, employee.Phone, employee.DepartmentId, employee.RoleId, employee.IsActive, employee.CreatedAt));
            }
            catch (System.InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var employeeIdClaim = User.Claims
                .FirstOrDefault(c => c.Type == "employeeId")
                ?.Value;

            if (employeeIdClaim == null ||
                !int.TryParse(employeeIdClaim, out var employeeId))
            {
                return Unauthorized();
            }

            var employee = await _employeeService.GetEmployeeByIdAsync(employeeId);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            var response = new EmployeeResponse(
                employee.EmployeeId,
                employee.FullName,
                employee.Email,
                employee.Phone,
                employee.DepartmentId,
                employee.RoleId,
                employee.IsActive,
                employee.CreatedAt
            );

            return Ok(response);
        }
    }
}