namespace CarpoolSystem.API.DTOs
{
    /// <summary>
    /// Request to create a zone
    /// </summary>
    public record CreateZoneRequest(string ZoneName, decimal Latitude, decimal Longitude);

    /// <summary>
    /// Request to update a zone
    /// </summary>
    public record UpdateZoneRequest(string ZoneName, decimal Latitude, decimal Longitude);

    /// <summary>
    /// Response DTO for zone
    /// </summary>
    public record ZoneResponse(int ZoneId, string ZoneName, decimal Latitude, decimal Longitude);
}
