import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your upcoming drives and requested rides.</p>
        </div>
        <div class="flex overflow-hidden rounded-lg border border-gray-300">
          <button class="bg-white px-4 py-1.5 text-sm font-bold text-gray-900 shadow-sm">Active</button>
          <button class="bg-gray-50 px-4 py-1.5 text-sm font-bold text-gray-500 hover:bg-gray-100">History</button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        
        <div class="space-y-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
            Trips I'm Driving
          </h2>
          
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="border-b border-gray-100 p-5">
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs font-bold">
                  <span class="rounded bg-blue-100 px-2 py-1 text-[#2563EB]">SCHEDULED</span>
                  <span class="text-gray-500">Oct 24 • 08:30 AM</span>
                </div>
                <div class="flex -space-x-2">
                  <img src="https://i.pravatar.cc/150?img=11" alt="User" class="h-8 w-8 rounded-full border-2 border-white object-cover">
                  <img src="https://i.pravatar.cc/150?img=5" alt="User" class="h-8 w-8 rounded-full border-2 border-white object-cover">
                </div>
              </div>
              <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                Downtown Office <span class="text-gray-400 font-normal">→</span> Tech Park Campus
              </h3>
            </div>
            
            <div class="bg-gray-50 p-5">
              <p class="mb-4 text-sm font-bold text-gray-900">Pending Requests (2)</p>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div class="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Michael Chang" class="h-10 w-10 rounded-full object-cover">
                    <div>
                      <p class="text-sm font-bold text-gray-900">Michael Chang</p>
                      <p class="text-xs text-gray-500">Marketing Dept • Pick up at 4th St.</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Reject
                    </button>
                    <button class="flex items-center gap-1 rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div class="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=5" alt="Sarah Jenkins" class="h-10 w-10 rounded-full object-cover">
                    <div>
                      <p class="text-sm font-bold text-gray-900">Sarah Jenkins</p>
                      <p class="text-xs text-gray-500">Sales • Pick up at Main Transit Hub</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Reject
                    </button>
                    <button class="flex items-center gap-1 rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between border-t border-gray-200 bg-white p-4">
              <p class="flex items-center gap-1.5 text-xs text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Cancellation policy: Please notify passengers 24h prior.
              </p>
              <button class="text-sm font-bold text-red-600 hover:underline">Cancel Trip</button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Trips I'm Joining
          </h2>

          <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="p-5">
              <div class="mb-4 flex items-start justify-between">
                <div>
                  <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                    North Suburbs <span class="text-gray-400 font-normal">→</span> HQ Building
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">Tomorrow • 07:45 AM</p>
                </div>
                <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Approved
                </span>
              </div>
              
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div class="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=12" alt="Driver" class="h-8 w-8 rounded-full object-cover">
                  <div>
                    <p class="text-xs font-bold text-gray-900">Driver: David Miller</p>
                    <p class="text-[10px] text-gray-500">Toyota Prius • Blue • XYZ-1234</p>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-gray-100 p-4">
              <p class="text-xs text-gray-500">Free cancellation until 07:45 PM today</p>
              <button class="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Cancel Request</button>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white shadow-sm opacity-80">
            <div class="p-5">
              <div class="mb-4 flex items-start justify-between">
                <div>
                  <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
                    Train Station <span class="text-gray-400 font-normal">→</span> Factory A
                  </h3>
                  <p class="text-xs text-gray-500 mt-1">Oct 26 • 09:00 AM</p>
                </div>
                <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Pending
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-gray-100 p-4">
              <p class="text-xs text-gray-500">Waiting for driver approval</p>
              <button class="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Withdraw</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class BookingsPage { }
