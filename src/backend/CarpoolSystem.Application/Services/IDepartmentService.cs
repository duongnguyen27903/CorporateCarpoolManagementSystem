using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface IDepartmentService
    {
        Task<Department?> GetDepartmentByIdAsync(int departmentId);
    }
}