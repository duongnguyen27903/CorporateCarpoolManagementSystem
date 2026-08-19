import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MatchingService {
  // src/backend/CarpoolSystem.API/Controllers/MatchingController.cs
  private baseUrl = 'http://localhost:5147/api/matching/find';

  constructor(private http: HttpClient) {}

  // POST /api/matching/find
  // Body: { Pickup, Dropoff, DesiredDepartureTime, ToleranceMinutes(optional) }
  find(body: any): Observable<any> {
    return this.http.post(this.baseUrl, body, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
