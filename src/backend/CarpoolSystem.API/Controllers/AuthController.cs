using System;
using System.Threading.Tasks;
using CarpoolSystem.API.DTOs;
using CarpoolSystem.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarpoolSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly TokenService _tokenService;

        public AuthController(IEmployeeService employeeService, TokenService tokenService)
        {
            _employeeService = employeeService;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _employeeService.ValidateCredentialsAsync(request.Email, request.Password);
            if (user == null)
            {
                return Unauthorized("Email goac mat khau khong dung");
            }

            var accessToken = _tokenService.GenerateToken(user.EmployeeId, user.Email, user.Role?.RoleName ?? "Employee");
            var refreshToken = _tokenService.GenerateRefreshToken();

            await _employeeService.SaveRefreshTokenAsync(user.EmployeeId, refreshToken);

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                EmployeeId = user.EmployeeId,
                FullName = user.FullName,
                Role = user.Role?.RoleName
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var user = await _employeeService.GetEmployeeByRefreshTokenAsync(request.RefreshToken);
            if (user == null)
            {
                return Unauthorized();
            }

            var accessToken = _tokenService.GenerateToken(user.EmployeeId, user.Email, user.Role?.RoleName ?? "Employee");

            return Ok(new
            {
                AccessToken = accessToken
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = await _employeeService.RegisterEmployeeAsync(request.FullName, request.Email, request.Password, request.DepartmentId, request.RoleId);
                return Ok(new EmployeeResponse(user.EmployeeId, user.FullName, user.Email, user.Phone, user.DepartmentId, user.RoleId, user.IsActive, user.CreatedAt));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}