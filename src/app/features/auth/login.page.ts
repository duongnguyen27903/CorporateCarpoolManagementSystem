import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-4">
      <div class="w-full max-w-[400px] rounded-xl bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
        <!-- Logo -->
        <div class="mb-6 flex justify-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 17H21V5H3V7M3 13V19H15V17M11 9L15 13M15 9L11 13" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Title -->
        <div class="mb-8 text-center">
          <h1 class="text-xl font-bold text-gray-900">Sign in to your corporate account</h1>
          <p class="mt-2 text-sm text-gray-500">Welcome back to CarpoolConnect</p>
        </div>

        <!-- SSO Button -->
        <button type="button" class="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Sign in with Single Sign-On
        </button>

        <!-- Divider -->
        <div class="mb-6 flex items-center">
          <div class="flex-grow border-t border-gray-200"></div>
          <span class="mx-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">OR SIGN IN WITH EMAIL</span>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <!-- Form -->
        <form class="flex flex-col gap-5" (ngSubmit)="submit()">
          <!-- Email Input -->
          <label class="flex flex-col gap-1.5">
            <span class="text-sm font-semibold text-gray-700">Email address</span>
            <input
              [(ngModel)]="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              class="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <!-- Password Input -->
          <label class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-700">Password</span>
              <a href="#" class="text-sm font-medium text-[#2563EB] hover:underline">Forgot password?</a>
            </div>
            <input
              [(ngModel)]="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              class="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>

          <!-- Error Message -->
          @if (store.error()) {
            <p class="text-sm text-red-600">{{ 'auth.invalidCredentials' | translate }}</p>
          }

          <!-- Submit Button -->
          <button 
            type="submit" 
            [disabled]="store.status() === 'loading'"
            class="mt-2 flex h-10 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
          >
            @if (store.status() === 'loading') {
              <svg class="mr-2 h-4 w-4 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            }
            Sign In
          </button>
        </form>

        <!-- Footer Link -->
        <div class="mt-8 text-center text-sm text-gray-500">
          Need access to this portal? <a href="#" class="font-medium text-[#2563EB] hover:underline">Request access</a>
        </div>
      </div>
    </div>
  `
})
export class LoginPage {
  protected readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';

  async submit(): Promise<void> {
    try {
      await this.store.login({ email: this.email, password: this.password });
      const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/dashboard';
      void this.router.navigateByUrl(redirect);
    } catch {
      /* error surfaced via store */
    }
  }
}
