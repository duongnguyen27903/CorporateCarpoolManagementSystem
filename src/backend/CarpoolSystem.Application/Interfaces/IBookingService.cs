using System.Collections.Generic;
using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface IBookingService
    {
        Task<Booking> CreateBookingAsync(int passengerId, int tripId);
        Task<IEnumerable<Booking>> GetBookingsByPassengerAsync(int passengerId);
        Task<Booking> ConfirmBookingAsync(int driverId, int bookingId);
        Task<Booking> CancelBookingAsync(int employeeId, int bookingId);
        Task<Booking> CheckInBookingAsync(int passengerId, int bookingId);
    }
}
