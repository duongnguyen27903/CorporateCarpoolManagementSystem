import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-5xl">
      
      <div class="mb-6 flex items-end justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Notifications</h1>
          <p class="mt-1 text-sm text-gray-500">Stay updated on your upcoming trips and account activity.</p>
        </div>
        <button class="flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Mark all as read
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-8 flex gap-2 border-b border-gray-200 pb-4">
        <button class="rounded-full bg-[#2563EB] px-4 py-1.5 text-sm font-bold text-white">All</button>
        <button class="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50">Trips</button>
        <button class="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50">Payments</button>
        <button class="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50">System</button>
      </div>

      <div class="space-y-8">
        <!-- TODAY Section -->
        <div>
          <h2 class="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">TODAY</h2>
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            
            <!-- Notification Item 1 (Unread/Actionable) -->
            <div class="relative flex items-start gap-4 border-b border-gray-100 p-5 bg-blue-50/30">
              <div class="absolute left-0 top-0 h-full w-1 bg-[#2563EB]"></div>
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-base font-bold text-gray-900">Trip request approved</h3>
                  <span class="text-xs font-bold text-[#2563EB]">2m ago</span>
                </div>
                <p class="mt-1 text-sm font-medium text-gray-600">Your request for the 9:00 AM trip to Downtown Corporate Office has been approved by driver <span class="font-bold text-gray-900">Sarah Jenkins</span>.</p>
                <div class="mt-3 flex gap-3">
                  <button class="rounded-lg bg-[#2563EB] px-4 py-1.5 text-sm font-bold text-white hover:bg-blue-700 shadow-sm">Confirm Ride</button>
                  <button class="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50">View Details</button>
                </div>
              </div>
            </div>

            <!-- Notification Item 2 (Message) -->
            <div class="relative flex items-start gap-4 border-b border-gray-100 p-5 bg-blue-50/30">
              <div class="absolute left-0 top-0 h-full w-1 bg-[#2563EB]"></div>
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-base font-bold text-gray-900">New message from Driver</h3>
                  <span class="text-xs font-bold text-[#2563EB]">15m ago</span>
                </div>
                <p class="mt-1 text-sm font-medium text-gray-900"><span class="font-bold">Sarah J:</span> "I'll be parking near the East Entrance. See you soon!"</p>
              </div>
            </div>

            <!-- Notification Item 3 (Alert) -->
            <div class="flex items-start gap-4 p-5">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-base font-bold text-gray-900">Trip starting in 30 mins</h3>
                  <span class="text-xs font-semibold text-gray-400">45m ago</span>
                </div>
                <p class="mt-1 text-sm font-medium text-gray-600">Get ready! Your scheduled carpool to Tech Park Campus is departing soon.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- YESTERDAY Section -->
        <div>
          <h2 class="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">YESTERDAY</h2>
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm opacity-75">
            
            <!-- Notification Item 4 (Payment) -->
            <div class="flex items-start gap-4 border-b border-gray-100 p-5">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-base font-bold text-gray-900">Cost sharing processed</h3>
                  <span class="text-xs font-semibold text-gray-400">Yesterday, 4:30 PM</span>
                </div>
                <p class="mt-1 text-sm font-medium text-gray-600">$4.50 has been automatically deducted from your wallet for the trip with Michael Chen.</p>
              </div>
            </div>

            <!-- Notification Item 5 (System) -->
            <div class="flex items-start gap-4 p-5">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="text-base font-bold text-gray-900">Policy Update</h3>
                  <span class="text-xs font-semibold text-gray-400">Yesterday, 9:00 AM</span>
                </div>
                <p class="mt-1 text-sm font-medium text-gray-600 mb-2">The corporate mobility guidelines have been updated regarding remote work travel allowances. Please review the changes.</p>
                <button class="text-sm font-bold text-[#2563EB] hover:underline">Read Policy</button>
              </div>
            </div>
            
          </div>
        </div>

        <div class="text-center pt-2">
          <button class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>
            Load older notifications
          </button>
        </div>
      </div>

    </div>
  `
})
export class NotificationsPage {
}
