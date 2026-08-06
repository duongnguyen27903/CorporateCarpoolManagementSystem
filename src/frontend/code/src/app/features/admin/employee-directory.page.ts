import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-directory-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Employee Directory</h1>
          <p class="mt-1 text-sm text-gray-500">Manage active staff, departmental assignments, and carpool eligibility.</p>
        </div>
        <button class="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New Employee
        </button>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        <!-- Filters Toolbar -->
        <div class="flex items-center gap-4 border-b border-gray-200 p-5">
          <div class="flex-1">
            <label class="mb-1.5 block text-xs font-bold text-gray-500">Search Directory</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search by name, ID, or email..." class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>
          </div>
          
          <div class="w-48">
            <label class="mb-1.5 block text-xs font-bold text-gray-500">Department</label>
            <div class="relative">
              <select class="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Operations</option>
                <option>Human Resources</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          
          <div class="w-40">
            <label class="mb-1.5 block text-xs font-bold text-gray-500">Status</label>
            <div class="relative">
              <select class="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div class="pt-5">
            <button class="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              More Filters
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th class="px-6 py-4">EMPLOYEE NAME</th>
                <th class="px-6 py-4">EMPLOYEE ID</th>
                <th class="px-6 py-4">DEPARTMENT</th>
                <th class="px-6 py-4">CARPOOL ROLE</th>
                <th class="px-6 py-4 text-center">TOTAL TRIPS</th>
                <th class="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              
              <!-- Row 1 -->
              <tr class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=5" alt="Sarah Jenkins" class="h-10 w-10 rounded-full object-cover">
                    <div>
                      <p class="font-bold text-gray-900">Sarah Jenkins</p>
                      <p class="text-xs text-gray-500">s.jenkins&#64;corp.com</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600 font-medium">EMP-8492</td>
                <td class="px-6 py-4 text-gray-900 font-medium">Engineering</td>
                <td class="px-6 py-4">
                  <span class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Driver</span>
                </td>
                <td class="px-6 py-4 text-center text-gray-900 font-bold">142</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 text-gray-400">
                    <button class="hover:text-[#2563EB]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                    <button class="hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                  </div>
                </td>
              </tr>

              <!-- Row 2 -->
              <tr class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">MJ</div>
                    <div>
                      <p class="font-bold text-gray-900">Marcus Johnson</p>
                      <p class="text-xs text-gray-500">m.johnson&#64;corp.com</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600 font-medium">EMP-9104</td>
                <td class="px-6 py-4 text-gray-900 font-medium">Operations</td>
                <td class="px-6 py-4">
                  <span class="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">Passenger</span>
                </td>
                <td class="px-6 py-4 text-center text-gray-900 font-bold">87</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 text-gray-400">
                    <button class="hover:text-[#2563EB]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                    <button class="hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                  </div>
                </td>
              </tr>

              <!-- Row 3 -->
              <tr class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=11" alt="David Chen" class="h-10 w-10 rounded-full object-cover">
                    <div>
                      <p class="font-bold text-gray-900">David Chen</p>
                      <p class="text-xs text-gray-500">d.chen&#64;corp.com</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600 font-medium">EMP-7233</td>
                <td class="px-6 py-4 text-gray-900 font-medium">Human Resources</td>
                <td class="px-6 py-4">
                  <span class="inline-flex rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">Both</span>
                </td>
                <td class="px-6 py-4 text-center text-gray-900 font-bold">215</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 text-gray-400">
                    <button class="hover:text-[#2563EB]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                    <button class="hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                  </div>
                </td>
              </tr>

              <!-- Row 4 -->
              <tr class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">AL</div>
                    <div>
                      <p class="font-bold text-gray-900">Amanda Lee</p>
                      <p class="text-xs text-gray-500">a.lee&#64;corp.com</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600 font-medium">EMP-9821</td>
                <td class="px-6 py-4 text-gray-900 font-medium">Engineering</td>
                <td class="px-6 py-4">
                  <span class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Driver</span>
                </td>
                <td class="px-6 py-4 text-center text-gray-900 font-bold">45</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 text-gray-400">
                    <button class="hover:text-[#2563EB]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>
                    <button class="hover:text-gray-900"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between border-t border-gray-200 p-5">
          <p class="text-sm font-medium text-gray-500">Showing <span class="font-bold text-gray-900">1</span> to <span class="font-bold text-gray-900">10</span> of <span class="font-bold text-gray-900">248</span> employees</p>
          <div class="flex gap-1">
            <button class="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-100"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
            <button class="flex h-8 w-8 items-center justify-center rounded bg-[#2563EB] text-sm font-bold text-white">1</button>
            <button class="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-600 hover:bg-gray-100">2</button>
            <button class="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-600 hover:bg-gray-100">3</button>
            <span class="flex h-8 w-8 items-center justify-center text-gray-400">...</span>
            <button class="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-600 hover:bg-gray-100">25</button>
            <button class="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-100"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class EmployeeDirectoryPage { }
