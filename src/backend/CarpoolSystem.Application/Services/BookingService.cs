using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BookingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Booking> CreateBookingAsync(int passengerId, int tripId)
        {
            var tripRepo = _unitOfWork.Repository<Trip>();
            var trip = await tripRepo.GetByIdAsync(tripId);
            if (trip == null)
                throw new InvalidOperationException("Trip not found");

            if (trip.AvailableSeats <= 0)
                throw new InvalidOperationException("No available seats");

            // Tạo booking pending
            var booking = new Booking
            {
                TripId = tripId,
                PassengerId = passengerId,
                DriverConfirmed = false,
                PassengerConfirmed = false,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            var bookingRepo = _unitOfWork.Repository<Booking>();
            await bookingRepo.AddAsync(booking);

            // Giảm số ghế trống
            trip.AvailableSeats -= 1;
            tripRepo.Update(trip);

            await _unitOfWork.SaveChangesAsync();

            return booking;
        }

        public async Task<IEnumerable<Booking>> GetBookingsByPassengerAsync(int passengerId)
        {
            var bookingRepo = _unitOfWork.Repository<Booking>();
            return await bookingRepo.FindAsync(b => b.PassengerId == passengerId);
        }

        public async Task<Booking> ConfirmBookingAsync(int driverId, int bookingId)
        {
            var bookingRepo = _unitOfWork.Repository<Booking>();
            var booking = await bookingRepo.GetByIdAsync(bookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            var tripRepo = _unitOfWork.Repository<Trip>();
            var trip = await tripRepo.GetByIdAsync(booking.TripId);
            if (trip == null)
                throw new InvalidOperationException("Trip not found");

            if (trip.DriverId != driverId)
                throw new UnauthorizedAccessException("Not allowed to confirm this booking");

            booking.Status = "Confirmed";
            booking.DriverConfirmed = true;
            bookingRepo.Update(booking);
            await _unitOfWork.SaveChangesAsync();

            return booking;
        }

        public async Task<Booking> CancelBookingAsync(int employeeId, int bookingId)
        {
            var bookingRepo = _unitOfWork.Repository<Booking>();
            var booking = await bookingRepo.GetByIdAsync(bookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            var tripRepo = _unitOfWork.Repository<Trip>();
            var trip = await tripRepo.GetByIdAsync(booking.TripId);
            if (trip == null)
                throw new InvalidOperationException("Trip not found");

            bool isPassenger = booking.PassengerId == employeeId;
            bool isDriver = trip.DriverId == employeeId;

            // Nếu đã check-in thì không thể hủy
            if (booking.CheckInTime != null || booking.Status == "CheckedIn")
                throw new InvalidOperationException("Cannot cancel a checked-in booking");

            if (!isPassenger && !isDriver)
                throw new UnauthorizedAccessException("Not allowed to cancel this booking");

            booking.Status = "Cancelled";
            bookingRepo.Update(booking);

            // Tăng lại available seats
            trip.AvailableSeats += 1;
            tripRepo.Update(trip);

            await _unitOfWork.SaveChangesAsync();

            return booking;
        }

        public async Task<Booking> CheckInBookingAsync(int passengerId, int bookingId)
        {
            var bookingRepo = _unitOfWork.Repository<Booking>();
            var booking = await bookingRepo.GetByIdAsync(bookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            if (booking.PassengerId != passengerId)
                throw new UnauthorizedAccessException("Not allowed to check-in this booking");

            if (booking.Status != "Confirmed")
                throw new InvalidOperationException("Only confirmed bookings can be checked in");

            booking.Status = "CheckedIn";
            booking.CheckInTime = DateTime.UtcNow;
            bookingRepo.Update(booking);

            await _unitOfWork.SaveChangesAsync();

            return booking;
        }
    }
}
