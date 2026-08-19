import { Injectable, computed, inject, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { AuthService } from './auth.service'
import { TokenStorage } from './token-storage'
import type { AuthUser, LoginPayload } from './auth.types'

const USER_KEY = 'auth.user'

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly auth = inject(AuthService)
  private readonly tokens = inject(TokenStorage)

  // ============================================================
  // STATE
  // ============================================================

  private readonly _user = signal<AuthUser | null>(this.restore())

  private readonly _status =
    signal<'idle' | 'loading' | 'error'>('idle')

  private readonly _error =
    signal<string | null>(null)

  // ============================================================
  // SELECTORS
  // ============================================================

  readonly user = this._user.asReadonly()

  readonly status = this._status.asReadonly()

  readonly error = this._error.asReadonly()

  readonly isAuthenticated =
    computed(() => this._user() !== null)

  readonly role =
    computed(() => this._user()?.role ?? null)

  // ============================================================
  // LOGIN
  // ============================================================

  async login(payload: LoginPayload): Promise<void> {
    this._status.set('loading')
    this._error.set(null)

    try {
      const res = await firstValueFrom(
        this.auth.login(payload)
      )

      // Save JWT tokens
      this.tokens.set(
        res.accessToken,
        res.refreshToken
      )

      // Backend response:
      //
      // {
      //   accessToken: "...",
      //   refreshToken: "...",
      //   employeeId: 3,
      //   fullName: "string",
      //   role: "Passenger"
      // }

      const user: AuthUser = {
        id: res.employeeId,
        name: res.fullName,
        email: payload.email,
        role: res.role
      }

      this._user.set(user)

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      )

      this._status.set('idle')

    } catch (e) {
      this._status.set('error')

      this._error.set(
        e instanceof Error
          ? e.message
          : 'Login failed'
      )

      throw e
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  logout(): void {
    this.tokens.clear()

    localStorage.removeItem(USER_KEY)

    this._user.set(null)

    this._status.set('idle')

    this._error.set(null)
  }

  // ============================================================
  // RESTORE USER
  // ============================================================

  private restore(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)

    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  }
}