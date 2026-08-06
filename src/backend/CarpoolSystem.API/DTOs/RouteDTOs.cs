using System;

namespace CarpoolSystem.API.DTOs
{
    /// <summary>
    /// Request to create a route
    /// </summary>
    public record CreateRouteRequest(int StartZoneId, int EndZoneId, TimeOnly StartTime, string DaysOfWeek);

    /// <summary>
    /// Request to update a route
    /// </summary>
    public record UpdateRouteRequest(int StartZoneId, int EndZoneId, TimeOnly StartTime, string DaysOfWeek);

    /// <summary>
    /// Response DTO for route
    /// </summary>
    public record RouteResponse(int RouteId, int EmployeeId, int StartZoneId, int EndZoneId, TimeOnly StartTime, string DaysOfWeek, bool IsActive);
}
