using System.Threading.Tasks;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public interface IRoleService
    {
        Task<Role?> GetRoleByIdAsync(int roleId);
    }
}