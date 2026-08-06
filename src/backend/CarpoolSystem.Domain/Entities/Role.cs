using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarpoolSystem.Domain.Entities
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; }

        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
