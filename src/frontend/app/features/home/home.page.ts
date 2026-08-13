import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mx-auto max-w-7xl space-y-8 pb-10">
      
      <!-- HEADER CHÀO MỪNG -->
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Good morning, Sarah</h1>
          <p class="mt-1 text-sm text-gray-500">Here is your mobility summary for today, Thursday, Oct 26.</p>
        </div>
        <div class="flex items-center gap-3">
          <a routerLink="/create-trip" class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Offer Ride
          </a>
          <a routerLink="/find-rides" class="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Find Ride
          </a>
        </div>
      </div>

      <!-- CÁC THẺ THỐNG KÊ -->
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">TRIPS THIS MONTH</p>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-gray-900">14</span>
            <span class="text-sm font-bold text-blue-600">~+2</span>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">MILES SAVED</p>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-gray-900">342</span>
            <span class="text-sm font-bold text-green-600">mi ~12%</span>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wider text-gray-400">CO2 REDUCED</p>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-3xl font-extrabold text-gray-900">128</span>
            <span class="text-sm font-bold text-emerald-600">lbs <span class="text-xs font-normal">🌱 Excellent</span></span>
          </div>
        </div>
      </div>

      <!-- KHU VỰC CHÍNH -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        <!-- CỘT TRÁI: UPCOMING TRIPS -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">Upcoming Trips</h2>
            <a routerLink="/my-bookings" class="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">View All</a>
          </div>

          <!-- Chuyến 1: Confirmed -->
          <div class="group relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-gray-50 px-3 py-2 text-center border border-gray-100">
                <p class="text-[10px] font-bold uppercase text-gray-400">TODAY</p>
                <p class="text-base font-black text-gray-900">5:15</p>
                <p class="text-[10px] text-gray-400">PM</p>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <span class="h-2 w-2 rounded-full bg-green-500"></span> Downtown Office
                </div>
                <div class="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <span class="h-2 w-2 rounded-full border-2 border-gray-400 bg-white"></span> Northside Transit Center
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-[11px] font-semibold text-gray-400">DRIVER</p>
                <p class="text-sm font-bold text-gray-900">Michael T.</p>
                <span class="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Confirmed</span>
              </div>
              <img src="https://i.pravatar.cc/150?img=12" alt="Driver" class="h-10 w-10 rounded-full object-cover">
              <button (click)="viewBookingDetails()" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="View details">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <!-- Chuyến 2: Pending (Có thể bấm tương tác trực tiếp) -->
          <div class="group relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
            <div class="flex items-center gap-4">
              <div class="rounded-lg bg-gray-50 px-3 py-2 text-center border border-gray-100">
                <p class="text-[10px] font-bold uppercase text-gray-400">TOMORROW</p>
                <p class="text-base font-black text-gray-900">8:30</p>
                <p class="text-[10px] text-gray-400">AM</p>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <span class="h-2 w-2 rounded-full bg-blue-500"></span> West End Park & Ride
                </div>
                <div class="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <span class="h-2 w-2 rounded-full border-2 border-gray-400 bg-white"></span> Downtown Office
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-[11px] font-semibold text-gray-400">DRIVER</p>
                <p class="text-sm font-bold text-gray-900">Jane D.</p>
                <!-- Nút bấm tương tác trạng thái Pending -->
                <button (click)="confirmPendingTrip()" class="mt-0.5 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-[10px] font-bold text-yellow-800 hover:bg-yellow-200 transition-colors cursor-pointer" title="Click để xác nhận chuyến đi">
                  Pending 🔄
                </button>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">JD</div>
              <button (click)="viewBookingDetails()" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors" title="View details">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

        </div>

        <!-- CỘT PHẢI: RECENT UPDATES & GOAL -->
        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 class="font-bold text-gray-900">Recent Updates</h3>
              <span class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">2 NEW</span>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex gap-3 border-l-2 border-blue-500 pl-3">
                <p class="text-gray-600"><strong class="text-gray-900">Michael T.</strong> approved your ride request for today at 5:15 PM. <span class="block text-[11px] text-gray-400 mt-0.5">10 mins ago</span></p>
              </div>
              <div class="flex gap-3 border-l-2 border-gray-200 pl-3">
                <p class="text-gray-600">New message from <strong class="text-gray-900">Jane D.</strong> regarding tomorrow's commute. <span class="block text-[11px] text-gray-400 mt-0.5">1 hour ago</span></p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-900">Corporate Goal Progress</h3>
            <p class="text-xs text-gray-500">Your division is currently 4th in the company for emission reductions.</p>
            <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div class="h-full bg-green-500 rounded-full" style="width: 75%"></div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 font-medium">
              <span>750 lbs saved</span>
              <span>Goal: 1000 lbs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class HomePage {
  private router = inject(Router);

  confirmPendingTrip() {
    const confirmAction = confirm('Bạn có muốn xác nhận/phê duyệt chuyến đi này không?');
    if (confirmAction) {
      alert('Đã xác nhận chuyến đi thành công!');
    }
  }

  viewBookingDetails() {
    this.router.navigate(['/my-bookings']);
  }
}
