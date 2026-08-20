import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  BookingService,
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
          (click)="activeTab = 'available'" 
          [class.border-b-2]="activeTab === 'available'"
          [class.border-[#2563EB]]="activeTab === 'available'"
          [class.text-[#2563EB]]="activeTab === 'available'"
          [class.font-bold]="activeTab === 'available'"
          [class.text-gray-500]="activeTab !== 'available'"
          class="pb-3 px-1 text-sm transition-colors">
          Available Trips
        </button>
        <button 
          (click)="activeTab = 'my-trips'" 
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
        } @else if (errorMessage) {
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
                <td class="px-6 py-4"><span class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold uppercase text-green-700">{{ trip.status }}</span></td>
                <td class="px-6 py-4 text-right">
                  <button (click)="requestJoin(trip)" class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Request Join</button>
                </td>
              </tr>
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

  activeTab: 'available' | 'my-trips' = 'available';
  searchQuery: string = '';
  currentPage: number = 1;
  allTrips: RideViewModel[] = [];
  loading = true;
  errorMessage = '';

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
    return trips;
  }

  get displayedTrips() {
    return this.filteredTrips;
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
