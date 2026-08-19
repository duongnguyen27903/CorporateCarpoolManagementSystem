namespace CarpoolSystem.API.DTOs
{
    public record DepartmentResponse(
        int DepartmentId,
        string DepartmentName,
        bool IsActive
    );
}