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
    public class BookingServiceTests
    {
        [Fact]
        public async Task CreateBookingAsync_Valid_ReducesSeats()
        {
            var mockUow = new Mock<IUnitOfWork>();
            var mockTripRepo = new Mock<IGenericRepository<Trip>>();
            var mockBookingRepo = new Mock<IGenericRepository<Booking>>();

            mockTripRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(new Trip { TripId = 5, AvailableSeats = 2 });

            mockUow.Setup(u => u.Repository<Trip>()).Returns(mockTripRepo.Object);
            mockUow.Setup(u => u.Repository<Booking>()).Returns(mockBookingRepo.Object);

            var service = new BookingService(mockUow.Object);

            var booking = await service.CreateBookingAsync(1, 5);

            Assert.NotNull(booking);
            mockTripRepo.Verify(r => r.Update(It.Is<Trip>(t => t.AvailableSeats == 1)), Times.Once);
            mockUow.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ConfirmBookingAsync_ByDriver_Succeeds()
        {
            var mockUow = new Mock<IUnitOfWork>();
            var mockBookingRepo = new Mock<IGenericRepository<Booking>>();
            var mockTripRepo = new Mock<IGenericRepository<Trip>>();

            mockBookingRepo.Setup(b => b.GetByIdAsync(3)).ReturnsAsync(new Booking { BookingId = 3, TripId = 10, PassengerId = 4 });
            mockTripRepo.Setup(t => t.GetByIdAsync(10)).ReturnsAsync(new Trip { TripId = 10, DriverId = 2 });

            mockUow.Setup(u => u.Repository<Booking>()).Returns(mockBookingRepo.Object);
            mockUow.Setup(u => u.Repository<Trip>()).Returns(mockTripRepo.Object);

            var service = new BookingService(mockUow.Object);

            var result = await service.ConfirmBookingAsync(2, 3);

            Assert.Equal("Confirmed", result.Status);
            mockUow.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
