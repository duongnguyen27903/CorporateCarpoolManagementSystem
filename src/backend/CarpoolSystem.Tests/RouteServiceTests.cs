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
    public class RouteServiceTests
    {
        [Fact]
        public async Task CreateRouteAsync_ValidInput_ReturnsRoute()
        {
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockEmployeeRepo = new Mock<IGenericRepository<Employee>>();
            var mockRouteRepo = new Mock<IGenericRepository<Route>>();

            mockEmployeeRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Employee { EmployeeId = 1 });
            mockRouteRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<Route, bool>>>())).ReturnsAsync(new List<Route>());

            mockUnitOfWork.Setup(u => u.Repository<Employee>()).Returns(mockEmployeeRepo.Object);
            mockUnitOfWork.Setup(u => u.Repository<Route>()).Returns(mockRouteRepo.Object);

            var service = new RouteService(mockUnitOfWork.Object);

            var result = await service.CreateRouteAsync(1, 1, 2, new TimeOnly(8, 0), "Mon-Fri");

            Assert.NotNull(result);
            Assert.Equal(1, result.EmployeeId);
            mockRouteRepo.Verify(r => r.AddAsync(It.IsAny<Route>()), Times.Once);
            mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateRouteAsync_NotOwner_ThrowsUnauthorizedAccessException()
        {
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockRouteRepo = new Mock<IGenericRepository<Route>>();

            mockRouteRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(new Route { RouteId = 10, EmployeeId = 2 });
            mockUnitOfWork.Setup(u => u.Repository<Route>()).Returns(mockRouteRepo.Object);

            var service = new RouteService(mockUnitOfWork.Object);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.UpdateRouteAsync(1, 10, 1, 2, new TimeOnly(8,0), "Mon-Fri"));
        }

        [Fact]
        public async Task DeleteRouteAsync_Owner_RemovesRoute()
        {
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockRouteRepo = new Mock<IGenericRepository<Route>>();

            mockRouteRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(new Route { RouteId = 5, EmployeeId = 1 });
            mockUnitOfWork.Setup(u => u.Repository<Route>()).Returns(mockRouteRepo.Object);

            var service = new RouteService(mockUnitOfWork.Object);

            var result = await service.DeleteRouteAsync(1, 5);

            Assert.True(result);
            mockRouteRepo.Verify(r => r.Remove(It.IsAny<Route>()), Times.Once);
            mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
