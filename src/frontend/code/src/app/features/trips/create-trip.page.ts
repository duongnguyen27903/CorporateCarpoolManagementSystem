import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-create-trip-page',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <div class="mx-auto max-w-6xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Publish a Ride</h1>
        <p class="mt-1 text-sm text-gray-500">Offer empty seats to colleagues and share commute costs.</p>
      </div>

      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          
          <div class="mb-10 flex items-center justify-between relative">
            <div class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200 z-0"></div>
            <div class="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#2563EB] z-0 transition-all duration-300" [style.width]="(currentStep - 1) * 33.33 + '%'"></div>

            @for (step of steps; track step.id) {
              <div class="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors"
                     [ngClass]="{
                       'border-[#2563EB] bg-[#2563EB] text-white': currentStep >= step.id,
                       'border-gray-300 bg-white text-gray-400': currentStep < step.id
                     }">
                  @if (currentStep > step.id) {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"></path></svg>
                  } @else {
                    {{ step.id }}
                  }
                </div>
                <span class="text-xs font-bold uppercase" [ngClass]="currentStep >= step.id ? 'text-[#2563EB]' : 'text-gray-400'">{{ step.name }}</span>
              </div>
            }
          </div>

          @switch (currentStep) {
            @case (1) {
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">Where are you going?</h2>
                <div class="space-y-6 relative">
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Leaving from</label>
                    <div class="relative">
                      <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                      <input type="text" placeholder="Enter starting address or office location" class="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                    <p class="mt-1 text-xs text-gray-500">Your current location or a specific pickup spot.</p>
                  </div>
                  
                  <div class="absolute left-6 top-[72px] flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm z-10 text-gray-500 hover:text-[#2563EB] cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 11l-5-5-5 5"></path><path d="M17 13l-5 5-5-5"></path></svg>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Going to</label>
                    <div class="relative">
                      <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                      <input type="text" placeholder="Enter destination address or office location" class="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    </div>
                  </div>
                  <button class="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add a stopover (optional)
                  </button>
                </div>
              </div>
            }

            @case (2) {
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">Set your schedule</h2>
                <p class="mb-6 text-sm text-gray-500">When are you planning to drive?</p>
                <div class="space-y-6">
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Departure Time</label>
                    <input type="time" value="08:00" class="h-10 w-40 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Frequency</label>
                    <div class="flex w-fit rounded-lg border border-gray-300 bg-gray-50 p-1">
                      <button class="rounded-md px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-200">One-time trip</button>
                      <button class="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-[#2563EB] shadow-sm">Recurring trip</button>
                    </div>
                  </div>
                  <div class="rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <label class="mb-3 block text-sm font-semibold text-gray-700">Active Days</label>
                    <div class="flex gap-2 mb-6">
                      @for (day of ['M', 'T', 'W', 'T', 'F', 'S', 'S']; track $index) {
                        <button class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors"
                                [ngClass]="$index < 5 ? 'bg-[#2563EB] text-white' : 'border border-gray-300 bg-white text-gray-400'">
                          {{ day }}
                        </button>
                      }
                    </div>
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Duration</label>
                    <select class="h-10 w-64 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>For 1 month</option>
                      <option>For 3 months</option>
                      <option>Ongoing</option>
                    </select>
                  </div>
                  <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                    <div>
                      <p class="text-sm font-semibold text-gray-900">Add a return trip</p>
                      <p class="text-xs text-gray-500">Automatically schedule the drive back</p>
                    </div>
                    <button class="relative inline-flex h-6 w-11 items-center rounded-full bg-[#2563EB]">
                      <span class="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition"></span>
                    </button>
                  </div>
                </div>
              </div>
            }

            @case (3) {
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">Select your vehicle</h2>
                <p class="mb-6 text-sm text-gray-500">Which car will you be driving for this trip?</p>
                <div class="space-y-6">
                  <div>
                    <label class="mb-3 block text-sm font-semibold text-gray-700">Saved Vehicles</label>
                    <div class="space-y-3">
                      <div class="flex cursor-pointer items-center justify-between rounded-lg border-2 border-[#2563EB] bg-blue-50 p-4">
                        <div class="flex items-center gap-4">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                          <div>
                            <p class="font-bold text-gray-900">Toyota Camry</p>
                            <p class="text-xs text-gray-500">White • 4 Seats</p>
                          </div>
                        </div>
                        <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"></path></svg>
                      </div>
                      <div class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50">
                        <div class="flex items-center gap-4">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                          </div>
                          <div>
                            <p class="font-bold text-gray-900">Honda Civic</p>
                            <p class="text-xs text-gray-500">Silver • 4 Seats</p>
                          </div>
                        </div>
                      </div>
                      <button class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-4 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add New Vehicle
                      </button>
                    </div>
                  </div>
                  
                  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                      <label class="text-sm font-semibold text-gray-700">Seat Configuration</label>
                      <span class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">Available Seats: 3</span>
                    </div>
                    <div class="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-6">
                      <p class="text-sm font-bold text-gray-900">Available Seats for this trip</p>
                      <p class="mb-4 text-xs text-gray-500">Excluding the driver's seat</p>
                      <div class="flex items-center gap-6">
                        <button class="flex h-10 w-10 items-center justify-center rounded-full border border-[#2563EB] text-[#2563EB] hover:bg-blue-50">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span class="text-3xl font-extrabold text-gray-900">3</span>
                        <button class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white hover:bg-blue-700">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            @case (4) {
              <div>
                <h2 class="text-xl font-bold text-gray-900 mb-6">Review and Confirm</h2>
                <p class="mb-6 text-sm text-gray-500">Please review your trip details carefully before publishing to the network.</p>
                
                <div class="grid grid-cols-3 gap-4 mb-8">
                  <div class="rounded-lg border border-gray-200 p-4">
                    <div class="flex items-center gap-2 mb-2 text-[#2563EB]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>
                      <span class="text-sm font-bold">Route</span>
                    </div>
                    <p class="text-sm font-bold text-gray-900">San Francisco HQ</p>
                    <p class="text-xs text-gray-500 mb-2">100 Market St, SF</p>
                    <p class="text-sm font-bold text-gray-900">San Jose Campus</p>
                    <p class="text-xs text-gray-500">450 W Santa Clara St, SJ</p>
                  </div>
                  <div class="rounded-lg border border-gray-200 p-4">
                    <div class="flex items-center gap-2 mb-2 text-[#2563EB]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span class="text-sm font-bold">Schedule</span>
                    </div>
                    <p class="text-sm font-bold text-gray-900">Tuesday, Oct 24, 2023</p>
                    <p class="text-xs text-gray-500">Departure: 08:00 AM (PDT)</p>
                    <p class="text-xs text-gray-500 mt-2">Recurring: One-time trip</p>
                  </div>
                  <div class="rounded-lg border border-gray-200 p-4">
                    <div class="flex items-center gap-2 mb-2 text-[#2563EB]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect></svg>
                      <span class="text-sm font-bold">Vehicle</span>
                    </div>
                    <p class="text-sm font-bold text-gray-900">Corporate Shuttle Van</p>
                    <p class="text-xs text-gray-500">Ford Transit • White</p>
                    <p class="text-xs text-gray-500 mt-2">Capacity: 12 Seats available</p>
                  </div>
                </div>

                <div class="space-y-6">
                  <div>
                    <h3 class="flex items-center gap-2 text-lg font-bold text-gray-900 mb-1">
                      <svg class="text-[#2563EB]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      Cost Sharing
                    </h3>
                    <p class="text-sm text-gray-500 mb-4">Choose how costs will be handled for this trip. The company recommends a standard rate of $0.15/mile.</p>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div class="flex cursor-pointer items-center justify-between rounded-lg border-2 border-[#2563EB] bg-blue-50 p-4">
                        <div class="flex items-center gap-3">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                          </div>
                          <div>
                            <p class="font-bold text-gray-900">Free</p>
                            <p class="text-xs text-gray-500">Company Sponsored</p>
                          </div>
                        </div>
                        <div class="h-4 w-4 rounded-full border-4 border-[#2563EB] bg-white"></div>
                      </div>
                      <div class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                        <div class="flex items-center gap-3">
                          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          </div>
                          <div>
                            <p class="font-bold text-gray-900">Shared Cost</p>
                            <p class="text-xs text-gray-500">Split with passengers</p>
                          </div>
                        </div>
                        <div class="h-4 w-4 rounded-full border border-gray-300"></div>
                      </div>
                    </div>

                    <div>
                      <label class="mb-1.5 block text-xs font-bold text-gray-500 uppercase">PRICE PER SEAT ($)</label>
                      <input type="text" value="$ 0.00" disabled class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    </div>
                  </div>

                  <div>
                    <label class="mb-1.5 block text-sm font-semibold text-gray-700">Additional Notes (Optional)</label>
                    <textarea placeholder="Provide specific instructions, pickup location details, or any other important information..." class="h-24 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                  </div>
                </div>
              </div>
            }
          }

          <div class="mt-8 flex items-center border-t border-gray-200 pt-6" [ngClass]="currentStep === 1 ? 'justify-end' : 'justify-between'">
            @if (currentStep > 1) {
              <button (click)="prevStep()" class="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <svg class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back
              </button>
            }
            
            @if (currentStep < 4) {
              <button (click)="nextStep()" class="flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700">
                Continue to {{ steps[currentStep].name }}
                <svg class="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            } @else {
              <button class="flex h-10 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700">
                <svg class="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Complete & Publish Trip
              </button>
            }
          </div>
        </div>

        <div class="col-span-1 space-y-6">
          @if (currentStep === 1) {
            <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div class="border-b border-gray-100 p-4 flex items-center gap-2">
                <svg class="text-[#2563EB]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 14.3-14.3M22 2l-7.2 7.2"></path></svg>
                <h3 class="font-bold text-gray-900">Frequent Routes</h3>
              </div>
              <div class="p-2">
                <div class="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                  <div>
                    <p class="text-sm font-bold text-gray-900">Home → HQ Office</p>
                    <p class="text-xs text-gray-500">Usually departs around 8:00 AM</p>
                  </div>
                  <svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>
                </div>
                <div class="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                  <div>
                    <p class="text-sm font-bold text-gray-900">HQ Office → Home</p>
                    <p class="text-xs text-gray-500">Usually departs around 5:30 PM</p>
                  </div>
                  <svg class="text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"></path></svg>
                </div>
              </div>
            </div>
          }

          <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="border-b border-gray-100 bg-gray-50 p-4 rounded-t-xl">
              <h3 class="font-bold text-gray-900">Trip Summary</h3>
            </div>
            <div class="p-5 space-y-5">
              
              <div>
                <p class="mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">ROUTE</p>
                <div class="relative pl-5">
                  <div class="absolute left-1.5 top-2 h-full w-0.5 bg-gray-200"></div>
                  <div class="mb-4 relative">
                    <div class="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-[#2563EB] bg-white"></div>
                    <p class="text-sm font-bold text-gray-900">San Francisco HQ</p>
                    <p class="text-xs text-gray-500">100 Market St, SF</p>
                  </div>
                  <div class="relative">
                    <div class="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-[#2563EB]"></div>
                    <p class="text-sm font-bold text-gray-900">San Jose Campus</p>
                    <p class="text-xs text-gray-500">450 W Santa Clara St, SJ</p>
                  </div>
                </div>
              </div>

              @if (currentStep >= 2) {
                <div class="border-t border-gray-100 pt-5">
                  <p class="mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">SCHEDULE</p>
                  <div class="flex items-start gap-2">
                    <svg class="text-gray-400 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div>
                      <p class="text-sm font-bold text-gray-900">Oct 24, 2023</p>
                      <p class="text-xs text-gray-500">08:00 AM (PDT)</p>
                    </div>
                  </div>
                </div>
              }

              @if (currentStep >= 3) {
                <div class="border-t border-gray-100 pt-5">
                  <p class="mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">VEHICLE</p>
                  <div class="flex items-start gap-2">
                    <svg class="text-gray-400 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <div>
                      <p class="text-sm font-bold text-gray-900">Corporate Shuttle Van</p>
                      <p class="text-xs text-gray-500">Ford Transit • 12 Seats</p>
                    </div>
                  </div>
                </div>
              }

              @if (currentStep === 4) {
                <div class="border-t border-gray-100 pt-5">
                  <p class="mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">COST</p>
                  <div class="flex items-start gap-2">
                    <svg class="text-gray-400 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                    <div>
                      <p class="text-sm font-bold text-gray-900">Free</p>
                      <p class="text-xs text-gray-500">Company Sponsored</p>
                    </div>
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateTripPage {
  currentStep = 1;

  steps = [
    { id: 1, name: 'Route' },
    { id: 2, name: 'Schedule' },
    { id: 3, name: 'Vehicle' },
    { id: 4, name: 'Preferences' }
  ];

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
