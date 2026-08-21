import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
``
export interface EmployeeSummary {
  employeeId: number;
  fullName: string;
  email: string;
  phone: string | null;
}

export interface VehicleSummary {
  vehicleId: number;
  employeeId: number;
  licensePlate: string;
  vehicleType: string;
  seatCount: number;
  isActive: boolean;
}

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

  getRouteDetail(routeDetailId: number): Observable<{ routeId: number }> {
    return this.http.get<{ routeId: number }>(
      `http://localhost:5147/api/RouteDetail/${routeDetailId}`,
      this.authHeaders(),
    );
  }

  getRoute(routeId: number): Observable<{ employeeId: number }> {
    return this.http.get<{ employeeId: number }>(
      `http://localhost:5147/api/Route/${routeId}`,
      this.authHeaders(),
    );
  }

  getEmployee(employeeId: number): Observable<EmployeeSummary> {
    return this.http.get<EmployeeSummary>(
      `http://localhost:5147/api/Employee/${employeeId}`,
      this.authHeaders(),
    );
  }

  getEmployeeVehicles(employeeId: number): Observable<VehicleSummary[]> {
    return this.http.get<VehicleSummary[]>(
      `http://localhost:5147/api/Vehicle/employee/${employeeId}`,
      this.authHeaders(),
    );
  }

  private authHeaders() {
    const token = localStorage.getItem('access_token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}