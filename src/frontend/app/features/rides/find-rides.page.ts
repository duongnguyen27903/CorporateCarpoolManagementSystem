import { Component } from '@angular/core';

@Component({
  selector: 'app-find-rides-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-6xl">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Trip Directory</h1>
        <p class="mt-1 text-sm text-gray-500">Browse available corporate commutes or manage your current scheduled trips.</p>
      </div>

      <div class="mt-6 flex border-b border-gray-200">
        <button class="border-b-2 border-[#2563EB] pb-3 px-1 text-sm font-bold text-[#2563EB]">Available Trips</button>
        <button class="pb-3 px-6 text-sm font-medium text-gray-500 hover:text-gray-700">My Trips</button>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <div class="relative w-[400px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search by route, driver, or time..." class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
        </div>
        <div class="flex gap-3">
          <button class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Date
          </button>
          <button class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            More Filters
          </button>
        </div>
      </div>

      <div class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th class="px-6 py-4">DRIVER</th>
              <th class="px-6 py-4">
                <div class="flex items-center gap-1">
                  DEPARTURE TIME
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
                </div>
              </th>
              <th class="px-6 py-4">ROUTE (FROM → TO)</th>
              <th class="px-6 py-4">SEATS AVAILABLE</th>
              <th class="px-6 py-4">COST</th>
              <th class="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            
            <tr class="transition-colors hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Elena Rodriguez" class="h-10 w-10 rounded-full bg-gray-200 object-cover">
                  <div>
                    <p class="font-bold text-gray-900">Elena Rodriguez</p>
                    <div class="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                      <svg class="text-yellow-400" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      4.9 (124 trips)
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">Today, 5:15 PM</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-600">HQ Campus</span>
                  <svg class="text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                  <span class="font-medium text-gray-600">Westside Hub</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20">3 Left</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">$2.50</p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <a href="#" class="text-sm font-semibold text-gray-600 hover:text-gray-900">View Details</a>
                  <button class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Request Join</button>
                </div>
              </td>
            </tr>

            <tr class="transition-colors hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=11" alt="David Chen" class="h-10 w-10 rounded-full bg-gray-200 object-cover">
                  <div>
                    <p class="font-bold text-gray-900">David Chen</p>
                    <div class="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                      <svg class="text-yellow-400" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      4.7 (12 trips)
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">Tomorrow, 8:00 AM</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-600">North Hills</span>
                  <svg class="text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                  <span class="font-medium text-gray-600">HQ Campus</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-md bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 ring-1 ring-inset ring-orange-600/20">1 Left</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">$3.00</p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <a href="#" class="text-sm font-semibold text-gray-600 hover:text-gray-900">View Details</a>
                  <button class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Request Join</button>
                </div>
              </td>
            </tr>

            <tr class="transition-colors hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">MJ</div>
                  <div>
                    <p class="font-bold text-gray-900">Marcus Johnson</p>
                    <div class="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                      <svg class="text-yellow-400" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      5.0 (3 trips)
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">Wed, Oct 25, 5:30 PM</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-600">HQ Campus</span>
                  <svg class="text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                  <span class="font-medium text-gray-600">South Station</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20">2 Left</span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">Company Paid</p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3">
                  <a href="#" class="text-sm font-semibold text-gray-600 hover:text-gray-900">View Details</a>
                  <button class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Request Join</button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>

        <div class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
          <p class="text-sm text-gray-500">Showing <span class="font-medium text-gray-900">1-3</span> of <span class="font-medium text-gray-900">12</span> trips</p>
          <div class="flex items-center gap-1">
            <button class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"></path></svg>
            </button>
            <button class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 font-semibold text-blue-600">1</button>
            <button class="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">2</button>
            <button class="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">3</button>
            <button class="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FindRidesPage {
}
