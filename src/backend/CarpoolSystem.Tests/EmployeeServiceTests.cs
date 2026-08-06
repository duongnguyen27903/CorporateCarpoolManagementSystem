using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Application.Services;
using CarpoolSystem.Domain.Entities;
using Moq;
using Xunit;

namespace CarpoolSystem.Tests
{
    public class EmployeeServiceTests
    {
        [Fact]
        public async Task ValidateCredentialsAsync_ValidCredentials_ReturnsEmployee()
        {
            // Arrange
            var password = "SecurePassword123!";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var mockEmployee = new Employee 
            { 
                EmployeeId = 1,
                Email = "test@company.com",
                PasswordHash = hashedPassword,
                RoleId = 2
            };

            var mockRole = new Role { RoleId = 2, RoleName = "Driver" };

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockEmployeeRepo = new Mock<IGenericRepository<Employee>>();
            var mockRoleRepo = new Mock<IGenericRepository<Role>>();

            mockEmployeeRepo
                .Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Employee, bool>>>()))
                .ReturnsAsync(new List<Employee> { mockEmployee });

            mockRoleRepo
                .Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(mockRole);

            mockUnitOfWork.Setup(u => u.Repository<Employee>()).Returns(mockEmployeeRepo.Object);
            mockUnitOfWork.Setup(u => u.Repository<Role>()).Returns(mockRoleRepo.Object);

            var service = new EmployeeService(mockUnitOfWork.Object);

            // Act
            var result = await service.ValidateCredentialsAsync("test@company.com", password);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test@company.com", result.Email);
            Assert.Equal("Driver", result.Role.RoleName);
        }

        [Fact]
        public async Task ValidateCredentialsAsync_InvalidPassword_ReturnsNull()
        {
            // Arrange
            var password = "SecurePassword123!";
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var mockEmployee = new Employee 
            { 
                EmployeeId = 1,
                Email = "test@company.com",
                PasswordHash = hashedPassword,
                RoleId = 2
            };

            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockEmployeeRepo = new Mock<IGenericRepository<Employee>>();
            var mockRoleRepo = new Mock<IGenericRepository<Role>>();

            mockEmployeeRepo
                .Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Employee, bool>>>()))
                .ReturnsAsync(new List<Employee> { mockEmployee });

            mockRoleRepo
                .Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Role { RoleId = 2, RoleName = "Driver" });

            mockUnitOfWork.Setup(u => u.Repository<Employee>()).Returns(mockEmployeeRepo.Object);
            mockUnitOfWork.Setup(u => u.Repository<Role>()).Returns(mockRoleRepo.Object);

            var service = new EmployeeService(mockUnitOfWork.Object);

            // Act
            var result = await service.ValidateCredentialsAsync("test@company.com", "WrongPassword!");

            // Assert
            Assert.Null(result);
        }
    }
}