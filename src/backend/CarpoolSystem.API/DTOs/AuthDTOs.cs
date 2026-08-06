using System;

namespace CarpoolSystem.API.DTOs
{
    public record LoginRequest(string Email, string Password);
    public record RefreshRequest(string RefreshToken);
    public record RegisterRequest(string FullName, string Email, string Password, int DepartmentId, int RoleId);
    public record UpdateProfileRequest(string FullName, string Phone);
    public record EmployeeResponse(int EmployeeId, string FullName, string Email, string Phone, int DepartmentId, int RoleId, bool IsActive, DateTime CreatedAt);
}