import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../core/auth/auth.store';
import { ProfileService, Route, Vehicle, Zone } from '../../../src/app/services/profile.service';
import { TripService } from '../../../src/app/services/trip.service';

function getLocalDateValue(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isDriver) {
    <div class="mx-auto max-w-6xl space-y-6 pb-12 text-gray-800">
      
      <!-- Tiêu đề đầu trang -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Publish a Ride</h1>
        <p class="mt-1 text-sm text-gray-700">Offer empty seats to colleagues and share commute costs.</p>
      </div>

      @if (loading) {
        <p class="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">Loading your routes and vehicles...</p>
      }
      @if (errorMessage) {
        <p class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</p>
      }

      <!-- Khung chính chia 2 cột (Trái: Wizard 4 bước, Phải: Trip Summary) -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        <!-- CỘT TRÁI (CHIẾM 2 PHẦN): CÁC BƯỚC NHẬP LIỆU -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Thanh tiến trình 4 bước (Stepper) -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="relative flex items-center justify-between">
              <!-- Thanh line nền -->
              <div class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200 z-0"></div>

              <!-- Step 1 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 1" [class.text-white]="step >= 1" [class.bg-gray-200]="step < 1" [class.text-gray-600]="step < 1" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">1</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Route</span>
              </div>

              <!-- Step 2 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 2" [class.text-white]="step >= 2" [class.bg-gray-200]="step < 2" [class.text-gray-600]="step < 2" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">2</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Schedule</span>
              </div>

              <!-- Step 3 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 3" [class.text-white]="step >= 3" [class.bg-gray-200]="step < 3" [class.text-gray-600]="step < 3" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">3</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Vehicle</span>
              </div>

              <!-- Step 4 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 4" [class.text-white]="step >= 4" [class.bg-gray-200]="step < 4" [class.text-gray-600]="step < 4" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">4</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Preferences</span>
              </div>
            </div>
          </div>

          <!-- ================= BƯỚC 1: ROUTE ================= -->
          @if (step === 1) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Where are you going?</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-800 mb-1">Select route</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">↔</span>
                    <select [(ngModel)]="formData.routeId" name="routeId" (ngModelChange)="selectRoute($event)" class="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none">
                      <option [ngValue]="null">Choose one of your saved routes</option>
                      @for (route of routes; track route.routeId) {
                        <option [ngValue]="route.routeId">{{ routeLabel(route) }}</option>
                      }
                    </select>
                  </div>
                  <p class="mt-1 text-xs text-gray-600">{{ formData.startPoint }} <span class="font-semibold">to</span> {{ formData.endPoint }}</p>
                </div>
              </div>

              <div class="flex justify-end pt-4 border-t border-gray-100">
                <button (click)="nextStep()" class="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                  Continue to Schedule &rarr;
                </button>
              </div>
            </div>
          }

          <!-- ================= BƯỚC 2: SCHEDULE ================= -->
          @if (step === 2) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Set your schedule</h2>
              <p class="text-sm text-gray-500">When are you planning to drive?</p>

              <div class="space-y-5">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Departure Date</label>
                  <input type="date" [(ngModel)]="formData.departureDate" name="departureDate" class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Frequency</label>
                  <div class="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                    <button type="button" (click)="setFrequency(false)" [class.bg-white]="!formData.isRecurring" [class.shadow-sm]="!formData.isRecurring" class="rounded-md px-4 py-1.5 text-sm font-semibold">One-time trip</button>
                    <button type="button" (click)="setFrequency(true)" [class.bg-white]="formData.isRecurring" [class.shadow-sm]="formData.isRecurring" class="rounded-md px-4 py-1.5 text-sm font-semibold">Recurring trip</button>
                  </div>
                </div>

                @if (formData.isRecurring) {
                  <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p class="text-sm font-semibold text-gray-800">Schedule from selected route</p>
                    <p class="text-sm text-gray-700">Days: {{ recurringDaysLabel() }}</p>
                    <p class="text-sm text-gray-700">Departure time: {{ recurringTimeLabel() }}</p>
                  </div>
                } @else {
                  <div>
                    <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Departure Time</label>
                    <input type="time" [(ngModel)]="formData.departureTime" name="departureTime" class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none">
                  </div>
                }
              </div>

              <div class="flex justify-between pt-4 border-t border-gray-100">
                <button (click)="prevStep()" class="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
                <button (click)="nextStep()" class="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Continue to Vehicle &rarr;</button>
              </div>
            </div>
          }

          <!-- ================= BƯỚC 3: VEHICLE ================= -->
          @if (step === 3) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Select your vehicle</h2>
              <p class="text-sm text-gray-500">Which car will you be driving for this trip?</p>

              <div class="space-y-3">
                @for (vehicle of vehicles; track vehicle.vehicleId) {
                  <button type="button" (click)="selectVehicle(vehicle)" class="w-full rounded-xl border p-4 flex items-center justify-between text-left cursor-pointer hover:border-blue-300" [class.border-2]="formData.vehicleId === vehicle.vehicleId" [class.border-blue-600]="formData.vehicleId === vehicle.vehicleId" [class.bg-blue-50]="formData.vehicleId === vehicle.vehicleId" [class.border-gray-200]="formData.vehicleId !== vehicle.vehicleId">
                    <div>
                      <p class="font-bold text-gray-900">{{ vehicle.vehicleType }} · {{ vehicle.licensePlate }}</p>
                      <p class="text-xs text-gray-500">{{ vehicle.seatCount }} Seats</p>
                    </div>
                    @if (formData.vehicleId === vehicle.vehicleId) { <span class="text-blue-600 font-bold">✔</span> }
                  </button>
                } @empty {
                  <p class="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No active vehicles found. Add a vehicle in your profile first.</p>
                }
              </div>

              <div class="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-900">Seat Configuration</span>
                  <span class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">Available Seats: {{ formData.availableSeats }}</span>
                </div>
                <div class="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-xl">
                  <button (click)="decreaseSeats()" [disabled]="formData.availableSeats <= 1" class="h-10 w-10 rounded-full border border-gray-300 bg-white font-bold text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">-</button>
                  <span class="text-2xl font-black text-gray-900">{{ formData.availableSeats }}</span>
                  <button (click)="increaseSeats()" [disabled]="formData.availableSeats >= maxAvailableSeats" class="h-10 w-10 rounded-full bg-blue-600 font-bold text-lg text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">+</button>
                </div>
              </div>

              <div class="flex justify-between pt-4 border-t border-gray-100">
                <button (click)="prevStep()" class="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
                <button (click)="nextStep()" class="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Continue to Preferences &rarr;</button>
              </div>
            </div>
          }

          <!-- ================= BƯỚC 4: PREFERENCES & PUBLISH ================= -->
          @if (step === 4) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Review and Confirm</h2>
              <p class="text-sm text-gray-500">Please review your trip details carefully before publishing to the network.</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100 text-sm">
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase">Route</p>
                  <p class="font-bold text-gray-900 mt-1">{{ formData.startPoint }}</p>
                  <p class="text-gray-500">&rarr; {{ formData.endPoint }}</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase">Schedule</p>
                  <p class="font-bold text-gray-900 mt-1">{{ formatDepartureDate() }}</p>
                  <p class="text-gray-500">{{ displayDepartureTime() }}</p>
                  <p class="mt-1 font-semibold text-blue-700">{{ frequencyLabel() }}</p>
                  @if (formData.isRecurring) {
                    <p class="text-gray-500">{{ recurringDaysLabel() }}</p>
                  }
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase">Vehicle</p>
                  <p class="font-bold text-gray-900 mt-1">{{ selectedVehicle?.vehicleType || 'Not selected' }}</p>
                  <p class="text-gray-500">{{ formData.availableSeats }} seats available</p>
                </div>
              </div>

              <div class="flex justify-between pt-4 border-t border-gray-100">
                <button (click)="prevStep()" class="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
                <button (click)="publishTrip()" [disabled]="publishing" class="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {{ publishing ? 'Publishing...' : 'Complete & Publish Trip ✔' }}
                </button>
              </div>
            </div>
          }

        </div>

        <!-- CỘT PHẢI (CHIẾM 1 PHẦN): TRIP SUMMARY -->
        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h3 class="font-bold text-gray-900">Trip Summary</h3>
            
            <div class="border-t border-gray-100 pt-3 space-y-3 text-sm">
              <div>
                <p class="text-xs font-bold uppercase text-gray-400 mb-1">Route</p>
                <p class="font-bold text-gray-900">📍 {{ formData.startPoint || 'Select a route' }}</p>
                <p class="font-bold text-gray-900 mt-1">🏁 {{ formData.endPoint || 'Select a route' }}</p>
              </div>

              <div class="border-t border-gray-100 pt-3">
                <p class="text-xs font-bold uppercase text-gray-400 mb-1">Schedule</p>
                <p class="font-medium text-gray-700">📅 {{ formatDepartureDate() }}</p>
                <p class="font-medium text-gray-700">⏰ {{ displayDepartureTime() }}</p>
                <p class="font-medium text-blue-700">{{ frequencyLabel() }}</p>
                @if (formData.isRecurring) {
                  <p class="font-medium text-gray-700">{{ recurringDaysLabel() }}</p>
                }
              </div>

              <div class="border-t border-gray-100 pt-3">
                <p class="text-xs font-bold uppercase text-gray-400 mb-1">Vehicle & Seats</p>
                <p class="font-medium text-gray-700">🚗 {{ selectedVehicle?.vehicleType || 'Not selected' }}</p>
                <p class="font-medium text-gray-700">💺 {{ formData.availableSeats }} seats available</p>
              </div>
            </div>
          </div>

          <!-- Quick Route Suggestions (Frequent Routes từ ảnh mẫu) -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-900 text-sm">Frequent Routes</h3>
            @for (route of routes; track route.routeId) {
                <button type="button" (click)="selectFrequentRoute(route)" class="w-full rounded-lg border border-gray-100 bg-gray-50 p-3 text-left hover:bg-gray-100 transition-colors">
                  <p class="text-xs font-bold text-gray-900">{{ routeLabel(route) }}</p>
                  <p class="text-[11px] text-gray-500">Usually departs around {{ route.startTime }}</p>
                </button>
            } @empty {
              <p class="text-xs text-gray-500">No saved routes found.</p>
            }
          </div>

        </div>

      </div>
    </div>
    } @else {
      <div class="mx-auto max-w-2xl rounded-xl border border-blue-100 bg-white p-8 text-center shadow-sm">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">🚗</div>
        <h1 class="mt-5 text-2xl font-bold text-gray-900">Register as a driver</h1>
        <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
          This feature is available for drivers only. Register your vehicle and driver information to publish a ride and offer seats to colleagues.
        </p>
        <button type="button" (click)="openProfile()" class="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          Go to profile
        </button>
      </div>
    }
  `
})
export class CreateTripPage {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private tripService = inject(TripService);
  private profileService = inject(ProfileService);
  private authStore = inject(AuthStore);

  step: number = 1;
  routes: Route[] = [];
  vehicles: Vehicle[] = [];
  zones = new Map<number, Zone>();
  loading = true;
  publishing = false;
  errorMessage = '';

  get isDriver(): boolean {
    return this.authStore.role()?.toLowerCase() === 'driver';
  }

  formData = {
    routeId: null as number | null,
    vehicleId: null as number | null,
    startPoint: '',
    endPoint: '',
    departureDate: getLocalDateValue(),
    departureTime: '08:00',
    isRecurring: false,
    availableSeats: 3
  };

  get selectedVehicle(): Vehicle | undefined {
    return this.vehicles.find(vehicle => vehicle.vehicleId === this.formData.vehicleId);
  }

  get selectedRoute(): Route | undefined {
    return this.routes.find(route => route.routeId === this.formData.routeId);
  }

  get maxAvailableSeats(): number {
    return this.selectedVehicle?.seatCount ?? 1;
  }

  ngOnInit(): void {
    if (!this.isDriver) {
      this.loading = false;
      return;
    }

    let loadedRequests = 0;
    const markRequestLoaded = (): void => {
      loadedRequests++;
      this.loading = loadedRequests < 2;
      this.cdr.detectChanges();
    };

    this.profileService.getMyRoutes().subscribe({
      next: routes => {
        this.routes = routes.filter(route => route.isActive);
        if (this.routes.length > 0) this.selectRoute(this.routes[0].routeId);
        markRequestLoaded();
      },
      error: error => {
        console.error('Unable to load routes:', error);
        this.errorMessage = 'Unable to load your routes. Please try again.';
        markRequestLoaded();
      }
    });

    this.profileService.getMyVehicles().subscribe({
      next: vehicles => {
        this.vehicles = vehicles.filter(vehicle => vehicle.isActive);
        if (this.vehicles.length > 0) {
          this.selectVehicle(this.vehicles[0]);
        }
        markRequestLoaded();
      },
      error: error => {
        console.error('Unable to load vehicles:', error);
        this.errorMessage = 'Unable to load your vehicles. Please try again.';
        markRequestLoaded();
      }
    });

    this.profileService.getZones().subscribe({
      next: zones => {
        zones.forEach(zone => this.zones.set(zone.zoneId, zone));
        if (this.selectedRoute) this.selectRoute(this.selectedRoute.routeId);
        this.cdr.detectChanges();
      },
      error: error => {
        console.warn('Unable to load zone names:', error);
      }
    });
  }

  nextStep() {
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  increaseSeats() {
    if (this.formData.availableSeats < this.maxAvailableSeats) this.formData.availableSeats++;
  }

  decreaseSeats() {
    if (this.formData.availableSeats > 1) this.formData.availableSeats--;
  }

  setFrequency(isRecurring: boolean): void {
    this.formData.isRecurring = isRecurring;
    if (isRecurring) {
      this.formData.departureTime = this.routeTimeValue();
    }
  }

  frequencyLabel(): string {
    return this.formData.isRecurring ? 'Recurring trip' : 'One-time trip';
  }

  recurringDaysLabel(): string {
    const days = this.selectedRoute?.daysOfWeek
      ?.split(',')
      .map(day => day.trim())
      .filter(Boolean)
      .map(day => this.abbreviateDay(day));

    return days?.join(', ') || 'No days configured';
  }

  private abbreviateDay(day: string): string {
    const normalizedDay = day.toLowerCase();
    const abbreviations: Record<string, string> = {
      '1': 'Sun', '2': 'Mon', '3': 'Tue', '4': 'Wed', '5': 'Thu', '6': 'Fri', '7': 'Sat',
      monday: 'Mon', mon: 'Mon', mo: 'Mon', m: 'Mon',
      tuesday: 'Tue', tue: 'Tue', tu: 'Tue', t: 'Tue',
      wednesday: 'Wed', wed: 'Wed', we: 'Wed', w: 'Wed',
      thursday: 'Thu', thu: 'Thu', th: 'Thu',
      friday: 'Fri', fri: 'Fri', f: 'Fri',
      saturday: 'Sat', sat: 'Sat', sa: 'Sat', s: 'Sat',
      sunday: 'Sun', sun: 'Sun', su: 'Sun'
    };

    return abbreviations[normalizedDay] || day;
  }

  recurringTimeLabel(): string {
    return this.selectedRoute ? this.formatTime(this.selectedRoute.startTime) : 'No time configured';
  }

  displayDepartureTime(): string {
    return this.formData.isRecurring ? this.recurringTimeLabel() : this.formatTime(this.formData.departureTime);
  }

  private routeTimeValue(): string {
    return this.selectedRoute?.startTime?.slice(0, 5) || '08:00';
  }

  private formatTime(value: string): string {
    return value ? value.slice(0, 5) : 'Not set';
  }

  formatDepartureDate(): string {
    const date = new Date(`${this.formData.departureDate}T12:00:00`);
    return Number.isNaN(date.getTime())
      ? this.formData.departureDate
      : new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(date);
  }

  selectVehicle(vehicle: Vehicle): void {
    this.formData.vehicleId = vehicle.vehicleId;
    this.formData.availableSeats = Math.min(
      Math.max(1, this.formData.availableSeats),
      this.maxAvailableSeats
    );
  }

  selectRoute(routeId: number | null) {
    const route = this.routes.find(item => item.routeId === Number(routeId));
    this.formData.routeId = route?.routeId ?? null;
    this.formData.startPoint = route ? this.zoneName(route.startZoneId) : '';
    this.formData.endPoint = route ? this.zoneName(route.endZoneId) : '';
  }

  selectFrequentRoute(route: Route) {
    this.selectRoute(route.routeId);
  }

  routeLabel(route: Route): string {
    return `${this.zoneName(route.startZoneId)} -> ${this.zoneName(route.endZoneId)}`;
  }

  private zoneName(zoneId: number): string {
    return this.zones.get(zoneId)?.zoneName || `Zone #${zoneId}`;
  }

  publishTrip() {
    const departureTime = this.formData.isRecurring
      ? this.routeTimeValue()
      : this.formData.departureTime;

    if (!this.formData.routeId || !this.formData.vehicleId || !this.formData.departureDate || !departureTime || (this.formData.isRecurring && !this.selectedRoute?.daysOfWeek)) {
      this.errorMessage = 'Select a route, vehicle, and departure date. One-time trips also require a departure time.';
      return;
    }

    this.publishing = true;
    this.errorMessage = '';
    const payload = {
      routeId: this.formData.routeId,
      vehicleId: this.formData.vehicleId,
      departureTime: `${this.formData.departureDate}T${departureTime}:00.000Z`,
      availableSeats: this.formData.availableSeats
    };

    this.tripService.createTrip(payload).subscribe({
      next: () => {
        alert('Đăng ký chuyến đi thành công!');
        this.router.navigate(['/my-bookings']);
      },
      error: error => {
        console.error('Unable to publish trip:', error);
        this.publishing = false;
        this.errorMessage = error?.error?.message || 'Unable to publish the trip. Please try again.';
      }
    });
  }
}
