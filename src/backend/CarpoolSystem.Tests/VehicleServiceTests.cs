using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Application.Services;
using CarpoolSystem.Domain.Entities;
using Moq;
using Xunit;

namespace CarpoolSystem.Tests
{
    public class VehicleServiceTests
    {
        [Fact]
        public async Task RegisterVehicleAsync_ValidInput_ReturnsVehicle()
        {
            // Arrange
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockEmployeeRepo = new Mock<IGenericRepository<Employee>>();
            var mockVehicleRepo = new Mock<IGenericRepository<Vehicle>>();

            mockEmployeeRepo
                .Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(new Employee { EmployeeId = 1 });

            mockVehicleRepo
                .Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Vehicle, bool>>>()))
                .ReturnsAsync(new List<Vehicle>());

            mockUnitOfWork.Setup(u => u.Repository<Employee>()).Returns(mockEmployeeRepo.Object);
            mockUnitOfWork.Setup(u => u.Repository<Vehicle>()).Returns(mockVehicleRepo.Object);

            var service = new VehicleService(mockUnitOfWork.Object);

            // Act
            var result = await service.RegisterVehicleAsync(1, "29A-123.45", "Sedan", 4);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("29A-123.45", result.LicensePlate);
            Assert.Equal(4, result.SeatCount);
            mockVehicleRepo.Verify(r => r.AddAsync(It.IsAny<Vehicle>()), Times.Once);
            mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task RegisterVehicleAsync_InvalidSeatCount_ThrowsArgumentException()
        {
            // Arrange
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var service = new VehicleService(mockUnitOfWork.Object);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                service.RegisterVehicleAsync(1, "29A-123.45", "Sedan", 9)); // 9 seats is invalid
        }

        [Fact]
        public async Task RegisterVehicleAsync_DuplicateLicensePlate_ThrowsInvalidOperationException()
        {
            // Arrange
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockEmployeeRepo = new Mock<IGenericRepository<Employee>>();
            var mockVehicleRepo = new Mock<IGenericRepository<Vehicle>>();

            mockEmployeeRepo
                .Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(new Employee { EmployeeId = 1 });

            // Mock finding existing vehicle
            mockVehicleRepo
                .Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<Vehicle, bool>>>()))
                .ReturnsAsync(new List<Vehicle> { new Vehicle { LicensePlate = "29A-123.45" } });

            mockUnitOfWork.Setup(u => u.Repository<Employee>()).Returns(mockEmployeeRepo.Object);
            mockUnitOfWork.Setup(u => u.Repository<Vehicle>()).Returns(mockVehicleRepo.Object);

            var service = new VehicleService(mockUnitOfWork.Object);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => 
                service.RegisterVehicleAsync(1, "29A-123.45", "Sedan", 4));
        }
    }
}