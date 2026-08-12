using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CarpoolSystem.Application.Services;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;
using Moq;
using Xunit;

namespace CarpoolSystem.Tests
{
    public class TripServiceTests
    {
        [Fact]
        public async Task CreateTripAsync_ValidInput_CreatesTrip()
        {
            var mockUow = new Mock<IUnitOfWork>();
            var mockRouteRepo = new Mock<IGenericRepository<Route>>();
            var mockVehicleRepo = new Mock<IGenericRepository<Vehicle>>();
            var mockTripRepo = new Mock<IGenericRepository<Trip>>();

            mockRouteRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Route { RouteId = 1, EmployeeId = 1 });
            mockVehicleRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new Vehicle { VehicleId = 2, EmployeeId = 1, SeatCount = 4 });

            mockUow.Setup(u => u.Repository<Route>()).Returns(mockRouteRepo.Object);
            mockUow.Setup(u => u.Repository<Vehicle>()).Returns(mockVehicleRepo.Object);
            mockUow.Setup(u => u.Repository<Trip>()).Returns(mockTripRepo.Object);

            var service = new TripService(mockUow.Object);

            var result = await service.CreateTripAsync(1, 1, 2, DateTime.UtcNow.AddHours(1), 3);

            Assert.NotNull(result);
            mockTripRepo.Verify(r => r.AddAsync(It.IsAny<Trip>()), Times.Once);
            mockUow.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateTripStatusAsync_NotOwner_ThrowsUnauthorized()
        {
            var mockUow = new Mock<IUnitOfWork>();
            var mockTripRepo = new Mock<IGenericRepository<Trip>>();

            mockTripRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(new Trip { TripId = 10, DriverId = 2 });
            mockUow.Setup(u => u.Repository<Trip>()).Returns(mockTripRepo.Object);

            var service = new TripService(mockUow.Object);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.UpdateTripStatusAsync(1, 10, "Cancelled"));
        }
    }
}
