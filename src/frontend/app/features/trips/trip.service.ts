import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  id: string;
  startPoint: string;
  endPoint: string;
}

export interface TripDto {
  id: string;
  driverName: string;
  driverAvatar: string;
  driverInitials: string;
  rating: number;
  totalTrips: number;
  departureTime: string;
  startPoint: string;
  endPoint: string;
  seatsAvailable: number;
  cost: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5147/api';

  getAvailableTrips(): Observable<TripDto[]> {
    return this.http.get<TripDto[]>(`${this.apiUrl}/Trip/active`);
  }

  getMyRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.apiUrl}/Route/my-routes`);
  }

  createTrip(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Trip`, data);
  }
}
