namespace CarpoolSystem.API.DTOs
{
    public record RegisterVehicleRequest(string LicensePlate, string VehicleType, int SeatCount);
    public record UpdateVehicleRequest(string VehicleType, int SeatCount);
    public record VehicleResponse(int VehicleId, int EmployeeId, string LicensePlate, string VehicleType, int SeatCount, bool IsActive);
}