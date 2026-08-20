import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthStore } from '../../core/auth/auth.store';
import { EmployeeProfile, ProfileService } from '../../../src/app/services/profile.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen w-full bg-[#F9FAFB]">
      <!-- ====================================================== -->
      <!-- SIDEBAR -->
      <!-- ====================================================== -->

      <aside class="flex w-[260px] flex-col border-r border-gray-200 bg-white">
        <!-- Logo -->
        <div class="flex h-20 items-center px-6">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded bg-[#2563EB]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 17H21V5H3V7
                     M3 13V19H15V17
                     M11 9L15 13
                     M15 9L11 13"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div>
              <h2 class="text-lg font-bold leading-tight text-[#2563EB]">
                CarpoolConnect
              </h2>

              <p class="text-[10px] text-gray-500">Enterprise Mobility</p>
            </div>
          </div>
        </div>

        <!-- Primary Action -->
        <div class="px-4 pb-4">
          <button
            [routerLink]="'/rides'"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            Find a Ride
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 overflow-y-auto px-3">
          @for (item of menuItems; track item.label) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-[#EFF6FF] text-[#2563EB] font-semibold"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <span [innerHTML]="item.icon"></span>
              {{ item.label }}
            </a>
          }
        </nav>

        <!-- Bottom Links -->
        <div class="border-t border-gray-100 p-3">
          <!-- Settings -->
          <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18
                   a2 2 0 0 1-1 1.73l-.43.25
                   a2 2 0 0 1-2 0l-.15-.08
                   a2 2 0 0 0-2.73.73l-.22.38
                   a2 2 0 0 0 .73 2.73l.15.1
                   a2 2 0 0 1 1 1.72v.51
                   a2 2 0 0 1-1 1.74l-.15.09
                   a2 2 0 0 0-.73 2.73l.22.38
                   a2 2 0 0 0 2.73.73l.15-.08
                   a2 2 0 0 1 2 0l.43.25
                   a2 2 0 0 1 1 1.73V20
                   a2 2 0 0 0 2 2h.44
                   a2 2 0 0 0 2-2v-.18
                   a2 2 0 0 1 1-1.73l.43-.25
                   a2 2 0 0 1 2 0l.15.08
                   a2 2 0 0 0 2.73-.73l.22-.39
                   a2 2 0 0 0-.73-2.73l-.15-.08
                   a2 2 0 0 1-1-1.74v-.5
                   a2 2 0 0 1 1-1.74l.15-.09
                   a2 2 0 0 0 .73-2.73l-.22-.38
                   a2 2 0 0 0-2.73-.73l-.15.08
                   a2 2 0 0 1-2 0l-.43-.25
                   a2 2 0 0 1-1-1.73V4
                   a2 2 0 0 0-2-2z"
              ></path>

              <circle cx="12" cy="12" r="3"></circle>
            </svg>

            Settings
          </a>

          <!-- Support -->
          <a href="#" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1
                   5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>

            Support
          </a>

          <!-- Logout -->
          <button
            type="button"
            (click)="logout()"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5
                   a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>

            Logout
          </button>
        </div>
      </aside>

      <!-- ====================================================== -->
      <!-- MAIN CONTENT -->
      <!-- ====================================================== -->

      <main class="flex flex-1 flex-col overflow-hidden">
        <!-- ================================================== -->
        <!-- TOPBAR -->
        <!-- ================================================== -->

        <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <!-- Search -->
          <div class="relative w-96">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              type="text"
              placeholder="Search routes, drivers..."
              class="h-9 w-full rounded-md border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-5">
            <!-- Notification -->
            <button class="relative text-gray-500 hover:text-gray-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8
                     c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>

              <span class="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <!-- Help -->
            <button class="text-gray-500 hover:text-gray-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1
                     5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </button>

            <div class="h-6 w-px bg-gray-300"></div>

            <!-- ================================================= -->
            <!-- EMPLOYEE AVATAR -->
            <!-- ================================================= -->

            <button
              type="button"
              (click)="goToProfile()"
              title="View profile"
              class="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-600 ring-2 ring-transparent transition-all hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              @if (profileLoading) {
                <!-- Loading avatar -->
                <div class="h-full w-full animate-pulse rounded-full bg-gray-200"></div>
              } @else {
                {{ getInitials(profile?.fullName) }}
              }
            </button>
          </div>
        </header>

        <!-- ================================================== -->
        <!-- PAGE CONTENT -->
        <!-- ================================================== -->

        <div class="flex-1 overflow-y-auto p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AppLayoutComponent {
  private readonly authStore = inject(AuthStore);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly profileService = inject(ProfileService);

  /**
   * Employee profile hiện tại
   */
  profile: EmployeeProfile | null = null;

  /**
   * Trạng thái đang lấy profile
   */
  profileLoading = true;

  /**
   * Menu sidebar
   */
  menuItems = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      exact: true,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      `
    },
    {
      label: 'Find Rides',
      route: '/rides',
      exact: false,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16
               a2 2 0 0 0 2 2h12
               a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      `
    },
    {
      label: 'My Routes',
      route: '/routes',
      exact: false,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="18" cy="18" r="3"></circle>
          <path d="M8.5 7.5 15.5 16.5"></path>
        </svg>
      `
    },
    {
      label: 'Create Trip',
      route: '/trips/create',
      exact: false,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      `
    },
    {
      label: 'My Bookings',
      route: '/bookings',
      exact: false,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      `
    },
    {
      label: 'Cost Sharing',
      route: '/costs',
      exact: false,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4
               a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8
               a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4
               A2 2 0 0 0 21 16z"></path>
        </svg>
      `
    },
    {
      label: 'Profile',
      route: '/profile',
      exact: false,
      icon: `
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8
               a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `
    },
    { label: 'Map', route: '/map', exact: false, icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
  ];

  constructor() {
    this.loadEmployeeProfile();
  }

  /**
   * ============================================================
   * GET /api/Employee/profile
   *
   * Lấy thông tin employee hiện tại.
   * ============================================================
   */
  loadEmployeeProfile(): void {
    this.profileLoading = true;

    console.log('AppLayout: Loading employee profile...');

    this.profileService.getProfile().subscribe({
      next: profile => {
        console.log('AppLayout: Employee profile:', profile);

        this.profile = profile;
        this.profileLoading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('AppLayout: Cannot load employee profile:', error);

        /*
         * Không để lỗi profile ảnh hưởng
         * tới toàn bộ layout.
         */
        this.profileLoading = false;
      }
    });
  }

  /**
   * ============================================================
   * Tạo initials cho avatar
   *
   * Ví dụ:
   *
   * Nguyễn Hải Sơn
   *       ↓
   * NHS
   *
   * passenger
   *       ↓
   * P
   * ============================================================
   */
  getInitials(fullName?: string | null): string {
    if (!fullName) {
      return '?';
    }

    const name = fullName.trim();

    if (!name) {
      return '?';
    }

    const parts = name.split(/\s+/).filter(Boolean);

    /*
     * Nếu chỉ có một từ
     */
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    /*
     * Lấy chữ cái đầu của từng từ.
     *
     * Nguyễn Hải Sơn
     * -> NHS
     */
    return parts
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 3)
      .toUpperCase();
  }

  /**
   * ============================================================
   * Click avatar -> Profile
   * ============================================================
   */
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * ============================================================
   * Logout
   * ============================================================
   */
  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
