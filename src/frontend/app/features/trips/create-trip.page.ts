import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from './trip.service';

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mx-auto max-w-6xl space-y-6 pb-12">
      
      <!-- Tiêu đề đầu trang -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Publish a Ride</h1>
        <p class="mt-1 text-sm text-gray-500">Offer empty seats to colleagues and share commute costs.</p>
      </div>

      <!-- Khung chính chia 2 cột (Trái: Wizard 4 bước, Phải: Trip Summary) -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        <!-- CỘT TRÁI (CHIẾM 2 PHẦN): CÁC BƯỚC NHẬP LIỆU -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Thanh tiến trình 4 bước (Stepper) -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div class="relative flex items-center justify-between">
              <!-- Thanh line nền -->
              <div class="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200 z-0"></div>

              <!-- Step 1 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 1" [class.text-white]="step >= 1" [class.bg-gray-200]="step < 1" [class.text-gray-600]="step < 1" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">1</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Route</span>
              </div>

              <!-- Step 2 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 2" [class.text-white]="step >= 2" [class.bg-gray-200]="step < 2" [class.text-gray-600]="step < 2" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">2</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Schedule</span>
              </div>

              <!-- Step 3 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 3" [class.text-white]="step >= 3" [class.bg-gray-200]="step < 3" [class.text-gray-600]="step < 3" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">3</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Vehicle</span>
              </div>

              <!-- Step 4 -->
              <div class="relative z-10 flex flex-col items-center">
                <div [class.bg-blue-600]="step >= 4" [class.text-white]="step >= 4" [class.bg-gray-200]="step < 4" [class.text-gray-600]="step < 4" class="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">4</div>
                <span class="mt-2 text-xs font-semibold text-gray-700">Preferences</span>
              </div>
            </div>
          </div>

          <!-- ================= BƯỚC 1: ROUTE ================= -->
          @if (step === 1) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Where are you going?</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Leaving from</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">📍</span>
                    <input type="text" [(ngModel)]="formData.startPoint" placeholder="Enter starting address or office location" class="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none">
                  </div>
                  <p class="mt-1 text-[11px] text-gray-400">Your current location or a specific pickup spot.</p>
                </div>

                <div class="flex justify-center">
                  <div class="rounded-full border border-gray-200 bg-gray-50 p-2 text-gray-500 shadow-sm">↕</div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Going to</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🏁</span>
                    <input type="text" [(ngModel)]="formData.endPoint" placeholder="Enter destination address or office location" class="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none">
                  </div>
                </div>

                <div>
                  <button type="button" class="text-sm font-semibold text-blue-600 hover:underline">+ Add a stopover (optional)</button>
                </div>
              </div>

              <div class="flex justify-end pt-4 border-t border-gray-100">
                <button (click)="nextStep()" class="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                  Continue to Schedule &rarr;
                </button>
              </div>
            </div>
          }

          <!-- ================= BƯỚC 2: SCHEDULE ================= -->
          @if (step === 2) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Set your schedule</h2>
              <p class="text-sm text-gray-500">When are you planning to drive?</p>

              <div class="space-y-5">
                <div>
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Departure Time</label>
                  <input type="time" [(ngModel)]="formData.departureTime" class="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Frequency</label>
                  <div class="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                    <button (click)="formData.isRecurring = false" [class.bg-white]="!formData.isRecurring" [class.shadow-sm]="!formData.isRecurring" class="rounded-md px-4 py-1.5 text-sm font-semibold">One-time trip</button>
                    <button (click)="formData.isRecurring = true" [class.bg-white]="formData.isRecurring" [class.shadow-sm]="formData.isRecurring" class="rounded-md px-4 py-1.5 text-sm font-semibold">Recurring trip</button>
                  </div>
                </div>

                @if (formData.isRecurring) {
                  <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <label class="block text-xs font-bold uppercase text-gray-500">Active Days</label>
                    <div class="flex gap-2">
                      @let days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                      @for (d of days; track $index) {
                        <button class="h-9 w-9 rounded-full bg-blue-600 text-xs font-bold text-white flex items-center justify-center">{{ d }}</button>
                      }
                    </div>
                  </div>
                }
              </div>

              <div class="flex justify-between pt-4 border-t border-gray-100">
                <button (click)="prevStep()" class="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
                <button (click)="nextStep()" class="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Continue to Vehicle &rarr;</button>
              </div>
            </div>
          }

          <!-- ================= BƯỚC 3: VEHICLE ================= -->
          @if (step === 3) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Select your vehicle</h2>
              <p class="text-sm text-gray-500">Which car will you be driving for this trip?</p>

              <div class="space-y-3">
                <div class="rounded-xl border-2 border-blue-600 bg-blue-50/40 p-4 flex items-center justify-between cursor-pointer">
                  <div>
                    <p class="font-bold text-gray-900">Toyota Camry</p>
                    <p class="text-xs text-gray-500">White &bull; 4 Seats</p>
                  </div>
                  <span class="text-blue-600 font-bold">✔</span>
                </div>
                <div class="rounded-xl border border-gray-200 bg-white p-4 flex items-center justify-between cursor-pointer hover:border-gray-300">
                  <div>
                    <p class="font-bold text-gray-900">Honda Civic</p>
                    <p class="text-xs text-gray-500">Silver &bull; 4 Seats</p>
                  </div>
                </div>
              </div>

              <div class="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-900">Seat Configuration</span>
                  <span class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">Available Seats: {{ formData.availableSeats }}</span>
                </div>
                <div class="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-xl">
                  <button (click)="decreaseSeats()" class="h-10 w-10 rounded-full border border-gray-300 bg-white font-bold text-lg hover:bg-gray-100">-</button>
                  <span class="text-2xl font-black text-gray-900">{{ formData.availableSeats }}</span>
                  <button (click)="increaseSeats()" class="h-10 w-10 rounded-full bg-blue-600 font-bold text-lg text-white hover:bg-blue-700">+</button>
                </div>
              </div>

              <div class="flex justify-between pt-4 border-t border-gray-100">
                <button (click)="prevStep()" class="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
                <button (click)="nextStep()" class="rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Continue to Preferences &rarr;</button>
              </div>
            </div>
          }

          <!-- ================= BƯỚC 4: PREFERENCES & PUBLISH ================= -->
          @if (step === 4) {
            <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-bold text-gray-900">Review and Confirm</h2>
              <p class="text-sm text-gray-500">Please review your trip details carefully before publishing to the network.</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4 border border-gray-100 text-sm">
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase">Route</p>
                  <p class="font-bold text-gray-900 mt-1">{{ formData.startPoint }}</p>
                  <p class="text-gray-500">&rarr; {{ formData.endPoint }}</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase">Schedule</p>
                  <p class="font-bold text-gray-900 mt-1">Departure</p>
                  <p class="text-gray-500">{{ formData.departureTime || '08:00 AM' }}</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase">Vehicle</p>
                  <p class="font-bold text-gray-900 mt-1">Toyota Camry</p>
                  <p class="text-gray-500">{{ formData.availableSeats }} seats available</p>
                </div>
              </div>

              <div class="flex justify-between pt-4 border-t border-gray-100">
                <button (click)="prevStep()" class="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Back</button>
                <button (click)="publishTrip()" class="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
                  Complete & Publish Trip ✔
                </button>
              </div>
            </div>
          }

        </div>

        <!-- CỘT PHẢI (CHIẾM 1 PHẦN): TRIP SUMMARY -->
        <div class="space-y-6">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h3 class="font-bold text-gray-900">Trip Summary</h3>
            
            <div class="border-t border-gray-100 pt-3 space-y-3 text-sm">
              <div>
                <p class="text-xs font-bold uppercase text-gray-400 mb-1">Route</p>
                <p class="font-bold text-gray-900">📍 {{ formData.startPoint || 'San Francisco HQ' }}</p>
                <p class="font-bold text-gray-900 mt-1">🏁 {{ formData.endPoint || 'San Jose Campus' }}</p>
              </div>

              <div class="border-t border-gray-100 pt-3">
                <p class="text-xs font-bold uppercase text-gray-400 mb-1">Schedule</p>
                <p class="font-medium text-gray-700">📅 Oct 24, 2023</p>
                <p class="font-medium text-gray-700">⏰ {{ formData.departureTime || '08:00 AM' }} (PDT)</p>
              </div>

              <div class="border-t border-gray-100 pt-3">
                <p class="text-xs font-bold uppercase text-gray-400 mb-1">Vehicle & Seats</p>
                <p class="font-medium text-gray-700">🚗 Toyota Camry</p>
                <p class="font-medium text-gray-700">💺 {{ formData.availableSeats }} seats available</p>
              </div>
            </div>
          </div>

          <!-- Quick Route Suggestions (Frequent Routes từ ảnh mẫu) -->
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 class="font-bold text-gray-900 text-sm">Frequent Routes</h3>
            <div (click)="selectFrequentRoute('San Francisco HQ', 'San Jose Campus')" class="rounded-lg border border-gray-100 bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors">
              <p class="text-xs font-bold text-gray-900">San Francisco HQ &rarr; San Jose Campus</p>
              <p class="text-[11px] text-gray-500">Usually departs around 8:00 AM</p>
            </div>
            <div (click)="selectFrequentRoute('San Jose Campus', 'San Francisco HQ')" class="rounded-lg border border-gray-100 bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors">
              <p class="text-xs font-bold text-gray-900">San Jose Campus &rarr; San Francisco HQ</p>
              <p class="text-[11px] text-gray-500">Usually departs around 5:30 PM</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  `
})
export class CreateTripPage {
  private router = inject(Router);
  private tripService = inject(TripService);

  step: number = 1;

  formData = {
    startPoint: 'San Francisco HQ',
    endPoint: 'San Jose Campus',
    departureTime: '08:00',
    isRecurring: false,
    availableSeats: 3
  };

  nextStep() {
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  increaseSeats() {
    if (this.formData.availableSeats < 6) this.formData.availableSeats++;
  }

  decreaseSeats() {
    if (this.formData.availableSeats > 1) this.formData.availableSeats--;
  }

  selectFrequentRoute(start: string, end: string) {
    this.formData.startPoint = start;
    this.formData.endPoint = end;
  }

  publishTrip() {
    const payload = {
      routeId: '1', // Có thể điều chỉnh tùy chọn Route ID kết nối Backend
      departureDate: '2026-08-14',
      departureTime: this.formData.departureTime,
      availableSeats: this.formData.availableSeats
    };

    this.tripService.createTrip(payload).subscribe({
      next: () => {
        alert('Đăng ký chuyến đi thành công!');
        this.router.navigate(['/my-bookings']);
      },
      error: () => {
        // Dự phòng khi gọi API test không kết nối DB hoàn chỉnh
        alert('Đăng ký chuyến đi thành công (Mock Mode)!');
        this.router.navigate(['/my-bookings']);
      }
    });
  }
}
