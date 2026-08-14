using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarpoolSystem.Application.Services
{
    public interface IZoneService
    {
        Task<Zone> CreateZoneAsync(string zoneName, decimal latitude, decimal longitude);
        Task<Zone?> GetZoneByIdAsync(int id);
        Task<IEnumerable<Zone>> GetAllZonesAsync();
        Task<Zone> UpdateZoneAsync(int zoneId, string zoneName, decimal latitude, decimal longitude);
        Task<bool> DeleteZoneAsync(int zoneId);
    }

    public class ZoneService : IZoneService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ZoneService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Zone> CreateZoneAsync(string zoneName, decimal latitude, decimal longitude)
        {
            if (string.IsNullOrWhiteSpace(zoneName))
                throw new ArgumentException("Zone name is required", nameof(zoneName));

            var zoneRepo = _unitOfWork.Repository<Zone>();
            var existing = await zoneRepo.FindAsync(z => z.ZoneName == zoneName);
            if (existing.Any())
                throw new InvalidOperationException("Zone with the same name already exists");

            var zone = new Zone
            {
                ZoneName = zoneName,
                Latitude = latitude,
                Longitude = longitude
            };

            await zoneRepo.AddAsync(zone);
            await _unitOfWork.SaveChangesAsync();

            return zone;
        }

        public async Task<Zone?> GetZoneByIdAsync(int id)
        {
            var zoneRepo = _unitOfWork.Repository<Zone>();
            return await zoneRepo.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Zone>> GetAllZonesAsync()
        {
            var zoneRepo = _unitOfWork.Repository<Zone>();
            return await zoneRepo.GetAllAsync();
        }

        public async Task<Zone> UpdateZoneAsync(int zoneId, string zoneName, decimal latitude, decimal longitude)
        {
            var zoneRepo = _unitOfWork.Repository<Zone>();
            var zone = await zoneRepo.GetByIdAsync(zoneId);
            if (zone == null)
                throw new InvalidOperationException("Zone not found");

            if (string.IsNullOrWhiteSpace(zoneName))
                throw new ArgumentException("Zone name is required", nameof(zoneName));

            // check duplicate name
            var duplicates = await zoneRepo.FindAsync(z => z.ZoneName == zoneName && z.ZoneId != zoneId);
            if (duplicates.Any())
                throw new InvalidOperationException("Another zone with the same name exists");

            zone.ZoneName = zoneName;
            zone.Latitude = latitude;
            zone.Longitude = longitude;

            zoneRepo.Update(zone);
            await _unitOfWork.SaveChangesAsync();

            return zone;
        }

        public async Task<bool> DeleteZoneAsync(int zoneId)
        {
            var zoneRepo = _unitOfWork.Repository<Zone>();
            var zone = await zoneRepo.GetByIdAsync(zoneId);
            if (zone == null)
                return false;

            zoneRepo.Remove(zone);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
