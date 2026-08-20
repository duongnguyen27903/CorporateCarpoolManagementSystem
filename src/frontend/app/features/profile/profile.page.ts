import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ProfileService,
  EmployeeProfile,
  Vehicle,
  Route,
  Zone
} from '../../../src/app/services/profile.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="mx-auto max-w-4xl space-y-6">

      <!-- Loading -->
      @if (loading) {
        <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div class="flex items-center justify-center py-10">
            <div
              class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600">
            </div>

            <span class="ml-3 text-sm text-gray-500">
              Loading profile...
            </span>
          </div>
        </div>
      }

      <!-- Error -->
      @if (errorMessage) {
        <div
          class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {{ errorMessage }}
        </div>
      }

      @if (profile) {

        <!-- ============================= -->
        <!-- PROFILE HEADER -->
        <!-- ============================= -->

        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div
            class="h-32 bg-[#2563EB] bg-opacity-80
                   bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          </div>

          <div class="relative px-8 pb-6">

            <!-- Avatar -->
            <div
              class="absolute -top-12 flex h-24 w-24
                     items-center justify-center overflow-hidden
                     rounded-full border-4 border-white
                     bg-white shadow-sm">

              <div
                class="flex h-full w-full items-center justify-center
                       bg-blue-100 text-3xl font-bold text-blue-600">

                {{ getInitials(profile.fullName) }}

              </div>
            </div>

            <div
              class="ml-28 flex items-start justify-between pt-3">

              <div>

                <h1
                  class="text-2xl font-extrabold text-gray-900">

                  {{ profile.fullName }}

                </h1>

                <p
                  class="mt-1 flex items-center gap-2
                         text-sm font-medium text-gray-500">

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">

                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2">
                    </rect>

                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4">
                    </path>

                  </svg>

                  EMP-ID: {{ profile.employeeId }}

                  <span class="text-gray-300">•</span>

                  Role ID: {{ profile.roleId }}

                </p>

              </div>

            </div>
          </div>
        </div>


        <!-- ============================= -->
        <!-- PERSONAL INFORMATION -->
        <!-- ============================= -->

        <div
          class="rounded-xl border border-gray-200
                 bg-white p-8 shadow-sm">

          <div
            class="mb-6 flex items-center justify-between
                   border-b border-gray-100 pb-4">

            <h2
              class="flex items-center gap-2
                     text-lg font-bold text-gray-900">

              <svg
                class="text-[#2563EB]"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2">
                </path>

                <circle
                  cx="12"
                  cy="7"
                  r="4">
                </circle>

              </svg>

              Personal Information
            </h2>

          </div>


          <div
            class="grid grid-cols-1 gap-y-6 text-sm
                   md:grid-cols-2">

            <!-- Full Name -->
            <div>
              <p
                class="mb-1 text-[10px] font-bold
                       uppercase tracking-wider text-gray-400">

                FULL NAME

              </p>

              <p
                class="font-semibold text-gray-900">

                {{ profile.fullName }}

              </p>
            </div>


            <!-- Department -->
            <div>
              <p
                class="mb-1 text-[10px] font-bold
                       uppercase tracking-wider text-gray-400">

                DEPARTMENT

              </p>

              <p
                class="font-semibold text-gray-900">

                Department ID: {{ profile.departmentId }}

              </p>
            </div>


            <!-- Employee ID -->
            <div>
              <p
                class="mb-1 text-[10px] font-bold
                       uppercase tracking-wider text-gray-400">

                EMPLOYEE ID

              </p>

              <p
                class="font-semibold text-gray-900">

                {{ profile.employeeId }}

              </p>
            </div>


            <!-- Role -->
            <div>
              <p
                class="mb-1 text-[10px] font-bold
                       uppercase tracking-wider text-gray-400">

                ROLE

              </p>

              <p
                class="font-semibold text-gray-900">

                Role ID: {{ profile.roleId }}

              </p>
            </div>


            <!-- Status -->
            <div>
              <p
                class="mb-1 text-[10px] font-bold
                       uppercase tracking-wider text-gray-400">

                ACCOUNT STATUS

              </p>

              @if (profile.isActive) {
                <span
                  class="inline-flex rounded-full
                         bg-green-100 px-3 py-1
                         text-xs font-semibold text-green-700">

                  Active

                </span>
              } @else {
                <span
                  class="inline-flex rounded-full
                         bg-red-100 px-3 py-1
                         text-xs font-semibold text-red-700">

                  Inactive

                </span>
              }
            </div>


            <!-- Created At -->
            <div>
              <p
                class="mb-1 text-[10px] font-bold
                       uppercase tracking-wider text-gray-400">

                JOIN DATE

              </p>

              <p
                class="font-semibold text-gray-900">

                {{ formatDate(profile.createdAt) }}

              </p>
            </div>

          </div>
        </div>


        <!-- ============================= -->
        <!-- CONTACT DETAILS -->
        <!-- ============================= -->

        <div
          class="rounded-xl border border-gray-200
                 bg-white p-8 shadow-sm">

          <div
            class="mb-6 border-b border-gray-100 pb-4">

            <h2
              class="flex items-center gap-2
                     text-lg font-bold text-gray-900">

              <svg
                class="text-[#2563EB]"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2
                     19.79 19.79 0 0 1-8.63-3.07
                     19.5 19.5 0 0 1-6-6
                     19.79 19.79 0 0 1-3.07-8.67
                     A2 2 0 0 1 4.11 2h3a2 2 0 0 1
                     2 1.72 12.84 12.84 0 0 0
                     .7 2.81 2 2 0 0 1-.45 2.11L8.09
                     9.91a16 16 0 0 0 6 6l1.27-1.27
                     a2 2 0 0 1 2.11-.45 12.84 12.84
                     0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                </path>

              </svg>

              Contact Details

            </h2>

          </div>


          <div class="space-y-3">

            <!-- Email -->
            <div
              class="flex items-center gap-4 rounded-lg
                     border border-gray-100 bg-gray-50 p-4">

              <div
                class="flex h-10 w-10 shrink-0
                       items-center justify-center
                       rounded-full bg-white
                       text-[#2563EB] shadow-sm">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2">

                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12
                       c0 1.1-.9 2-2 2H4
                       c-1.1 0-2-.9-2-2V6
                       c0-1.1.9-2 2-2z">
                  </path>

                  <polyline
                    points="22,6 12,13 2,6">
                  </polyline>

                </svg>

              </div>

              <div>

                <p
                  class="text-[10px] font-bold
                         uppercase tracking-wider text-gray-400">

                  CORPORATE EMAIL

                </p>

                <p
                  class="text-sm font-semibold text-gray-900">

                  {{ profile.email }}

                </p>

              </div>
            </div>


            <!-- Phone -->
            <div
              class="flex items-center gap-4 rounded-lg
                     border border-gray-100 bg-gray-50 p-4">

              <div
                class="flex h-10 w-10 shrink-0
                       items-center justify-center
                       rounded-full bg-white
                       text-[#2563EB] shadow-sm">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2">

                  <rect
                    x="5"
                    y="2"
                    width="14"
                    height="20"
                    rx="2">
                  </rect>

                  <line
                    x1="12"
                    y1="18"
                    x2="12.01"
                    y2="18">
                  </line>

                </svg>

              </div>

              <div>

                <p
                  class="text-[10px] font-bold
                         uppercase tracking-wider text-gray-400">

                  MOBILE NUMBER

                </p>

                <p
                  class="text-sm font-semibold text-gray-900">

                  {{ profile.phone || 'Not provided' }}

                </p>

              </div>

            </div>

          </div>
        </div>


        <!-- ============================= -->
        <!-- VEHICLE DETAILS -->
        <!-- ============================= -->

        <div
          class="relative overflow-hidden rounded-xl
                 border border-gray-200 bg-white p-8 shadow-sm">

          <div
            class="absolute right-0 top-0 rounded-bl-xl
                   border-b border-l border-emerald-100
                   bg-emerald-50 px-4 py-2">

            <span
              class="flex items-center gap-1
                     text-[10px] font-bold uppercase
                     tracking-wider text-emerald-700">

              ✓ MY VEHICLES

            </span>

          </div>


          <div
            class="mb-6 border-b border-gray-100 pb-4">

            <h2
              class="text-lg font-bold text-gray-900">

              Vehicle Details

            </h2>

          </div>


          @if (vehicles.length === 0) {

            <div
              class="rounded-lg bg-gray-50 p-6
                     text-center text-sm text-gray-500">

              You don't have any vehicle registered.

            </div>

          } @else {

            <div class="space-y-4">

              @for (vehicle of vehicles; track vehicle.vehicleId) {

                <div
                  class="rounded-lg border border-gray-100
                         bg-gray-50 p-5">

                  <div
                    class="mb-4 flex items-center
                           justify-between">

                    <div>

                      <p
                        class="text-xs font-bold
                               uppercase tracking-wider
                               text-gray-400">

                        LICENSE PLATE

                      </p>

                      <p
                        class="mt-1 text-lg font-extrabold
                               text-gray-900">

                        {{ vehicle.licensePlate }}

                      </p>

                    </div>

                    @if (vehicle.isActive) {

                      <span
                        class="rounded-full bg-green-100
                               px-3 py-1 text-xs font-semibold
                               text-green-700">

                        Active

                      </span>

                    }

                  </div>


                  <div
                    class="grid grid-cols-2 gap-4
                           text-sm md:grid-cols-4">

                    <div>

                      <p
                        class="text-[10px] font-bold
                               uppercase text-gray-400">

                        VEHICLE TYPE

                      </p>

                      <p
                        class="font-semibold text-gray-900">

                        {{ vehicle.vehicleType }}

                      </p>

                    </div>


                    <div>

                      <p
                        class="text-[10px] font-bold
                               uppercase text-gray-400">

                        SEATS

                      </p>

                      <p
                        class="font-semibold text-gray-900">

                        {{ vehicle.seatCount }}

                      </p>

                    </div>


                    <div>

                      <p
                        class="text-[10px] font-bold
                               uppercase text-gray-400">

                        VEHICLE ID

                      </p>

                      <p
                        class="font-semibold text-gray-900">

                        {{ vehicle.vehicleId }}

                      </p>

                    </div>


                    <div>

                      <p
                        class="text-[10px] font-bold
                               uppercase text-gray-400">

                        EMPLOYEE ID

                      </p>

                      <p
                        class="font-semibold text-gray-900">

                        {{ vehicle.employeeId }}

                      </p>

                    </div>

                  </div>

                </div>

              }

            </div>

          }

        </div>


        <!-- ============================= -->
        <!-- FREQUENT ROUTES -->
        <!-- ============================= -->

        <div
          class="rounded-xl border border-gray-200
                 bg-white p-8 shadow-sm">

          <div
            class="mb-6 border-b border-gray-100 pb-4">

            <h2
              class="flex items-center gap-2
                     text-lg font-bold text-gray-900">

              <svg
                class="text-[#2563EB]"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">

                <path
                  d="M12 22s-8-4.5-8-11.8
                     A8 8 0 0 1 12 2a8 8 0 0 1
                     8 8.2c0 7.3-8 11.8-8 11.8z">
                </path>

                <circle
                  cx="12"
                  cy="10"
                  r="3">
                </circle>

              </svg>

              Frequent Routes

            </h2>

          </div>


          @if (routes.length === 0) {

            <div
              class="rounded-lg bg-gray-50 p-6
                     text-center text-sm text-gray-500">

              You don't have any route yet.

            </div>

          } @else {

            <div class="space-y-3">

              @for (
                route of routes;
                track route.routeId
              ) {

                <div
                  class="rounded-lg border
                         border-gray-100 p-4
                         hover:bg-gray-50">

                  <div
                    class="flex items-center
                           justify-between">

                    <div>

                      <p
                        class="text-sm font-semibold
                               text-gray-700">

                        {{ getZoneName(route.startZoneId) }}

                        <span class="mx-2 text-gray-400">
                          →
                        </span>

                        {{ getZoneName(route.endZoneId) }}

                      </p>


                      <div
                        class="mt-2 flex flex-wrap
                               gap-4 text-xs text-gray-500">

                        <span>
                          🕐 {{ route.startTime }}
                        </span>

                        <span>
                          📅 {{ route.daysOfWeek }}
                        </span>

                        <span>
                          Route #{{ route.routeId }}
                        </span>

                      </div>

                    </div>


                    @if (route.isActive) {

                      <span
                        class="rounded-full bg-green-100
                               px-3 py-1 text-xs font-semibold
                               text-green-700">

                        Active

                      </span>

                    }

                  </div>

                </div>

              }

            </div>

          }

        </div>

      }
    </div>
  `
})
export class ProfilePage implements OnInit {

  private readonly profileService = inject(ProfileService);
  private readonly cdr = inject(ChangeDetectorRef);
  // =========================
  // DATA
  // =========================

  profile: EmployeeProfile | null = null;

  vehicles: Vehicle[] = [];

  routes: Route[] = [];

  zones: Record<number, Zone> = {};

  // =========================
  // UI STATE
  // =========================

  loading = true;

  errorMessage = '';

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadProfile();
  }

  // =========================
  // LOAD PROFILE
  // =========================

 loadProfile(): void {

  this.loading = true;

  this.errorMessage = '';

  console.log('========== PROFILE PAGE ==========');
  console.log('Loading profile...');

  this.profileService.getProfile().subscribe({

    next: profile => {

      console.log(
        'GET /api/Employee/profile SUCCESS:',
        profile
      );

      // Gán dữ liệu profile
      this.profile = profile;

      // Tắt loading
      this.loading = false;

      // Ép Angular cập nhật giao diện ngay lập tức
      this.cdr.detectChanges();

      console.log('Profile assigned:', this.profile);
      console.log('Loading:', this.loading);

      // Sau khi profile đã hiển thị,
      // tiếp tục lấy dữ liệu phụ
      this.loadVehicles();

      this.loadRoutes();

    },

    error: error => {

      console.error(
        'GET /api/Employee/profile FAILED:',
        error
      );

      this.loading = false;

      if (error.status === 401) {

        this.errorMessage =
          'Your session has expired. Please login again.';

      } else if (error.status === 403) {

        this.errorMessage =
          'You do not have permission to view this profile.';

      } else {

        this.errorMessage =
          'Unable to load profile information.';

      }

      // Cập nhật UI khi có lỗi
      this.cdr.detectChanges();

    }

  });

}

  // =========================
  // LOAD VEHICLES
  // =========================

  loadVehicles(): void {

  console.log(
    'Calling GET /api/vehicle/my-vehicles...'
  );

  this.profileService.getMyVehicles().subscribe({

    next: vehicles => {

      console.log(
        'GET /api/vehicle/my-vehicles SUCCESS:',
        vehicles
      );

      this.vehicles = Array.isArray(vehicles)
        ? vehicles
        : [];

      // Ép Angular cập nhật UI
      this.cdr.detectChanges();

      console.log(
        'Vehicles assigned:',
        this.vehicles
      );

    },

    error: error => {

      console.error(
        'GET /api/vehicle/my-vehicles FAILED:',
        error
      );

      this.vehicles = [];

      // Vẫn cập nhật UI khi API lỗi
      this.cdr.detectChanges();

    }

  });

}

  // =========================
  // LOAD ROUTES
  // =========================

  loadRoutes(): void {

    console.log(
      'Calling GET /api/route/my-routes...'
    );

    this.profileService.getMyRoutes().subscribe({

      next: routes => {

        console.log(
          'GET /api/route/my-routes SUCCESS:',
          routes
        );

        this.routes = Array.isArray(routes)
          ? routes
          : [];

        this.cdr.detectChanges();
        // Sau khi có routes thì load zone
        this.loadZones();

      },

      error: error => {

        console.error(
          'GET /api/route/my-routes FAILED:',
          error
        );

        this.routes = [];

      }

    });

  }

  // =========================
  // LOAD ZONES
  // =========================

  loadZones(): void {

  console.log('========== LOAD ZONES ==========');
  console.log('Loading zones for routes...');

  const zoneIds = new Set<number>();

  // ================================
  // Lấy tất cả Zone ID từ Routes
  // ================================

  for (const route of this.routes) {

    if (route.startZoneId != null) {
      zoneIds.add(route.startZoneId);
    }

    if (route.endZoneId != null) {
      zoneIds.add(route.endZoneId);
    }

  }

  const ids = Array.from(zoneIds);

  console.log('Zone IDs:', ids);

  // ================================
  // Không có route / không có zone
  // ================================

  if (ids.length === 0) {

    console.log('No zones required.');

    this.loading = false;

    return;

  }

  // ================================
  // Đếm số request Zone
  // ================================

  let completedRequests = 0;

  // ================================
  // Gọi GET /api/Zone/{id}
  // ================================

  for (const zoneId of ids) {

    console.log(
      `Calling GET /api/Zone/${zoneId}...`
    );

    this.profileService.getZone(zoneId).subscribe({

      // ================================
      // SUCCESS
      // ================================

      next: zone => {

        console.log(
          `GET /api/Zone/${zoneId} SUCCESS:`,
          zone
        );

        if (zone) {

          this.zones[zone.zoneId] = zone;

          console.log(
            'Zones updated:',
            this.zones
          );

        }

      },

      // ================================
      // ERROR
      // ================================

      error: error => {

        console.error(
          `GET /api/Zone/${zoneId} FAILED:`,
          error
        );

      },

      // ================================
      // COMPLETE
      // ================================

      complete: () => {

        completedRequests++;

        console.log(
          `Zone request completed: ${completedRequests}/${ids.length}`
        );

        /*
         * Tất cả Zone API đã hoàn thành
         */
        if (completedRequests === ids.length) {

          console.log(
            '========== ALL ZONES LOADED =========='
          );

          console.log(
            'Final zones:',
            this.zones
          );
          // Cập nhật UI khi có lỗi
          this.cdr.detectChanges();
          this.loading = false;

        }

      }

    });

  }

}

  // =========================
  // ZONE NAME
  // =========================

  getZoneName(zoneId: number): string {

    const zone = this.zones[zoneId];

    if (zone) {

      return zone.zoneName;

    }

    return `Zone ${zoneId}`;

  }

  // =========================
  // INITIALS
  // =========================

  getInitials(fullName: string): string {

    if (!fullName) {

      return '?';

    }

    return fullName
      .trim()
      .split(/\s+/)
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

  }

  // =========================
  // DATE
  // =========================

  formatDate(date: string): string {

    if (!date) {

      return '-';

    }

    return new Date(date).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );

  }

}