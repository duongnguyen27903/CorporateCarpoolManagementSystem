import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = 'http://localhost:5147/api/booking';

  constructor(private http: HttpClient) {}

  // POST /api/booking { TripId }
  createBooking(tripId: number): Observable<any> {
    return this.http.post(this.baseUrl, { TripId: tripId }, this.authHeaders());
  }

  // GET /api/booking/my-bookings
  getMyBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-bookings`, this.authHeaders());
  }

  // PUT /api/booking/{id}/confirm (Driver)
  confirmBooking(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/confirm`, null, this.authHeaders());
  }

  // PUT /api/booking/{id}/cancel
  cancelBooking(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/cancel`, null, this.authHeaders());
  }

  // PUT /api/booking/{id}/checkin
  checkInBooking(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/checkin`, null, this.authHeaders());
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
