using System.Threading.Tasks;
using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Domain.Entities;

namespace CarpoolSystem.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DepartmentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
        {
            var repo = _unitOfWork.Repository<Department>();

            return await repo.GetByIdAsync(departmentId);
        }
    }
}