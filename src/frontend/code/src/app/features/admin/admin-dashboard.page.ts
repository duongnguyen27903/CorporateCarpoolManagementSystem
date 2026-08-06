import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Overview</h1>
          <p class="mt-1 text-sm text-gray-500">Enterprise carpooling metrics and platform status.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export
          </button>
          <button class="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Report
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Total Trips -->
        <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500">TOTAL TRIPS</p>
              <div class="mt-2 text-4xl font-extrabold text-gray-900">1,240</div>
              <p class="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                12% from last month
              </p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
        </div>

        <!-- Total KM Saved -->
        <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500">TOTAL KM SAVED</p>
              <div class="mt-2 text-4xl font-extrabold text-gray-900">15.4k</div>
              <p class="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                8% from last month
              </p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
          </div>
        </div>

        <!-- Active Employees -->
        <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500">ACTIVE EMPLOYEES</p>
              <div class="mt-2 text-4xl font-extrabold text-gray-900">850</div>
              <p class="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                5% from last month
              </p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
        </div>

        <!-- CO2 Reduction -->
        <div class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500">CO2 REDUCTION</p>
              <div class="mt-2 text-4xl font-extrabold text-gray-900">3.2t</div>
              <p class="mt-2 text-xs font-semibold text-gray-500 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Stable this month
              </p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><path d="M12 6v6l4.25 2.5"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <!-- Left Column: Charts -->
        <div class="col-span-2 space-y-6">
          <!-- Participation by Department (Bar Chart Placeholder) -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Participation by Department</h2>
              <button class="text-gray-400 hover:text-gray-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
            </div>
            
            <div class="relative h-64 w-full border-b border-gray-200">
              <!-- Grid Lines -->
              <div class="absolute inset-0 flex flex-col justify-between">
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">450</span></div>
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">300</span></div>
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">150</span></div>
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">0</span></div>
              </div>
              
              <!-- Bars -->
              <div class="absolute inset-0 flex items-end justify-around pl-10 pr-4 pb-[1px]">
                <div class="w-10 bg-[#2563EB] rounded-t-sm" style="height: 70%;"></div>
                <div class="w-10 bg-[#2563EB] rounded-t-sm" style="height: 95%;"></div>
                <div class="w-10 bg-[#2563EB] rounded-t-sm" style="height: 35%;"></div>
                <div class="w-10 bg-[#2563EB] rounded-t-sm" style="height: 40%;"></div>
                <div class="w-10 bg-[#2563EB] rounded-t-sm" style="height: 65%;"></div>
              </div>
            </div>
            
            <!-- X-Axis Labels -->
            <div class="mt-3 flex justify-around pl-10 pr-4 text-xs font-semibold text-gray-500">
              <span class="w-10 text-center">Sales</span>
              <span class="w-10 text-center">IT</span>
              <span class="w-10 text-center">HR</span>
              <span class="w-10 text-center">Finance</span>
              <span class="w-10 text-center">Operations</span>
            </div>
          </div>

          <!-- Monthly Trip Trends (Line Chart Placeholder) -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">Monthly Trip Trends</h2>
              <div class="flex overflow-hidden rounded-lg border border-gray-300">
                <button class="bg-gray-100 px-3 py-1 text-xs font-bold text-gray-900">6M</button>
                <button class="border-l border-gray-300 bg-white px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50">1Y</button>
                <button class="border-l border-gray-300 bg-white px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-50">ALL</button>
              </div>
            </div>
            
            <div class="relative h-64 w-full">
              <!-- Grid Lines -->
              <div class="absolute inset-0 flex flex-col justify-between border-b border-gray-200">
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">1,250</span></div>
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">1,100</span></div>
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">950</span></div>
                <div class="w-full border-b border-gray-100 flex items-end justify-start"><span class="text-[10px] text-gray-400 -translate-y-1.5 bg-white pr-2">800</span></div>
              </div>
              
              <!-- Simple SVG Line Curve -->
              <svg class="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <!-- Area Under Curve -->
                <path d="M 10 95 Q 25 85, 40 70 T 70 80 Q 85 40, 100 15 L 100 100 L 10 100 Z" fill="rgba(37, 99, 235, 0.1)"></path>
                <!-- Line -->
                <path d="M 10 95 Q 25 85, 40 70 T 70 80 Q 85 40, 100 15" fill="none" stroke="#2563EB" stroke-width="2"></path>
                
                <!-- Data Points -->
                <circle cx="10" cy="95" r="2" fill="white" stroke="#2563EB" stroke-width="1.5"></circle>
                <circle cx="28" cy="88" r="2" fill="white" stroke="#2563EB" stroke-width="1.5"></circle>
                <circle cx="48" cy="72" r="2" fill="white" stroke="#2563EB" stroke-width="1.5"></circle>
                <circle cx="68" cy="80" r="2" fill="white" stroke="#2563EB" stroke-width="1.5"></circle>
                <circle cx="85" cy="55" r="2" fill="white" stroke="#2563EB" stroke-width="1.5"></circle>
                <circle cx="100" cy="15" r="2" fill="white" stroke="#2563EB" stroke-width="1.5"></circle>
              </svg>
            </div>
            
            <!-- X-Axis Labels -->
            <div class="mt-3 flex justify-between pl-6 pr-0 text-[10px] font-bold uppercase text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Alerts -->
        <div class="col-span-1">
          <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 class="text-lg font-bold text-gray-900">Recent Alerts</h2>
              <span class="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">3 New</span>
            </div>
            
            <div class="divide-y divide-gray-100">
              <!-- Alert 1 -->
              <div class="flex items-start gap-3 p-5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">Policy Update Required</h3>
                  <p class="mt-1 text-xs font-medium text-gray-500 line-clamp-2">New regional regulations require a review of the current insurance policies for drivers.</p>
                  <p class="mt-1.5 text-[10px] font-bold text-gray-400">2 hours ago</p>
                </div>
              </div>

              <!-- Alert 2 -->
              <div class="flex items-start gap-3 p-5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">New Area Request</h3>
                  <p class="mt-1 text-xs font-medium text-gray-500 line-clamp-2">Multiple users have requested coverage for the emerging 'Tech Hub' district in South City.</p>
                  <p class="mt-1.5 text-[10px] font-bold text-gray-400">5 hours ago</p>
                </div>
              </div>

              <!-- Alert 3 -->
              <div class="flex items-start gap-3 p-5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">High Cancellation Rate</h3>
                  <p class="mt-1 text-xs font-medium text-gray-500 line-clamp-2">Route #A4B2 is experiencing unusually high last-minute cancellations this week.</p>
                  <p class="mt-1.5 text-[10px] font-bold text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 p-4 text-center">
              <a href="#" class="text-sm font-bold text-[#2563EB] hover:underline">View All Alerts</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardPage { }
