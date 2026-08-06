using System.Collections.Generic;
using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface IEmployeeService
    {
        Task<Employee> RegisterEmployeeAsync(string fullName, string email, string password, int departmentId, int roleId);
        Task<Employee?> ValidateCredentialsAsync(string email, string password);
        Task<Employee> UpdateProfileAsync(int employeeId, string fullName, string phone);
        Task<IEnumerable<Employee>> GetEmployeesByDepartmentAsync(int departmentId, int pageNumber, int pageSize);
        Task SaveRefreshTokenAsync(int employeeId, string refreshToken);
        Task<Employee?> GetEmployeeByRefreshTokenAsync(string refreshToken);
    }
}