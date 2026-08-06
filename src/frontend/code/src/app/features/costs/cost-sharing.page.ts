import { Component } from '@angular/core';

@Component({
  selector: 'app-cost-sharing-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">Cost Sharing & Wallet</h1>

      <div class="grid grid-cols-3 gap-6">
        
        <div class="col-span-1 space-y-6">
          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-500">TOTAL PAID</p>
              <p class="mt-1 text-3xl font-extrabold text-gray-900">$1,240.00</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </div>
          </div>

          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-500">TOTAL RECEIVED</p>
              <p class="mt-1 text-3xl font-extrabold text-emerald-600">$850.50</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <svg class="text-[#2563EB]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Company Policy
            </h3>
            <div class="space-y-1">
              <a href="#" class="flex items-center justify-between rounded-lg p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <span class="flex items-center gap-3"><svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Commuter Reimbursement Guidelines</span>
                <svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#" class="flex items-center justify-between rounded-lg p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <span class="flex items-center gap-3"><svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> How to Submit a Claim</span>
                <svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </div>

        <div class="col-span-2 space-y-6">
          
          <div class="grid grid-cols-2 gap-6">
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900">Monthly Spending</h3>
                <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">This Month</span>
              </div>
              <div class="relative h-32 w-full flex items-end justify-around pb-6 pt-4">
                <div class="absolute right-0 top-0 h-[1px] w-full bg-gray-100"><span class="absolute -right-1 -top-2 bg-white pl-2 text-[10px] text-gray-400">$100</span></div>
                <div class="absolute right-0 top-[50%] h-[1px] w-full bg-gray-100"><span class="absolute -right-1 -top-2 bg-white pl-2 text-[10px] text-gray-400">$50</span></div>
                
                <div class="w-12 bg-[#2563EB] rounded-t-sm z-10" style="height: 40%;"></div>
                <div class="w-12 bg-[#2563EB] rounded-t-sm z-10" style="height: 90%;"></div>
                <div class="w-12 bg-[#2563EB] rounded-t-sm z-10" style="height: 60%;"></div>
                <div class="w-12 bg-gray-200 rounded-t-sm z-10" style="height: 15%;"></div>
              </div>
              <div class="flex justify-around text-xs font-bold text-gray-400 mt-2">
                <span>W1</span><span>W2</span><span>W3</span><span>W4</span>
              </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-900">CO2 & Cost Saved</h3>
                <svg class="text-emerald-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><path d="M12 6v6l4.25 2.5"></path></svg>
              </div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-500">TOTAL SAVINGS</p>
              <div class="mt-1 flex items-center justify-between">
                <p class="text-3xl font-extrabold text-emerald-600">$128.00</p>
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                </div>
              </div>
              <div class="mt-6">
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div class="h-full bg-emerald-500" style="width: 65%"></div>
                </div>
                <p class="mt-2 text-xs font-semibold text-gray-500">65% of monthly corporate goal achieved.</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div class="flex items-center justify-between border-b border-gray-100 p-5">
              <h3 class="text-base font-bold text-gray-900">Transaction History</h3>
              <a href="#" class="flex items-center gap-1 text-sm font-bold text-[#2563EB] hover:underline">View All <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
            </div>
            
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th class="px-6 py-4">DATE</th>
                  <th class="px-6 py-4">ROLE</th>
                  <th class="px-6 py-4">ROUTE (ORIGIN - DESTINATION)</th>
                  <th class="px-6 py-4">AMOUNT</th>
                  <th class="px-6 py-4">STATUS</th>
                  <th class="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">Oct 24,</p>
                    <p class="text-xs text-gray-500">2023</p>
                  </td>
                  <td class="px-6 py-4"><span class="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600 uppercase">PASSENGER</span></td>
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">Downtown HQ →</p>
                    <p class="text-xs text-gray-500">North Campus</p>
                  </td>
                  <td class="px-6 py-4 font-extrabold text-gray-900">-$12.50</td>
                  <td class="px-6 py-4"><span class="text-xs font-bold text-emerald-600">COMPLETED</span></td>
                  <td class="px-6 py-4 text-gray-400 hover:text-gray-900 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">Oct 20,</p>
                    <p class="text-xs text-gray-500">2023</p>
                  </td>
                  <td class="px-6 py-4"><span class="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600 uppercase">PASSENGER</span></td>
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">North Campus →</p>
                    <p class="text-xs text-gray-500">Downtown HQ</p>
                  </td>
                  <td class="px-6 py-4 font-extrabold text-gray-900">-$8.00</td>
                  <td class="px-6 py-4"><span class="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">PENDING</span></td>
                  <td class="px-6 py-4 text-gray-400 hover:text-gray-900 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">Oct 15,</p>
                    <p class="text-xs text-gray-500">2023</p>
                  </td>
                  <td class="px-6 py-4"><span class="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 uppercase">DRIVER</span></td>
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">Downtown HQ →</p>
                    <p class="text-xs text-gray-500">West Suburb</p>
                  </td>
                  <td class="px-6 py-4 font-extrabold text-emerald-600">+$24.00</td>
                  <td class="px-6 py-4"><span class="text-xs font-bold text-emerald-600">COMPLETED</span></td>
                  <td class="px-6 py-4 text-gray-400 hover:text-gray-900 cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CostSharingPage { }
