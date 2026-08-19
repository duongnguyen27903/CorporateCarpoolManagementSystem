import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeProfile {
  employeeId: number;
  fullName: string;
  email: string;
  phone: string | null;
  departmentId: number;
  roleId: number;
  isActive: boolean;
  createdAt: string;
}

export interface Vehicle {
  vehicleId: number;
  employeeId: number;
  licensePlate: string;
  vehicleType: string;
  seatCount: number;
  isActive: boolean;
}

export interface Route {
  routeId: number;
  employeeId: number;
  startZoneId: number;
  endZoneId: number;
  startTime: string;
  daysOfWeek: string;
  isActive: boolean;
}

export interface Zone {
  zoneId: number;
  zoneName: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5147/api';

  // =========================
  // EMPLOYEE
  // =========================

  getProfile(): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(
      `${this.apiUrl}/Employee/profile`
    );
  }

  // =========================
  // VEHICLE
  // =========================

  getMyVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(
      `${this.apiUrl}/vehicle/my-vehicles`
    );
  }

  // =========================
  // ROUTE
  // =========================

  getMyRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(
      `${this.apiUrl}/route/my-routes`
    );
  }

  // =========================
  // ZONE
  // =========================

  getZone(zoneId: number): Observable<Zone> {
    return this.http.get<Zone>(
      `${this.apiUrl}/Zone/${zoneId}`
    );
  }
}