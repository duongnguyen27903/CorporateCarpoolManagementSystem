import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import type {
  LoginPayload,
  LoginResponse
} from './auth.types'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient)

  private readonly api =
    'http://localhost:5147/api/auth'

  login(
    payload: LoginPayload
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.api}/login`,
      payload
    )
  }
}