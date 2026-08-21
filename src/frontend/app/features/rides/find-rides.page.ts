import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  BookingService,
  BookingResponse,
  TripResponse,
  RouteResponse,
  ZoneResponse
} from '../../../src/app/services/booking.service';
import { AuthStore } from '../../core/auth/auth.store';

interface RideViewModel extends TripResponse {
  route?: RouteResponse;
  startZone?: ZoneResponse;
  endZone?: ZoneResponse;
}

@Component({
  selector: 'app-find-rides-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mx-auto max-w-6xl">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Trip Directory</h1>
        <p class="mt-1 text-sm text-gray-500">Browse available corporate commutes or manage your current scheduled trips.</p>
      </div>

      <div class="mt-6 flex border-b border-gray-200">
        <button 
          (click)="selectTab('available')" 
          [class.border-b-2]="activeTab === 'available'"
          [class.border-[#2563EB]]="activeTab === 'available'"
          [class.text-[#2563EB]]="activeTab === 'available'"
          [class.font-bold]="activeTab === 'available'"
          [class.text-gray-500]="activeTab !== 'available'"
          class="pb-3 px-1 text-sm transition-colors">
          Available Trips
        </button>
        <button 
          (click)="selectTab('my-trips')" 
          [class.border-b-2]="activeTab === 'my-trips'"
          [class.border-[#2563EB]]="activeTab === 'my-trips'"
          [class.text-[#2563EB]]="activeTab === 'my-trips'"
          [class.font-bold]="activeTab === 'my-trips'"
          [class.text-gray-500]="activeTab !== 'my-trips'"
          class="pb-3 px-6 text-sm transition-colors">
          My Trips
        </button>
      </div>

      @if (activeTab === 'available') {
        <div class="mt-6 flex items-center justify-between">
          <div class="relative w-[400px]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="Search by route, employee, or time..."
              class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>
      }

      <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        @if (loading) {
          <p class="px-6 py-8 text-center text-gray-500">Loading available trips...</p>
        } @else if (errorMessage && activeTab === 'available') {
          <p class="px-6 py-8 text-center text-red-600">{{ errorMessage }}</p>
        }
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th class="px-6 py-4">DEPARTURE TIME</th>
              <th class="px-6 py-4">ROUTE (FROM → TO)</th>
              <th class="px-6 py-4">SEATS AVAILABLE</th>
              <th class="px-6 py-4">STATUS</th>
              <th class="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            
            @for (trip of displayedTrips; track trip.tripId) {
              <tr class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4"><p class="font-bold text-gray-900">{{ formatDateTime(trip.departureTime) }}</p></td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-600">{{ trip.startZone?.zoneName || 'Unknown pickup' }}</span>
                    <span>&rarr;</span>
                    <span class="font-medium text-gray-600">{{ trip.endZone?.zoneName || 'Unknown destination' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4"><span class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{{ trip.availableSeats }} seats</span></td>
                <td class="px-6 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-bold uppercase" [class.bg-green-50]="statusKey(trip.status) === 'open'" [class.text-green-700]="statusKey(trip.status) === 'open'" [class.bg-blue-50]="statusKey(trip.status) === 'inprogress'" [class.text-blue-700]="statusKey(trip.status) === 'inprogress'" [class.bg-gray-100]="statusKey(trip.status) === 'completed'" [class.text-gray-700]="statusKey(trip.status) === 'completed'" [class.bg-red-50]="statusKey(trip.status) === 'cancelled'" [class.text-red-700]="statusKey(trip.status) === 'cancelled'">{{ trip.status }}</span></td>
                <td class="px-6 py-4 text-right">
                  @if (activeTab === 'available' && !isOwnTrip(trip)) {
                    <button (click)="requestJoin(trip)" class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Request Join</button>
                  } @else if (activeTab === 'available') {
                    <span class="text-sm font-semibold text-gray-500">Your trip</span>
                  } @else {
                    <div class="flex flex-col items-end gap-2">
                      @if (statusKey(trip.status) === 'open') {
                        <button type="button" (click)="changeTripStatus(trip, 'InProgress')" [disabled]="processingTripId === trip.tripId || !hasConfirmedParticipant(trip.tripId)" [title]="hasConfirmedParticipant(trip.tripId) ? 'Start trip' : 'Approve at least one passenger first'" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">Start trip</button>
                        @if (!hasConfirmedParticipant(trip.tripId)) {
                          <span class="max-w-48 text-right text-xs text-amber-700">Approve at least one passenger before starting.</span>
                        }
                      }
                      @if (statusKey(trip.status) === 'inprogress') {
                        <button type="button" (click)="changeTripStatus(trip, 'Completed')" [disabled]="processingTripId === trip.tripId || !hasConfirmedParticipant(trip.tripId)" [title]="hasConfirmedParticipant(trip.tripId) ? 'Complete trip' : 'Approve at least one passenger first'" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">Complete</button>
                        @if (!hasConfirmedParticipant(trip.tripId)) {
                          <span class="max-w-48 text-right text-xs text-amber-700">Approve at least one passenger before completing.</span>
                        }
                      }
                      @if (statusKey(trip.status) === 'open') {
                        <button type="button" (click)="changeTripStatus(trip, 'Cancelled')" [disabled]="processingTripId === trip.tripId" class="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">Cancel</button>
                      }
                      <button type="button" (click)="togglePassengerRequests(trip.tripId)" class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                        {{ openRequestsTripId === trip.tripId ? 'Hide' : 'View' }} passenger requests ({{ pendingBookingsFor(trip.tripId).length }})
                      </button>
                    </div>
                  }
                </td>
              </tr>
              @if (activeTab === 'my-trips' && openRequestsTripId === trip.tripId) {
                <tr class="bg-blue-50/40">
                  <td colspan="5" class="px-6 py-4">
                    <div class="rounded-lg border border-blue-100 bg-white p-4">
                      <h3 class="text-sm font-bold text-gray-900">Passenger requests</h3>
                      @if (pendingBookingsFor(trip.tripId).length === 0) {
                        <p class="mt-2 text-sm text-gray-500">No pending requests for this trip.</p>
                      } @else {
                        <div class="mt-3 divide-y divide-gray-100">
                          @for (booking of pendingBookingsFor(trip.tripId); track booking.bookingId) {
                            <div class="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p class="font-semibold text-gray-900">{{ passengerName(booking) }}</p>
                                <p class="text-sm text-gray-600">Phone: {{ passengerPhone(booking) }}</p>
                              </div>
                              <button type="button" (click)="approveBooking(booking)" [disabled]="processingBookingId === booking.bookingId" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                                {{ processingBookingId === booking.bookingId ? 'Approving...' : 'Approve' }}
                              </button>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }
            }

            @if (displayedTrips.length === 0) {
              <tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">Không tìm thấy chuyến đi nào.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FindRidesPage implements OnInit {
  private bookingService = inject(BookingService);
  private authStore = inject(AuthStore);
  private cdr = inject(ChangeDetectorRef);

  activeTab: 'available' | 'my-trips' = 'available';
  searchQuery: string = '';
  currentPage: number = 1;
  allTrips: RideViewModel[] = [];
  loading = true;
  errorMessage = '';
  myTripsLoaded = false;
  myBookings: BookingResponse[] = [];
  processingTripId: number | null = null;
  processingBookingId: number | null = null;
  openRequestsTripId: number | null = null;

  ngOnInit() {
    this.bookingService.getActiveTrips().pipe(
      switchMap(trips => trips.length ? forkJoin(trips.map(trip => this.loadTripDetails(trip))) : of([] as RideViewModel[])),
      catchError((err: unknown) => {
        console.error(err);
        this.errorMessage = 'Unable to load available trips.';
        return of([] as RideViewModel[]);
      })
    ).subscribe({
      next: trips => this.allTrips = trips,
      complete: () => this.loading = false
    });
  }

  selectTab(tab: 'available' | 'my-trips'): void {
    this.activeTab = tab;
    if (tab === 'my-trips' && !this.myTripsLoaded) {
      this.loadMyTrips();
    }
  }

  private loadMyTrips(): void {
    this.loading = true;
    this.bookingService.getMyTrips().pipe(
      switchMap(trips => trips.length ? forkJoin(trips.map(trip => this.loadTripDetails(trip))) : of([] as RideViewModel[])),
      catchError((err: unknown) => {
        console.error(err);
        this.errorMessage = '';
        return of([] as RideViewModel[]);
      })
    ).subscribe({
      next: trips => {
        const driverId = this.authStore.user()?.id;
        this.allTrips = [...this.allTrips.filter(trip => trip.driverId !== driverId), ...trips];
        this.myTripsLoaded = true;
        this.loading = false;
        this.loadDriverRequests(trips);
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = '';
        this.cdr.detectChanges();
      }
    });
  }

  private loadDriverRequests(trips: RideViewModel[]): void {
    if (trips.length === 0) {
      this.myBookings = [];
      return;
    }

    forkJoin(
      trips.map(trip => this.bookingService.getTripBookings(trip.tripId))
    ).subscribe({
      next: bookingGroups => {
        this.myBookings = bookingGroups
          .flat();
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Unable to load passenger requests for driver trips:', err);
        this.myBookings = [];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredTrips() {
    let trips = this.allTrips;
    if (this.activeTab === 'my-trips') {
      trips = trips.filter(t => t.driverId === this.authStore.user()?.id);
    }
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      trips = trips.filter(t =>
        [
          t.tripId,
          t.routeId,
          t.driverId,
          t.vehicleId,
          t.status,
          t.departureTime,
          t.startZone?.zoneName,
          t.endZone?.zoneName
        ].some(value => String(value ?? '').toLowerCase().includes(q))
      );
    }
    return [...trips].sort((left, right) => this.statusOrder(left.status) - this.statusOrder(right.status));
  }

  get displayedTrips() {
    return this.filteredTrips;
  }

  isOwnTrip(trip: RideViewModel): boolean {
    return trip.driverId === this.authStore.user()?.id;
  }

  statusKey(status: string): string {
    return status.replace(/\s+/g, '').toLowerCase();
  }

  private statusOrder(status: string): number {
    const order: Record<string, number> = {
      open: 0,
      inprogress: 1,
      completed: 2,
      cancelled: 3
    };
    return order[this.statusKey(status)] ?? 99;
  }

  requestJoin(trip: RideViewModel) {
    this.bookingService.createBooking(trip.tripId).subscribe({
      next: () => alert('Gửi yêu cầu đi nhờ thành công!'),
      error: (err: unknown) => {
        console.error(err);
        alert('Có lỗi xảy ra.');
      }
    });
  }

  pendingBookingsFor(tripId: number): BookingResponse[] {
    return this.myBookings.filter(booking =>
      booking.tripId === tripId && this.statusKey(booking.status) === 'pending'
    );
  }

  hasConfirmedParticipant(tripId: number): boolean {
    return this.myBookings.some(booking =>
      booking.tripId === tripId && ['confirmed', 'checkedin'].includes(this.statusKey(booking.status))
    );
  }

  togglePassengerRequests(tripId: number): void {
    this.openRequestsTripId = this.openRequestsTripId === tripId ? null : tripId;
  }

  passengerName(booking: BookingResponse): string {
    return booking.passengerName || booking.passenger?.fullName || `Passenger #${booking.passengerId}`;
  }

  passengerPhone(booking: BookingResponse): string {
    return booking.passengerPhone || booking.passenger?.phone || 'Not provided by API';
  }

  approveBooking(booking: BookingResponse): void {
    if (this.processingBookingId !== null) return;
    this.processingBookingId = booking.bookingId;
    this.bookingService.confirmBooking(booking.bookingId).subscribe({
      next: updatedBooking => {
        this.myBookings = this.myBookings.map(item =>
          item.bookingId === updatedBooking.bookingId ? updatedBooking : item
        );
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        alert('Unable to approve this passenger request.');
      },
      complete: () => {
        this.processingBookingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  changeTripStatus(trip: RideViewModel, status: string): void {
    if (status === trip.status || this.processingTripId !== null) return;
    if ((status === 'InProgress' || status === 'Completed') && !this.hasConfirmedParticipant(trip.tripId)) {
      alert(`Approve at least one passenger before ${status === 'InProgress' ? 'starting' : 'completing'} this trip.`);
      return;
    }
    this.processingTripId = trip.tripId;
    this.bookingService.updateTripStatus(trip.tripId, status).subscribe({
      next: updatedTrip => {
        Object.assign(trip, updatedTrip);
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        alert('Unable to update trip status.');
        this.cdr.detectChanges();
      },
      complete: () => {
        this.processingTripId = null;
        this.cdr.detectChanges();
      }
    });
  }

  formatDateTime(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  }

  private loadTripDetails(trip: TripResponse): Observable<RideViewModel> {
    return this.bookingService.getRoute(trip.routeId).pipe(
      switchMap(route => {
        if (!route) {
          return of({ ...trip });
        }

        return forkJoin({
          startZone: this.bookingService.getZone(route.startZoneId).pipe(catchError(() => of(undefined))),
          endZone: this.bookingService.getZone(route.endZoneId).pipe(catchError(() => of(undefined)))
        }).pipe(
          map(zones => ({ ...trip, route, ...zones }))
        );
      }),
      catchError(() => of({ ...trip }))
    );
  }
}
