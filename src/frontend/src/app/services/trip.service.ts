import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TripService {
  private baseUrl = 'http://localhost:5147/api/trip';

  constructor(private http: HttpClient) {}

  // POST /api/trip
  // Body: { RouteId, VehicleId, DepartureTime, AvailableSeats }
  createTrip(body: any): Observable<any> {
    return this.http.post(this.baseUrl, body, this.authHeaders());
  }

  // GET /api/trip/my-trips
  getMyTrips(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-trips`, this.authHeaders());
  }

  // GET /api/trip/active
  getActiveTrips(): Observable<any> {
    return this.http.get(`${this.baseUrl}/active`);
  }

  // GET /api/trip/{id}
  getTripById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // PUT /api/trip/{id}/status
  updateTripStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { Status: status }, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
