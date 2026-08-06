using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public VehicleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Vehicle> RegisterVehicleAsync(int employeeId, string licensePlate, string vehicleType, int seatCount)
        {
            if (seatCount < 1 || seatCount > 8)
            {
                throw new ArgumentException("Seat count must be between 1 and 8", nameof(seatCount));
            }

            var employeeRepo = _unitOfWork.Repository<Employee>();
            var employee = await employeeRepo.GetByIdAsync(employeeId);
            if (employee == null)
            {
                throw new InvalidOperationException("Employee not found");
            }

            var vehicleRepo = _unitOfWork.Repository<Vehicle>();
            var existingVehicles = await vehicleRepo.FindAsync(v => v.LicensePlate == licensePlate);
            if (existingVehicles.Any())
            {
                throw new InvalidOperationException("License plate is already registered");
            }

            var vehicle = new Vehicle
            {
                EmployeeId = employeeId,
                LicensePlate = licensePlate,
                VehicleType = vehicleType,
                SeatCount = seatCount,
                IsActive = true
            };

            await vehicleRepo.AddAsync(vehicle);
            await _unitOfWork.SaveChangesAsync();

            return vehicle;
        }

        public async Task<IEnumerable<Vehicle>> GetVehiclesByEmployeeAsync(int employeeId)
        {
            var vehicleRepo = _unitOfWork.Repository<Vehicle>();
            return await vehicleRepo.FindAsync(v => v.EmployeeId == employeeId && v.IsActive);
        }

        public async Task<Vehicle> UpdateVehicleAsync(int vehicleId, string vehicleType, int seatCount)
        {
            if (seatCount < 1 || seatCount > 8)
            {
                throw new ArgumentException("Seat count must be between 1 and 8", nameof(seatCount));
            }

            var vehicleRepo = _unitOfWork.Repository<Vehicle>();
            var vehicle = await vehicleRepo.GetByIdAsync(vehicleId);
            if (vehicle == null)
            {
                throw new InvalidOperationException("Vehicle not found");
            }

            vehicle.VehicleType = vehicleType;
            vehicle.SeatCount = seatCount;

            vehicleRepo.Update(vehicle);
            await _unitOfWork.SaveChangesAsync();

            return vehicle;
        }

        public async Task<bool> DeactivateVehicleAsync(int vehicleId)
        {
            var vehicleRepo = _unitOfWork.Repository<Vehicle>();
            var vehicle = await vehicleRepo.GetByIdAsync(vehicleId);
            if (vehicle == null)
            {
                return false;
            }

            vehicle.IsActive = false;
            vehicleRepo.Update(vehicle);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}