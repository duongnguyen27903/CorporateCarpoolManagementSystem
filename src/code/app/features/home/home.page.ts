import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import { CardComponent } from '../../shared/ui/card'


@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-6xl space-y-6">
      
      <!-- Greeting & Top Actions -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Good morning, Sarah</h1>
          <p class="mt-1 text-sm text-gray-500">Here is your mobility summary for today, Thursday, Oct 26.</p>
        </div>
        <div class="flex gap-3">
          <button class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Offer Ride
          </button>
          <button class="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Find Ride
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Trips -->
        <div class="flex flex-col justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-24 bg-blue-50/50 rounded-l-full translate-x-8"></div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">TRIPS THIS MONTH</p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-4xl font-extrabold text-gray-900">14</span>
            <span class="text-sm font-semibold text-emerald-600">~+2</span>
          </div>
          <svg class="absolute right-6 top-6 text-blue-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
        </div>
        <!-- Miles -->
        <div class="flex flex-col justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-24 bg-emerald-50/50 rounded-l-full translate-x-8"></div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">MILES SAVED</p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-4xl font-extrabold text-gray-900">342</span>
            <span class="text-sm font-medium text-gray-500">mi</span>
            <span class="text-sm font-semibold text-emerald-600">~12%</span>
          </div>
          <svg class="absolute right-6 top-6 text-emerald-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        </div>
        <!-- CO2 -->
        <div class="flex flex-col justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 h-full w-24 bg-green-50 rounded-l-full translate-x-8"></div>
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">CO2 REDUCED</p>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-4xl font-extrabold text-gray-900">128</span>
            <span class="text-sm font-medium text-gray-500">lbs</span>
            <span class="text-sm font-semibold text-emerald-600 flex items-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Excellent</span>
          </div>
          <svg class="absolute right-6 top-6 text-green-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><path d="M12 6v6l4.25 2.5"></path></svg>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Upcoming Trips (2 Columns) -->
        <div class="col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">Upcoming Trips</h2>
            <a href="#" class="text-sm font-semibold text-[#2563EB] hover:underline">View All</a>
          </div>

          <!-- Trip Card 1 -->
          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="flex gap-6">
              <div class="flex flex-col items-center justify-center rounded-lg bg-gray-50 px-4 py-2">
                <span class="text-[10px] font-bold text-gray-500 uppercase">TODAY</span>
                <span class="text-xl font-extrabold text-gray-900">5:15</span>
                <span class="text-[10px] font-bold text-gray-500">PM</span>
              </div>
              <div class="flex flex-col justify-between py-1">
                <div class="flex items-center gap-3">
                  <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span class="font-bold text-gray-900">Downtown Office</span>
                </div>
                <div class="ml-1 h-3 border-l-2 border-dashed border-gray-200"></div>
                <div class="flex items-center gap-3">
                  <div class="h-2 w-2 rounded-full border-2 border-gray-400"></div>
                  <span class="font-bold text-gray-900">Northside Transit Center</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?img=11" alt="Michael T." class="h-10 w-10 rounded-full bg-gray-200 object-cover">
                <div>
                  <p class="text-[10px] font-bold text-gray-500 uppercase">Driver</p>
                  <p class="text-sm font-bold text-gray-900">Michael T.</p>
                </div>
              </div>
              <span class="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Confirmed</span>
              <button class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>
              </button>
            </div>
          </div>

          <!-- Trip Card 2 -->
          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="flex gap-6">
              <div class="flex flex-col items-center justify-center rounded-lg bg-gray-50 px-4 py-2">
                <span class="text-[10px] font-bold text-gray-500 uppercase">TOMORROW</span>
                <span class="text-xl font-extrabold text-gray-900">8:30</span>
                <span class="text-[10px] font-bold text-gray-500">AM</span>
              </div>
              <div class="flex flex-col justify-between py-1">
                <div class="flex items-center gap-3">
                  <div class="h-2 w-2 rounded-full border-2 border-gray-400"></div>
                  <span class="font-bold text-gray-900">West End Park & Ride</span>
                </div>
                <div class="ml-1 h-3 border-l-2 border-dashed border-gray-200"></div>
                <div class="flex items-center gap-3">
                  <div class="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span class="font-bold text-gray-900">Downtown Office</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">JD</div>
                <div>
                  <p class="text-[10px] font-bold text-gray-500 uppercase">Driver</p>
                  <p class="text-sm font-bold text-gray-900">Jane D.</p>
                </div>
              </div>
              <span class="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Pending</span>
              <button class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column (Updates & Goals) -->
        <div class="space-y-6 mt-11">
          
          <!-- Recent Updates -->
          <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div class="flex items-center gap-2">
                <svg class="text-gray-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <h3 class="font-bold text-gray-900">Recent Updates</h3>
              </div>
              <span class="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">2 NEW</span>
            </div>
            <div class="divide-y divide-gray-100">
              <div class="flex gap-4 p-5 relative">
                <div class="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-md"></div>
                <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div>
                  <p class="text-sm text-gray-900">Michael T. approved your ride request for today at 5:15 PM.</p>
                  <p class="mt-1 text-xs text-gray-500">10 mins ago</p>
                </div>
              </div>
              <div class="flex gap-4 p-5">
                <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div>
                  <p class="text-sm text-gray-900">New message from Jane D. regarding tomorrow's commute.</p>
                  <p class="mt-1 text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div class="flex gap-4 p-5">
                <div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
                <div>
                  <p class="text-sm text-gray-900">You earned a 'Green Commuter' badge for saving 50 lbs of CO2 this week!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Goal Progress -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 class="font-bold text-gray-900">Corporate Goal Progress</h3>
            <p class="mt-2 text-sm text-gray-600">Your division is currently 4th in the company for emission reductions.</p>
            <div class="mt-4">
              <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div class="h-full bg-emerald-600" style="width: 75%"></div>
              </div>
              <div class="mt-2 flex justify-between text-xs font-semibold text-gray-500">
                <span>750 lbs saved</span>
                <span>Goal: 1000 lbs</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class HomePage {
  // Logic hiển thị sẽ lấy từ file Mock Data ở bước trước
}
