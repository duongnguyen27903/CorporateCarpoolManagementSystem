using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Services;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;
using RouteEntity = CarpoolSystem.Domain.Entities.Route;
using Moq;
using Xunit;

namespace CarpoolSystem.Tests
{
    public class CostTransactionServiceTests
    {
        [Fact]
        public async Task CalculateCostForTripAsync_NoParticipants_Throws()
        {
            var mockUow = new Mock<IUnitOfWork>();
            var mockTripRepo = new Mock<IGenericRepository<Trip>>();
            var mockRouteRepo = new Mock<IGenericRepository<Route>>();
            var mockZoneRepo = new Mock<IGenericRepository<Zone>>();
            var mockBookingRepo = new Mock<IGenericRepository<Booking>>();
            var mockCtRepo = new Mock<IGenericRepository<CostTransaction>>();

            mockTripRepo.Setup(t => t.GetByIdAsync(1)).ReturnsAsync(new Trip { TripId = 1, RouteId = 2, Status = "Completed" });
            mockRouteRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new RouteEntity { RouteId = 2, StartZoneId = 3, EndZoneId = 4 });
            mockZoneRepo.Setup(z => z.GetByIdAsync(3)).ReturnsAsync(new Zone { ZoneId = 3, Latitude = 10.0m, Longitude = 20.0m });
            mockZoneRepo.Setup(z => z.GetByIdAsync(4)).ReturnsAsync(new Zone { ZoneId = 4, Latitude = 10.0m, Longitude = 20.0m });
            mockBookingRepo.Setup(b => b.FindAsync(It.IsAny<Expression<Func<Booking, bool>>>())).ReturnsAsync(new List<Booking>());

            mockUow.Setup(u => u.Repository<Trip>()).Returns(mockTripRepo.Object);
            mockUow.Setup(u => u.Repository<Route>()).Returns(mockRouteRepo.Object);
            mockUow.Setup(u => u.Repository<Zone>()).Returns(mockZoneRepo.Object);
            mockUow.Setup(u => u.Repository<Booking>()).Returns(mockBookingRepo.Object);
            mockUow.Setup(u => u.Repository<CostTransaction>()).Returns(mockCtRepo.Object);

            var service = new CostTransactionService(mockUow.Object);

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.CalculateCostForTripAsync(1));
        }

        [Fact]
        public async Task CalculateCostForTripAsync_WithParticipants_CreatesTransactions()
        {
            var mockUow = new Mock<IUnitOfWork>();
            var mockTripRepo = new Mock<IGenericRepository<Trip>>();
            var mockRouteRepo = new Mock<IGenericRepository<Route>>();
            var mockZoneRepo = new Mock<IGenericRepository<Zone>>();
            var mockBookingRepo = new Mock<IGenericRepository<Booking>>();
            var mockCtRepo = new Mock<IGenericRepository<CostTransaction>>();

            mockTripRepo.Setup(t => t.GetByIdAsync(1)).ReturnsAsync(new Trip { TripId = 1, RouteId = 2, Status = "Completed" });
            mockRouteRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new RouteEntity { RouteId = 2, StartZoneId = 3, EndZoneId = 4 });
            mockZoneRepo.Setup(z => z.GetByIdAsync(3)).ReturnsAsync(new Zone { ZoneId = 3, Latitude = 10.0m, Longitude = 20.0m });
            mockZoneRepo.Setup(z => z.GetByIdAsync(4)).ReturnsAsync(new Zone { ZoneId = 4, Latitude = 10.1m, Longitude = 20.1m });

            var booking = new Booking { BookingId = 5, TripId = 1, PassengerId = 7, Status = "CheckedIn" };
            mockBookingRepo.Setup(b => b.FindAsync(It.IsAny<Expression<Func<Booking, bool>>>())).ReturnsAsync(new List<Booking> { booking });

            mockUow.Setup(u => u.Repository<Trip>()).Returns(mockTripRepo.Object);
            mockUow.Setup(u => u.Repository<Route>()).Returns(mockRouteRepo.Object);
            mockUow.Setup(u => u.Repository<Zone>()).Returns(mockZoneRepo.Object);
            mockUow.Setup(u => u.Repository<Booking>()).Returns(mockBookingRepo.Object);
            mockUow.Setup(u => u.Repository<CostTransaction>()).Returns(mockCtRepo.Object);

            var service = new CostTransactionService(mockUow.Object);

            await service.CalculateCostForTripAsync(1);

            mockCtRepo.Verify(ct => ct.AddAsync(It.IsAny<CostTransaction>()), Times.Once);
            mockUow.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
