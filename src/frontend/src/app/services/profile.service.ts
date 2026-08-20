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

export interface Department {
  departmentId: number;
  departmentName: string;
  isActive: boolean;
}

export interface Role {
  roleId: number;
  roleName: string;
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

export interface RouteInput {
  startZoneId: number;
  endZoneId: number;
  startTime: string;
  daysOfWeek: string;
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

  private readonly apiUrl =
    'http://localhost:5147/api';


  /**
   * GET /api/Employee/profile
   */
  getProfile(): Observable<EmployeeProfile> {

    return this.http.get<EmployeeProfile>(
      `${this.apiUrl}/Employee/profile`
    );

  }


  /**
   * GET /api/Department/{id}
   */
  getDepartment(
    departmentId: number
  ): Observable<Department> {

    return this.http.get<Department>(
      `${this.apiUrl}/Department/${departmentId}`
    );

  }


  /**
   * GET /api/Role/{id}
   */
  getRole(
    roleId: number
  ): Observable<Role> {

    return this.http.get<Role>(
      `${this.apiUrl}/Role/${roleId}`
    );

  }


  /**
   * GET /api/vehicle/my-vehicles
   */
  getMyVehicles(): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(
      `${this.apiUrl}/vehicle/my-vehicles`
    );

  }


  /**
   * GET /api/route/my-routes
   */
  getMyRoutes(): Observable<Route[]> {

    return this.http.get<Route[]>(
      `${this.apiUrl}/route/my-routes`
    );

  }

  createRoute(input: RouteInput): Observable<Route> {
    return this.http.post<Route>(
      `${this.apiUrl}/route`,
      input
    );
  }

  updateRoute(routeId: number, input: RouteInput): Observable<Route> {
    return this.http.put<Route>(
      `${this.apiUrl}/route/${routeId}`,
      input
    );
  }

  deleteRoute(routeId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/route/${routeId}`
    );
  }


  /**
   * GET /api/Zone/{id}
   */
  getZone(
    zoneId: number
  ): Observable<Zone> {

    return this.http.get<Zone>(
      `${this.apiUrl}/Zone/${zoneId}`
    );

  }

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(
      `${this.apiUrl}/Zone`
    );
  }

}