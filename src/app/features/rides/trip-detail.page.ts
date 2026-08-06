import { Component } from '@angular/core';

@Component({
  selector: 'app-trip-detail-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-5xl">
      <div class="mb-6">
        <a href="#" class="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          BACK TO SEARCH RESULTS
        </a>
        <h1 class="text-3xl font-extrabold text-gray-900">Downtown Office to North Campus</h1>
        <div class="mt-2 flex items-center gap-4 text-sm font-semibold text-gray-600">
          <span class="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Oct 24, 2023</span>
          <span class="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 08:30 AM (Est. 45 mins)</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- Main Content Column -->
        <div class="col-span-2 space-y-6">
          
          <!-- Map Section (Placeholder) -->
          <div class="relative h-64 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
             <div class="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco,CA&zoom=13&size=800x400&maptype=roadmap')] bg-cover bg-center"></div>
             
             <!-- Overlay Info -->
             <div class="absolute left-4 top-4 w-72 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                <div class="relative pl-5">
                  <div class="absolute left-1.5 top-2 h-full w-0.5 bg-gray-200"></div>
                  <div class="mb-4 relative">
                    <div class="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-[#2563EB] bg-white"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase">PICKUP</p>
                    <p class="text-sm font-bold text-gray-900">Downtown HQ, Main Lobby</p>
                  </div>
                  <div class="relative">
                    <div class="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase">DROP-OFF</p>
                    <p class="text-sm font-bold text-gray-900">North Campus, Bldg 4</p>
                  </div>
                </div>
             </div>
          </div>

          <!-- Driver & Vehicle Grid -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Driver Info -->
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p class="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">YOUR DRIVER</p>
              <div class="flex items-start gap-4">
                <img src="https://i.pravatar.cc/150?img=5" alt="Sarah Jenkins" class="h-14 w-14 rounded-full object-cover shadow-sm">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Sarah Jenkins</h3>
                  <p class="text-xs font-medium text-gray-500">Senior Marketing Manager</p>
                  <div class="mt-1.5 flex items-center gap-1 text-[13px] font-bold text-gray-700">
                    <svg class="text-[#2563EB]" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    4.9 <span class="font-medium text-gray-500">(42 trips)</span>
                  </div>
                </div>
              </div>
              <div class="mt-5 flex flex-wrap gap-2">
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Safe Driver</span>
                <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Punctual</span>
                <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> Likes Podcasts</span>
              </div>
            </div>

            <!-- Vehicle Info -->
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p class="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">VEHICLE DETAILS</p>
              <div class="flex items-center gap-4 mb-5">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div>
                  <h3 class="text-base font-bold text-gray-900">Tesla Model 3</h3>
                  <p class="text-xs font-medium text-gray-500">Midnight Silver Metallic</p>
                </div>
              </div>
              <div class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5">
                <span class="text-sm font-semibold text-gray-500">License Plate</span>
                <span class="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-bold text-gray-900 tracking-wider">XYZ-9876</span>
              </div>
            </div>
          </div>

          <!-- Passengers Section -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-lg font-bold text-gray-900">Passengers</h3>
              <span class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">2 / 3 Seats Filled</span>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=11" alt="David Chen" class="h-10 w-10 rounded-full object-cover">
                  <div>
                    <p class="text-sm font-bold text-gray-900">David Chen</p>
                    <p class="text-xs font-medium text-gray-500">Engineering Dept.</p>
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">CO-WORKER</span>
              </div>
              <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Elena Rodriguez" class="h-10 w-10 rounded-full object-cover">
                  <div>
                    <p class="text-sm font-bold text-gray-900">Elena Rodriguez</p>
                    <p class="text-xs font-medium text-gray-500">HR Business Partner</p>
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">CO-WORKER</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar (Booking Summary) -->
        <div class="col-span-1 space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 class="mb-5 text-lg font-bold text-gray-900">Booking Summary</h3>
            
            <div class="mb-5 space-y-3 border-b border-gray-200 pb-5 text-sm">
              <div class="flex justify-between font-semibold text-gray-600">
                <span>Base Fare Share</span>
                <span class="text-gray-900">$4.50</span>
              </div>
              <div class="flex justify-between font-semibold text-gray-600">
                <span>Tolls (Estimated)</span>
                <span class="text-gray-900">$1.20</span>
              </div>
            </div>
            
            <div class="mb-2 flex items-end justify-between">
              <span class="font-bold text-gray-900">Estimated Cost</span>
              <span class="text-2xl font-black text-[#2563EB]">$5.70</span>
            </div>
            <p class="mb-6 text-center text-xs font-semibold text-gray-500">Deducted from mobility allowance</p>

            <button class="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 shadow-md shadow-blue-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Request Seat
            </button>
            <button class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Message Driver
            </button>
          </div>

          <div class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <svg class="text-[#2563EB] shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <div>
              <h4 class="text-sm font-bold text-gray-900">Corporate Protected</h4>
              <p class="mt-1 text-xs text-gray-600 leading-relaxed">This ride is restricted to verified employees. Your mobility allowance is automatically managed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TripDetailPage {
}
