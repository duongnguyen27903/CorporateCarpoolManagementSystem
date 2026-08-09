import { Injectable } from '@angular/core'
import { Observable, delay, of, throwError } from 'rxjs'
import type { LoginPayload, LoginResponse } from './auth.types'
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
/**
 * Auth API. Ships a MOCK so the starter runs with no backend. To use a real
 * API, inject HttpClient and return `this.http.post<LoginResponse>(...)`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly api = 'http://localhost:5147/api/auth';

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<any>(
        `${this.api}/login`,
        payload
    ).pipe(
        map(res => ({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            user: {
                id: res.employeeId,
                name: res.fullName,
                email: payload.email
            }
        }))
    );
  }
}

