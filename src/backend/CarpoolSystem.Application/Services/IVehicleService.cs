using System.Collections.Generic;
using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface IVehicleService
    {
        Task<Vehicle> RegisterVehicleAsync(int employeeId, string licensePlate, string vehicleType, int seatCount);
        Task<IEnumerable<Vehicle>> GetVehiclesByEmployeeAsync(int employeeId);
        Task<Vehicle> UpdateVehicleAsync(int vehicleId, string vehicleType, int seatCount);
        Task<bool> DeactivateVehicleAsync(int vehicleId);
    }
}