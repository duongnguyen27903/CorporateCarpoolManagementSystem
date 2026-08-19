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
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(
            IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var department =
                await _departmentService.GetDepartmentByIdAsync(id);

            if (department == null)
            {
                return NotFound(
                    $"Department with id {id} not found."
                );
            }

            var response = new DepartmentResponse(
                department.DepartmentId,
                department.DepartmentName,
                department.IsActive
            );

            return Ok(response);
        }
    }
}