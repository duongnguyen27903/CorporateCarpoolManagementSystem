import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CostTransaction {
  transactionId: number;
  tripId: number;
  employeeId: number;
  amount: number;
  transactionMonth: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CostService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:5147/api/cost';


  getMyCostHistory(
    month?: string
  ): Observable<CostTransaction[]> {

    const url = month
      ? `${this.baseUrl}/my-history?month=${month}`
      : `${this.baseUrl}/my-history`;

    return this.http.get<CostTransaction[]>(url);

  }

}