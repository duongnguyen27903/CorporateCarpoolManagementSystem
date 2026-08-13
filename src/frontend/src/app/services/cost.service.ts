import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CostService {
  private baseUrl = 'http://localhost:5147/api/cost';

  constructor(private http: HttpClient) {}

  // GET /api/cost/my-history?month=YYYY-MM
  getMyCostHistory(month?: string): Observable<any> {
    const url = month ? `${this.baseUrl}/my-history?month=${month}` : `${this.baseUrl}/my-history`;
    return this.http.get(url, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
