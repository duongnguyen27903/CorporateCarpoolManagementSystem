import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// AuthService: chịu trách nhiệm login/register/refresh và lưu token
@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5147/api/auth';

  constructor(private http: HttpClient) {}

  // POST /api/auth/login
  // Body: { Email, Password }
  // Response: { AccessToken, RefreshToken, EmployeeId, FullName, Role }
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { Email: email, Password: password });
  }

  // POST /api/auth/register
  // Body: { FullName, Email, Password, DepartmentId, RoleId }
  register(fullName: string, email: string, password: string, departmentId: number, roleId: number) {
    return this.http.post(`${this.baseUrl}/register`, { FullName: fullName, Email: email, Password: password, DepartmentId: departmentId, RoleId: roleId });
  }

  // POST /api/auth/refresh
  // Body: { RefreshToken }
  refresh(refreshToken: string) {
    return this.http.post(`${this.baseUrl}/refresh`, { RefreshToken: refreshToken });
  }

  // Helper to store token
  setToken(token: string) { localStorage.setItem('access_token', token); }
  getToken(): string | null { return localStorage.getItem('access_token'); }
  clearToken() { localStorage.removeItem('access_token'); }
}
