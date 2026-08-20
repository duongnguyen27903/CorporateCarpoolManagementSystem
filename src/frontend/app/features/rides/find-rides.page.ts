import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TripService, TripDto } from '../trips/trip.service';

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
              placeholder="Search by route, driver, or time..." 
              class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>
      }

      <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th class="px-6 py-4">DRIVER</th>
              <th class="px-6 py-4">DEPARTURE TIME</th>
              <th class="px-6 py-4">ROUTE (FROM → TO)</th>
              <th class="px-6 py-4">SEATS AVAILABLE</th>
              <th class="px-6 py-4">COST</th>
              <th class="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            
            @for (trip of displayedTrips; track trip.id) {
              <tr class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    @if (trip.driverAvatar) {
                      <img [src]="trip.driverAvatar" [alt]="trip.driverName" class="h-10 w-10 rounded-full bg-gray-200 object-cover">
                    } @else {
                      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{{ trip.driverInitials }}</div>
                    }
                    <div>
                      <p class="font-bold text-gray-900">{{ trip.driverName }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4"><p class="font-bold text-gray-900">{{ trip.departureTime }}</p></td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-600">{{ trip.startPoint }}</span>
                    <span>&rarr;</span>
                    <span class="font-medium text-gray-600">{{ trip.endPoint }}</span>
                  </div>
                </td>
                <td class="px-6 py-4"><span class="text-xs font-bold">{{ trip.seatsAvailable }} Left</span></td>
                <td class="px-6 py-4"><p class="font-bold text-gray-900">{{ trip.cost }}</p></td>
                <td class="px-6 py-4 text-right">
                  <button (click)="requestJoin(trip)" class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Request Join</button>
                </td>
              </tr>
            }

            @if (displayedTrips.length === 0) {
              <tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Không tìm thấy chuyến đi nào.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FindRidesPage implements OnInit {
  private tripService = inject(TripService);
  private http = inject(HttpClient);

  activeTab: 'available' | 'my-trips' = 'available';
  searchQuery: string = '';
  currentPage: number = 1;
  allTrips: any[] = [];

  ngOnInit() {
    this.tripService.getAvailableTrips().subscribe({
      next: (data: TripDto[]) => {
        if (data && data.length > 0) {
          this.allTrips = data;
        } else {
          this.loadMockData();
        }
      },
      error: (err: unknown) => {
        console.error(err);
        this.loadMockData();
      }
    });
  }

  get filteredTrips() {
    let trips = this.allTrips;
    if (this.activeTab === 'my-trips') {
      trips = trips.filter((t: any) => t.driverName === 'Elena Rodriguez');
    }
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      trips = trips.filter((t: any) =>
        t.startPoint.toLowerCase().includes(q) ||
        t.endPoint.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q)
      );
    }
    return trips;
  }

  get displayedTrips() {
    return this.filteredTrips;
  }

  requestJoin(trip: any) {
    const tripId = trip.tripId || trip.id;
    this.http.post('http://localhost:5147/api/Booking', { tripId }).subscribe({
      next: () => alert('Gửi yêu cầu đi nhờ thành công!'),
      error: (err: unknown) => {
        console.error(err);
        alert('Có lỗi xảy ra.');
      }
    });
  }

  private loadMockData() {
    this.allTrips = [
      {
        id: '1',
        driverName: 'Elena Rodriguez',
        driverAvatar: 'https://i.pravatar.cc/150?img=1',
        driverInitials: 'ER',
        rating: 4.9,
        totalTrips: 124,
        departureTime: 'Today, 5:15 PM',
        startPoint: 'HQ Campus',
        endPoint: 'Westside Hub',
        seatsAvailable: 3,
        cost: '$2.50'
      }
    ];
  }
}
