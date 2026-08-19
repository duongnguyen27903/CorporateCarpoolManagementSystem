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
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(
            IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var role =
                await _roleService.GetRoleByIdAsync(id);

            if (role == null)
            {
                return NotFound(
                    $"Role with id {id} not found."
                );
            }

            var response = new RoleResponse(
                role.RoleId,
                role.RoleName
            );

            return Ok(response);
        }
    }
}