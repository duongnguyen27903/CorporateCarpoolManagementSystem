using System;
using System.Collections.Generic;

namespace CarpoolSystem.Application.DTOs
{
    // DTOs for CostTransaction module
    public record CostHistoryResponse(int TransactionId, int TripId, int EmployeeId, decimal Amount, string TransactionMonth, DateTime CreatedAt);
}
