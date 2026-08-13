import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Thêm module này để dùng các pipe/directives cơ bản

// --- KHAI BÁO CẤU TRÚC DỮ LIỆU ---
export interface PassengerRequest {
  id: string;
  name: string;
  avatar: string;
  department: string;
  pickupLocation: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface DrivingTrip {
  id: string;
  date: string;
  time: string;
  startPoint: string;
  endPoint: string;
  requests: PassengerRequest[];
}

export interface JoiningTrip {
  id: string;
  date: string;
  time: string;
  startPoint: string;
  endPoint: string;
  status: 'Pending' | 'Approved';
  driverName: string;
  driverAvatar: string;
  carInfo: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mx-auto max-w-6xl space-y-8 pb-10">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your upcoming drives and requested rides.</p>
        </div>
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button class="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-gray-900 shadow-sm">Active</button>
          <button class="rounded-md px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">History</button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        <!-- CỘT 1: TRIPS I'M DRIVING -->
        <div class="space-y-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15V9"/><path d="M11 15V9"/><path d="M15 15V9"/><path d="M19 15V9"/></svg>
            Trips I'm Driving
          </h2>
          
          @for (trip of drivingTrips; track trip.id) {
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="mb-2 flex items-center gap-2">
                      <span class="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">SCHEDULED</span>
                      <span class="text-sm font-medium text-gray-500">{{ trip.date }} &bull; {{ trip.time }}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">{{ trip.startPoint }} <span class="font-normal text-gray-400">&rarr;</span> {{ trip.endPoint }}</h3>
                  </div>
                </div>
              </div>
              
              <!-- Danh sách người xin đi nhờ -->
              <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <h4 class="mb-4 text-sm font-bold text-gray-900">Pending Requests ({{ getPendingCount(trip.requests) }})</h4>
                <div class="space-y-3">
                  @for (req of trip.requests; track req.id) {
                    @if (req.status === 'Pending') {
                      <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                        <div class="flex items-center gap-3">
                          <img class="h-10 w-10 rounded-full" [src]="req.avatar" [alt]="req.name">
                          <div>
                            <p class="text-sm font-bold text-gray-900">{{ req.name }}</p>
                            <p class="text-xs text-gray-500">{{ req.department }} &bull; Pick up at {{ req.pickupLocation }}</p>
                          </div>
                        </div>
                        <div class="flex gap-2">
                          <button (click)="handleReject(trip.id, req.id)" class="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Reject
                          </button>
                          <button (click)="handleApprove(trip.id, req.id)" class="flex items-center gap-1 rounded-md bg-[#004EEB] px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Approve
                          </button>
                        </div>
                      </div>
                    }
                  }
                  @if (getPendingCount(trip.requests) === 0) {
                    <p class="text-sm text-gray-500 italic">No pending requests.</p>
                  }
                </div>
              </div>

              <div class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Cancellation policy: Please notify passengers 24h prior.
                </div>
                <button (click)="handleCancelTrip(trip.id)" class="text-sm font-semibold text-red-600 hover:text-red-800">Cancel Trip</button>
              </div>
            </div>
          }
        </div>

        <!-- CỘT 2: TRIPS I'M JOINING -->
        <div class="space-y-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Trips I'm Joining
          </h2>
          
          @for (booking of joiningTrips; track booking.id) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-4">
              <div class="mb-2 flex items-start justify-between">
                <h3 class="text-lg font-bold text-gray-900">{{ booking.startPoint }} <span class="font-normal text-gray-400">&rarr;</span> {{ booking.endPoint }}</h3>
                
                @if (booking.status === 'Approved') {
                  <span class="flex items-center gap-1 rounded-full bg-[#34D399]/20 px-2.5 py-1 text-xs font-bold text-green-700">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Approved
                  </span>
                } @else {
                  <span class="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Pending
                  </span>
                }
              </div>
              <p class="mb-4 text-sm font-medium text-gray-500">{{ booking.date }} &bull; {{ booking.time }}</p>
              
