using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarpoolSystem.Domain.Entities
{
    public class CostTransaction
    {
        [Key]
        public int TransactionId { get; set; }

        public int TripId { get; set; }
        public Trip Trip { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [MaxLength(7)]
        public string TransactionMonth { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
