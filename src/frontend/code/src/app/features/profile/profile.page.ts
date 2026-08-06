import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  template: `
    <div class="mx-auto max-w-4xl space-y-6">
      
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="h-32 bg-[#2563EB] bg-opacity-80 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div class="relative px-8 pb-6">
          <div class="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
            <img src="https://i.pravatar.cc/150?img=11" alt="Alex Mercer" class="h-full w-full object-cover">
          </div>
          
          <div class="ml-28 flex items-start justify-between pt-3">
            <div>
              <h1 class="text-2xl font-extrabold text-gray-900">Alex Mercer</h1>
              <p class="mt-1 text-sm font-medium text-gray-500 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                EMP-ID: 8942-A <span class="text-gray-300">•</span> Senior Systems Analyst
              </p>
            </div>
            <button class="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-sm">Edit Profile</button>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Personal Information
          </h2>
          <button class="text-[#2563EB] hover:text-blue-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
        </div>
        
        <div class="grid grid-cols-2 gap-y-6 text-sm">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">FULL NAME</p>
            <p class="font-semibold text-gray-900">Alex James Mercer</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">DEPARTMENT</p>
            <p class="font-semibold text-gray-900">Information Technology</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">OFFICE LOCATION</p>
            <p class="font-semibold text-gray-900">Building C, Floor 4</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">JOIN DATE</p>
            <p class="font-semibold text-gray-900">March 15, 2021</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">ROLE</p>
            <p class="font-semibold text-gray-900">Senior Systems Analyst</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Contact Details
          </h2>
          <button class="text-[#2563EB] hover:text-blue-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">CORPORATE EMAIL</p>
              <p class="text-sm font-semibold text-gray-900">a.mercer&#64;company.com</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg></div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">MOBILE NUMBER</p>
              <p class="text-sm font-semibold text-gray-900">+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">HOME ADDRESS</p>
              <p class="text-sm font-semibold text-gray-900">742 Evergreen Terrace, Springfield</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Account Security
        </h2>
        <div class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
            <div>
              <p class="text-sm font-bold text-gray-900">Password</p>
              <p class="text-xs text-gray-500">Last changed: 3 months ago</p>
            </div>
          </div>
          <button class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-[#2563EB] hover:bg-gray-50">Change Password</button>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm relative overflow-hidden">
        <div class="absolute right-0 top-0 bg-emerald-50 px-4 py-2 rounded-bl-xl border-b border-l border-emerald-100">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> VERIFIED DRIVER</span>
        </div>
        
        <div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Vehicle Details
          </h2>
          <button class="text-[#2563EB] hover:text-blue-700 mr-32"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
        </div>
        
        <div class="grid grid-cols-4 gap-4 text-sm mb-6">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">MAKE</p>
            <p class="font-semibold text-gray-900">Toyota</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">MODEL</p>
            <p class="font-semibold text-gray-900">Camry Hybrid</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">COLOR</p>
            <p class="font-semibold text-gray-900">Silver</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">LICENSE PLATE</p>
            <p class="font-bold text-gray-900">ABC-1234</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">NUMBER OF SEATS</p>
            <p class="font-semibold text-gray-900">5 Seats</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Vehicle insurance and registration are up to date. Next renewal: Oct 2024.
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900">
            <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Frequent Routes
          </h2>
          <button class="text-[#2563EB] hover:text-blue-700"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></button>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
            <p class="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Home <span class="text-gray-400">→</span> Downtown HQ
            </p>
            <button class="text-gray-400 hover:text-[#2563EB]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
            <p class="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              San Jose Campus <span class="text-gray-400">→</span> North Office
            </p>
            <button class="text-gray-400 hover:text-[#2563EB]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ProfilePage { }