              @if (booking.status === 'Approved') {
                <div class="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div class="flex items-center gap-3">
                    <img class="h-10 w-10 rounded-full" [src]="booking.driverAvatar" [alt]="booking.driverName">
                    <div>
                      <p class="text-sm text-gray-500">Driver: <span class="font-bold text-gray-900">{{ booking.driverName }}</span></p>
                      <p class="text-xs text-gray-500">{{ booking.carInfo }}</p>
                    </div>
                  </div>
                  <button class="text-gray-400 hover:text-gray-600" title="Message Driver">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </button>
                </div>
              }
              
              <div class="flex items-center justify-between border-t border-gray-100 pt-4">
                @if (booking.status === 'Approved') {
                  <p class="text-xs text-gray-500">Free cancellation until 07:45 PM today</p>
                  <button (click)="handleWithdraw(booking.id)" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel Request</button>
                } @else {
                  <p class="text-xs text-gray-500">Waiting for driver approval</p>
                  <button (click)="handleWithdraw(booking.id)" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Withdraw</button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BookingsPage implements OnInit {

  // Dữ liệu mô phỏng (Mock Data)
  drivingTrips: DrivingTrip[] = [];
  joiningTrips: JoiningTrip[] = [];

  ngOnInit() {
    this.loadMockData();
  }

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN NÚT BẤM ---

  handleApprove(tripId: string, requestId: string) {
    const trip = this.drivingTrips.find(t => t.id === tripId);
    if (trip) {
      const req = trip.requests.find(r => r.id === requestId);
      if (req) {
        req.status = 'Approved';
        alert(`Đã CHẤP NHẬN yêu cầu của ${req.name}`);
      }
    }
  }

  handleReject(tripId: string, requestId: string) {
    const trip = this.drivingTrips.find(t => t.id === tripId);
    if (trip) {
      const req = trip.requests.find(r => r.id === requestId);
      if (req) {
        req.status = 'Rejected';
        alert(`Đã TỪ CHỐI yêu cầu của ${req.name}`);
      }
    }
  }

  handleCancelTrip(tripId: string) {
    if (confirm('Bạn có chắc chắn muốn hủy toàn bộ chuyến đi này không?')) {
      this.drivingTrips = this.drivingTrips.filter(t => t.id !== tripId);
      alert('Đã hủy chuyến đi thành công.');
    }
  }

  handleWithdraw(bookingId: string) {
    if (confirm('Bạn có chắc chắn muốn rút lại yêu cầu xin đi ké này không?')) {
      this.joiningTrips = this.joiningTrips.filter(b => b.id !== bookingId);
      alert('Đã rút yêu cầu thành công.');
    }
  }

  getPendingCount(requests: PassengerRequest[]): number {
    return requests.filter(r => r.status === 'Pending').length;
  }

  // --- TẢI DỮ LIỆU MẪU ---
  private loadMockData() {
    this.drivingTrips = [
      {
        id: 'trip-1',
        date: 'Oct 24',
        time: '08:30 AM',
        startPoint: 'Downtown Office',
        endPoint: 'Tech Park Campus',
        requests: [
          {
            id: 'req-1',
            name: 'Michael Chang',
            avatar: 'https://i.pravatar.cc/150?img=11',
            department: 'Marketing Dept',
            pickupLocation: '4th St.',
            status: 'Pending'
          },
          {
            id: 'req-2',
            name: 'Sarah Jenkins',
            avatar: 'https://i.pravatar.cc/150?img=5',
            department: 'Sales',
            pickupLocation: 'Main Transit Hub',
            status: 'Pending'
          }
        ]
      }
    ];

    this.joiningTrips = [
      {
        id: 'join-1',
        date: 'Tomorrow',
        time: '07:45 AM',
        startPoint: 'North Suburbs',
        endPoint: 'HQ Building',
        status: 'Approved',
        driverName: 'David Miller',
        driverAvatar: 'https://i.pravatar.cc/150?img=33',
        carInfo: 'Toyota Prius • Blue • XYZ-1234'
      },
      {
        id: 'join-2',
        date: 'Oct 26',
        time: '09:00 AM',
        startPoint: 'Train Station',
        endPoint: 'Factory A',
        status: 'Pending',
        driverName: '',
        driverAvatar: '',
        carInfo: ''
      }
    ];
  }
}
