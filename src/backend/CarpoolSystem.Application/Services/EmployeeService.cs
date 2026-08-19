using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public EmployeeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Employee> RegisterEmployeeAsync(string fullName, string email, string password, int departmentId, int roleId)
        {
            var repo = _unitOfWork.Repository<Employee>();
            var existing = await repo.FindAsync(e => e.Email == email);

            if (existing.Any())
            {
                throw new InvalidOperationException("Email da duoc su dung");
            }

            var employee = new Employee
            {
                FullName = fullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                DepartmentId = departmentId,
                RoleId = roleId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await repo.AddAsync(employee);
            await _unitOfWork.SaveChangesAsync();

            return employee;
        }

        public async Task<Employee?> ValidateCredentialsAsync(string email, string password)
        {
            var repo = _unitOfWork.Repository<Employee>();
            var users = await repo.FindAsync(e => e.Email == email);
            var user = users.FirstOrDefault();

            var roleRepo = _unitOfWork.Repository<Role>();
            if (user != null)
            {
                user.Role = await roleRepo.GetByIdAsync(user.RoleId);
            }

            // Diagnostic logging to help integration test debugging
            try
            {
                if (user == null)
                {
                    Console.WriteLine($"ValidateCredentials: no user found for email={email}");
                }
                else
                {
                    Console.WriteLine($"ValidateCredentials: found userId={user.EmployeeId}, email={user.Email}, pwdHashPrefix={user.PasswordHash?.Substring(0, Math.Min(6, user.PasswordHash.Length))}");
                }
            }
            catch { }

            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return user;
            }

            return null;
        }

        public async Task<Employee> UpdateProfileAsync(int employeeId, string fullName, string phone)
        {
            var repo = _unitOfWork.Repository<Employee>();
            var employee = await repo.GetByIdAsync(employeeId);

            if (employee == null)
            {
                throw new InvalidOperationException("Employee not found");
            }

            employee.FullName = fullName;
            employee.Phone = phone;

            repo.Update(employee);
            await _unitOfWork.SaveChangesAsync();

            return employee;
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int employeeId)
        {
            var repo = _unitOfWork.Repository<Employee>();
            return await repo.GetByIdAsync(employeeId);
        }

        public async Task<IEnumerable<Employee>> GetEmployeesByDepartmentAsync(int departmentId, int pageNumber, int pageSize)
        {
            var repo = _unitOfWork.Repository<Employee>();
            var employees = await repo.FindAsync(e => e.DepartmentId == departmentId);

            return employees
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
        }

        public async Task SaveRefreshTokenAsync(int employeeId, string refreshToken)
        {
            var repo = _unitOfWork.Repository<Employee>();
            var employee = await repo.GetByIdAsync(employeeId);
            if (employee != null)
            {
                employee.RefreshToken = refreshToken;
                repo.Update(employee);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<Employee?> GetEmployeeByRefreshTokenAsync(string refreshToken)
        {
            var repo = _unitOfWork.Repository<Employee>();
            var employees = await repo.FindAsync(e => e.RefreshToken == refreshToken);
            return employees.FirstOrDefault();
        }
    }
}