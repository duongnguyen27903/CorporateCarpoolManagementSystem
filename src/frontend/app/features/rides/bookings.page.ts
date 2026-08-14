import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  forkJoin,
  Observable,
  of
} from 'rxjs';

import {
  catchError,
  finalize,
  map,
  switchMap
} from 'rxjs/operators';

import {
  BookingService,
  BookingResponse,
  TripResponse,
  RouteResponse,
  ZoneResponse
} from '../../../src/app/services/booking.service';


// ============================================================
// VIEW MODEL
// ============================================================

interface BookingViewModel extends BookingResponse {

  trip?: TripResponse;

  route?: RouteResponse;

  startZone?: ZoneResponse;

  endZone?: ZoneResponse;

}


// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  imports: [
    CommonModule
  ],

  template: `

    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">


      <!-- ==================================================== -->
      <!-- HEADER -->
      <!-- ==================================================== -->

      <div
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 class="text-2xl font-bold text-gray-900">
            My Bookings
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            View and manage your carpool bookings.
          </p>

        </div>


        <button
          type="button"
          (click)="loadBookings()"
          [disabled]="loading"

          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">

          <span *ngIf="!loading">
            Refresh
          </span>

          <span *ngIf="loading">
            Loading...
          </span>

        </button>

      </div>


      <!-- ==================================================== -->
      <!-- ERROR -->
      <!-- ==================================================== -->

      <div
        *ngIf="!loading && errorMessage"

        class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

        <div class="flex items-start justify-between gap-4">

          <div>

            <p class="font-bold text-red-700">
              Unable to load bookings
            </p>

            <p class="mt-1 text-sm text-red-600">
              {{ errorMessage }}
            </p>

          </div>


          <button
            type="button"
            (click)="loadBookings()"

            class="text-sm font-semibold text-red-700 hover:underline">

            Retry

          </button>

        </div>

      </div>


      <!-- ==================================================== -->
      <!-- LOADING -->
      <!-- ==================================================== -->

      <div
        *ngIf="loading"

        class="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

        <div
          class="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600">
        </div>

        <p class="text-sm font-medium text-gray-600">
          Loading your bookings...
        </p>

      </div>


      <!-- ==================================================== -->
      <!-- CONTENT -->
      <!-- ==================================================== -->

      <div
        *ngIf="!loading && !errorMessage">


        <!-- ================================================== -->
        <!-- EMPTY -->
        <!-- ================================================== -->

        <div
          *ngIf="bookings.length === 0"

          class="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">

              <path
                d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2">
              </path>

              <circle
                cx="9"
                cy="7"
                r="4">
              </circle>

              <path
                d="M23 21v-2a4 4 0 0 0-3-3.87">
              </path>

              <path
                d="M16 3.13a4 4 0 0 1 0 7.75">
              </path>

            </svg>

          </div>


          <h2 class="text-lg font-bold text-gray-900">
            No bookings found
          </h2>


          <p class="mt-1 text-sm text-gray-500">
            You haven't booked any trips yet.
          </p>

        </div>


        <!-- ================================================== -->
        <!-- BOOKING LIST -->
        <!-- ================================================== -->

        <div
          *ngFor="let booking of bookings; trackBy: trackByBookingId"

          class="mb-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">


          <!-- ================================================ -->
          <!-- TOP -->
          <!-- ================================================ -->

          <div class="p-5">


            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">


              <!-- Booking ID + Route -->

              <div class="min-w-0">

                <div
                  class="mb-2 flex flex-wrap items-center gap-2">

                  <span
                    class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">

                    BOOKING #{{ booking.bookingId }}

                  </span>


                  <span class="text-xs text-gray-400">

                    Trip #{{ booking.tripId }}

                  </span>

                </div>


                <!-- Route -->

                <div
                  *ngIf="booking.startZone && booking.endZone"
                  class="flex flex-wrap items-center gap-2">

                  <h2
                    class="text-xl font-bold text-gray-900">

                    {{ booking.startZone.zoneName }}

                  </h2>


                  <svg
                    class="shrink-0 text-blue-500"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">

                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12">
                    </line>

                    <polyline
                      points="12 5 19 12 12 19">
                    </polyline>

                  </svg>


                  <h2
                    class="text-xl font-bold text-gray-900">

                    {{ booking.endZone.zoneName }}

                  </h2>

                </div>


                <!-- Fallback -->

                <div
                  *ngIf="!booking.startZone || !booking.endZone">

                  <h2 class="text-xl font-bold text-gray-900">
                    Route #{{ booking.route?.routeId ?? '-' }}
                  </h2>

                </div>

              </div>


              <!-- Status -->

              <span
                class="self-start rounded-full px-3 py-1.5 text-xs font-bold"
                [ngClass]="getStatusClass(booking.status)">

                {{ getStatusLabel(booking.status) }}

              </span>

            </div>


            <!-- ============================================== -->
            <!-- TRIP INFORMATION -->
            <!-- ============================================== -->

            <div
              class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">


              <!-- Departure -->

              <div
                class="rounded-lg bg-gray-50 p-4">

                <p
                  class="text-[11px] font-bold uppercase tracking-wide text-gray-400">

                  Departure

                </p>


                <p
                  *ngIf="booking.trip"
                  class="mt-1 text-sm font-bold text-gray-800">

                  {{ formatDateTime(booking.trip.departureTime) }}

                </p>


                <p
                  *ngIf="!booking.trip"
                  class="mt-1 text-sm text-gray-400">

                  -

                </p>

              </div>


              <!-- Driver -->

              <div
                class="rounded-lg bg-gray-50 p-4">

                <p
                  class="text-[11px] font-bold uppercase tracking-wide text-gray-400">

                  Driver

                </p>


                <p
                  *ngIf="booking.trip"
                  class="mt-1 text-sm font-bold text-gray-800">

                  Employee #{{ booking.trip.driverId }}

                </p>


                <p
                  *ngIf="!booking.trip"
                  class="mt-1 text-sm text-gray-400">

                  -

                </p>

              </div>


              <!-- Vehicle -->

              <div
                class="rounded-lg bg-gray-50 p-4">

                <p
                  class="text-[11px] font-bold uppercase tracking-wide text-gray-400">

                  Vehicle

                </p>


                <p
                  *ngIf="booking.trip"
                  class="mt-1 text-sm font-bold text-gray-800">

                  Vehicle #{{ booking.trip.vehicleId }}

                </p>


                <p
                  *ngIf="!booking.trip"
                  class="mt-1 text-sm text-gray-400">

                  -

                </p>

              </div>


              <!-- Available seats -->

              <div
                class="rounded-lg bg-gray-50 p-4">

                <p
                  class="text-[11px] font-bold uppercase tracking-wide text-gray-400">

                  Available seats

                </p>


                <p
                  *ngIf="booking.trip"
                  class="mt-1 text-sm font-bold text-gray-800">

                  {{ booking.trip.availableSeats }}

                </p>


                <p
                  *ngIf="!booking.trip"
                  class="mt-1 text-sm text-gray-400">

                  -

                </p>

              </div>

            </div>


            <!-- ============================================== -->
            <!-- ROUTE SCHEDULE -->
            <!-- ============================================== -->

            <div
              *ngIf="booking.route"
              class="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-4">


              <div
                class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">


                <div>

                  <p
                    class="text-[11px] font-bold uppercase tracking-wide text-blue-500">

                    Route schedule

                  </p>


                  <p
                    class="mt-1 text-sm font-semibold text-blue-900">

                    {{ formatTime(booking.route.startTime) }}

                  </p>

                </div>


                <div>

                  <p
                    class="text-[11px] font-bold uppercase tracking-wide text-blue-500">

                    Days

                  </p>


                  <p
                    class="mt-1 text-sm font-semibold text-blue-900">

                    {{ formatDaysOfWeek(booking.route.daysOfWeek) }}

                  </p>

                </div>


                <div>

                  <p
                    class="text-[11px] font-bold uppercase tracking-wide text-blue-500">

                    Route status

                  </p>


                  <p
                    class="mt-1 text-sm font-semibold"
                    [ngClass]="booking.route.isActive
                      ? 'text-green-700'
                      : 'text-gray-500'">

                    {{ booking.route.isActive ? 'Active' : 'Inactive' }}

                  </p>

                </div>

              </div>

            </div>


            <!-- ============================================== -->
            <!-- CHECK IN -->
            <!-- ============================================== -->

            <div
              *ngIf="booking.checkInTime"
              class="mt-3 rounded-lg border border-green-200 bg-green-50 p-4">

              <p
                class="text-[11px] font-bold uppercase tracking-wide text-green-600">

                Check-in time

              </p>


              <p
                class="mt-1 text-sm font-bold text-green-800">

                {{ formatDateTime(booking.checkInTime) }}

              </p>

            </div>


            <!-- ============================================== -->
            <!-- CANCEL REASON -->
            <!-- ============================================== -->

            <div
              *ngIf="booking.cancelReason"
              class="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">

              <p
                class="text-[11px] font-bold uppercase tracking-wide text-red-500">

                Cancellation reason

              </p>


              <p
                class="mt-1 text-sm text-red-700">

                {{ booking.cancelReason }}

              </p>

            </div>


            <!-- ============================================== -->
            <!-- CREATED -->
            <!-- ============================================== -->

            <p
              class="mt-4 text-xs text-gray-400">

              Booking created:
              {{ formatDateTime(booking.createdAt) }}

            </p>

          </div>


          <!-- ================================================ -->
          <!-- ACTION BAR -->
          <!-- ================================================ -->

          <div
            class="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">


            <!-- Description -->

            <p class="text-sm text-gray-500">

              <span *ngIf="isPending(booking)">
                Waiting for driver approval.
              </span>


              <span *ngIf="isConfirmed(booking)">
                Booking confirmed. You can check in before the trip.
              </span>


              <span *ngIf="isCheckedIn(booking)">
                You have checked in for this trip.
              </span>


              <span *ngIf="isCancelled(booking)">
                This booking has been cancelled.
              </span>


              <span
                *ngIf="
                  !isPending(booking) &&
                  !isConfirmed(booking) &&
                  !isCheckedIn(booking) &&
                  !isCancelled(booking)
                ">

                Status:
                {{ booking.status }}

              </span>

            </p>


            <!-- Actions -->

            <div
              class="flex flex-wrap gap-2">


              <!-- Cancel -->

              <button
                *ngIf="canCancel(booking)"

                type="button"

                (click)="cancelBooking(booking)"

                [disabled]="processingId === booking.bookingId"

                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50">

                <span
                  *ngIf="processingId !== booking.bookingId">

                  Cancel Booking

                </span>


                <span
                  *ngIf="processingId === booking.bookingId">

                  Cancelling...

                </span>

              </button>


              <!-- Check in -->

              <button
                *ngIf="canCheckIn(booking)"

                type="button"

                (click)="checkInBooking(booking)"

                [disabled]="processingId === booking.bookingId"

                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">

                <span
                  *ngIf="processingId !== booking.bookingId">

                  Check-in

                </span>


                <span
                  *ngIf="processingId === booking.bookingId">

                  Checking in...

                </span>

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  `
})
export class BookingsPage implements OnInit {

  private readonly bookingService =
    inject(BookingService);

  private readonly cdr =
    inject(ChangeDetectorRef);


  // ==========================================================
  // STATE
  // ==========================================================

  bookings: BookingViewModel[] = [];

  loading = false;

  processingId: number | null = null;

  errorMessage = '';


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {
    this.loadBookings();
  }


  // ==========================================================
  // LOAD BOOKINGS
  // ==========================================================

  loadBookings(): void {

    this.loading = true;

    this.errorMessage = '';

    this.cdr.detectChanges();


    console.log(
      '=== LOAD BOOKINGS ==='
    );


    this.bookingService
      .getMyBookings()

      .pipe(

        switchMap(
          (bookings) => {

            console.log(
              'Bookings response:',
              bookings
            );


            if (!bookings || bookings.length === 0) {

              return of([]);

            }


            /*
             * For every booking:
             *
             * Booking
             *   ↓
             * Trip
             *   ↓
             * Route
             *   ↓
             * Start Zone
             * End Zone
             */

            const requests =
              bookings.map(
                booking =>
                  this.enrichBooking(
                    booking
                  )
              );


            return forkJoin(
              requests
            );

          }

        ),

        finalize(() => {

          console.log(
            '=== REQUEST FINISHED ==='
          );


          this.loading = false;


          console.log(
            'loading:',
            this.loading
          );


          console.log(
            'bookings:',
            this.bookings
          );


          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (
          bookings: BookingViewModel[]
        ) => {

          this.bookings =
            bookings ?? [];


          console.log(
            'Enriched bookings:',
            this.bookings
          );


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load bookings:',
            error
          );


          this.bookings = [];


          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load your bookings.'
            );


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================================
  // ENRICH BOOKING
  // ==========================================================

  private enrichBooking(
    booking: BookingResponse
  ): Observable<BookingViewModel> {

    return this.bookingService
      .getTrip(booking.tripId)

      .pipe(

        switchMap(
          (trip) => {

            return this.bookingService
              .getRoute(trip.routeId)

              .pipe(

                switchMap(
                  (route) => {

                    /*
                     * Load both zones in parallel.
                     */

                    return forkJoin({

                      startZone:
                        this.bookingService
                          .getZone(
                            route.startZoneId
                          ),

                      endZone:
                        this.bookingService
                          .getZone(
                            route.endZoneId
                          )

                    })

                    .pipe(

                      map(
                        zones => {

                          return {

                            ...booking,

                            trip,

                            route,

                            startZone:
                              zones.startZone,

                            endZone:
                              zones.endZone

                          };

                        }

                      )

                    );

                  }

                )

              );

          }

        ),

        /*
         * If trip/route/zone detail fails,
         * don't lose the booking itself.
         *
         * The booking will still be displayed.
         */

        catchError(
          error => {

            console.error(
              `Failed to enrich booking #${booking.bookingId}:`,
              error
            );


            return of({

              ...booking

            });

          }

        )

      );

  }


  // ==========================================================
  // CANCEL
  // ==========================================================

  cancelBooking(
    booking: BookingViewModel
  ): void {

    if (
      this.processingId !== null
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to cancel Booking #${booking.bookingId}?`
      );


    if (!confirmed) {
      return;
    }


    this.processingId =
      booking.bookingId;

    this.errorMessage = '';


    this.bookingService
      .cancelBooking(
        booking.bookingId
      )

      .pipe(

        finalize(() => {

          this.processingId = null;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (
          updatedBooking
        ) => {

          console.log(
            'Booking cancelled:',
            updatedBooking
          );


          this.updateBooking(
            updatedBooking
          );

        },


        error: (error) => {

          console.error(
            'Failed to cancel booking:',
            error
          );


          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to cancel this booking.'
            );

        }

      });

  }


  // ==========================================================
  // CHECK IN
  // ==========================================================

  checkInBooking(
    booking: BookingViewModel
  ): void {

    if (
      this.processingId !== null
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        `Check in for Booking #${booking.bookingId}?`
      );


    if (!confirmed) {
      return;
    }


    this.processingId =
      booking.bookingId;

    this.errorMessage = '';


    this.bookingService
      .checkInBooking(
        booking.bookingId
      )

      .pipe(

        finalize(() => {

          this.processingId = null;

          this.cdr.detectChanges();

        })

      )

      .subscribe({

        next: (
          updatedBooking
        ) => {

          console.log(
            'Booking checked in:',
            updatedBooking
          );


          this.updateBooking(
            updatedBooking
          );

        },


        error: (error) => {

          console.error(
            'Failed to check in booking:',
            error
          );


          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to check in this booking.'
            );

        }

      });

  }


  // ==========================================================
  // UPDATE BOOKING
  // ==========================================================

  private updateBooking(
    updatedBooking: BookingResponse
  ): void {

    const index =
      this.bookings.findIndex(
        booking =>
          booking.bookingId ===
          updatedBooking.bookingId
      );


    if (index === -1) {

      this.bookings = [
        ...this.bookings,
        updatedBooking
      ];

      return;

    }


    /*
     * Preserve already loaded:
     *
     * trip
     * route
     * startZone
     * endZone
     *
     * because cancel/checkin response only
     * returns BookingResponse.
     */

    const oldBooking =
      this.bookings[index];


    this.bookings[index] = {

      ...oldBooking,

      ...updatedBooking

    };


    /*
     * Create a new array reference so
     * Angular immediately recognizes the change.
     */

    this.bookings = [
      ...this.bookings
    ];


    this.cdr.detectChanges();

  }


  // ==========================================================
  // STATUS
  // ==========================================================

  private normalizeStatus(
    status: string | null | undefined
  ): string {

    return (status ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]/g, '');

  }


  isPending(
    booking: BookingResponse
  ): boolean {

    return (
      this.normalizeStatus(
        booking.status
      ) === 'pending'
    );

  }


  isConfirmed(
    booking: BookingResponse
  ): boolean {

    const status =
      this.normalizeStatus(
        booking.status
      );


    return (
      status === 'confirmed' ||
      status === 'approved'
    );

  }


  isCheckedIn(
    booking: BookingResponse
  ): boolean {

    const status =
      this.normalizeStatus(
        booking.status
      );


    return (
      status === 'checkedin' ||
      booking.checkInTime !== null
    );

  }


  isCancelled(
    booking: BookingResponse
  ): boolean {

    const status =
      this.normalizeStatus(
        booking.status
      );


    return (
      status === 'cancelled' ||
      status === 'canceled' ||
      status === 'rejected'
    );

  }


  // ==========================================================
  // ACTION PERMISSIONS
  // ==========================================================

  canCancel(
    booking: BookingResponse
  ): boolean {

    /*
     * Backend:
     *
     * Passenger or Driver may cancel
     * before check-in.
     */

    if (
      this.isCancelled(booking)
    ) {

      return false;

    }


    if (
      this.isCheckedIn(booking)
    ) {

      return false;

    }


    return true;

  }


  canCheckIn(
    booking: BookingResponse
  ): boolean {

    /*
     * Backend:
     *
     * Passenger only.
     * Must be Confirmed.
     */

    if (
      this.isCancelled(booking)
    ) {

      return false;

    }


    if (
      this.isCheckedIn(booking)
    ) {

      return false;

    }


    return this.isConfirmed(
      booking
    );

  }


  // ==========================================================
  // STATUS LABEL
  // ==========================================================

  getStatusLabel(
    status: string
  ): string {

    const normalized =
      this.normalizeStatus(
        status
      );


    switch (normalized) {

      case 'pending':
        return 'Pending';


      case 'confirmed':
        return 'Confirmed';


      case 'approved':
        return 'Approved';


      case 'checkedin':
        return 'Checked-in';


      case 'cancelled':
      case 'canceled':
        return 'Cancelled';


      case 'rejected':
        return 'Rejected';


      case 'completed':
        return 'Completed';


      default:
        return status || 'Unknown';

    }

  }


  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  getStatusClass(
    status: string
  ): string {

    const normalized =
      this.normalizeStatus(
        status
      );


    switch (normalized) {

      case 'pending':

        return 'bg-yellow-100 text-yellow-700';


      case 'confirmed':
      case 'approved':

        return 'bg-green-100 text-green-700';


      case 'checkedin':

        return 'bg-blue-100 text-blue-700';


      case 'cancelled':
      case 'canceled':
      case 'rejected':

        return 'bg-red-100 text-red-700';


      case 'completed':

        return 'bg-purple-100 text-purple-700';


      default:

        return 'bg-gray-100 text-gray-700';

    }

  }


  // ==========================================================
  // DATE
  // ==========================================================

  formatDateTime(
    value: string | null | undefined
  ): string {

    if (!value) {
      return '-';
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleString(
      'en-US',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    );

  }


  // ==========================================================
  // TIME
  // ==========================================================

  formatTime(
    value: string | null | undefined
  ): string {

    if (!value) {
      return '-';
    }


    /*
     * API returns:
     *
     * "08:00:00"
     */

    const parts =
      value.split(':');


    if (parts.length < 2) {
      return value;
    }


    const hour =
      Number(parts[0]);

    const minute =
      Number(parts[1]);


    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ) {

      return value;

    }


    const date =
      new Date();

    date.setHours(
      hour,
      minute,
      0,
      0
    );


    return date.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    );

  }


  // ==========================================================
  // DAYS OF WEEK
  // ==========================================================

  formatDaysOfWeek(
    days: string | null | undefined
  ): string {

    if (!days) {
      return '-';
    }


    /*
     * Backend example:
     *
     * "2,3,4,5,6"
     *
     * We preserve the backend's
     * numeric representation and
     * translate it to readable names.
     *
     * Assumption based on the backend
     * data format:
     *
     * 2 = Monday
     * 3 = Tuesday
     * 4 = Wednesday
     * 5 = Thursday
     * 6 = Friday
     * 7 = Saturday
     * 1 = Sunday
     */

    const dayMap: Record<
      string,
      string
    > = {

      '1': 'Sun',
      '2': 'Mon',
      '3': 'Tue',
      '4': 'Wed',
      '5': 'Thu',
      '6': 'Fri',
      '7': 'Sat'

    };


    return days
      .split(',')
      .map(
        day =>
          dayMap[day.trim()] ??
          day.trim()
      )
      .join(', ');

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByBookingId(
    index: number,
    booking: BookingResponse
  ): number {

    return booking.bookingId;

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (!error) {
      return fallback;
    }


    if (
      typeof error.error ===
      'string'
    ) {

      return error.error;

    }


    if (
      error.error?.message
    ) {

      return error.error.message;

    }


    if (error.message) {

      return error.message;

    }


    switch (error.status) {

      case 400:
        return 'The request is invalid.';


      case 401:
        return 'Your session has expired. Please log in again.';


      case 403:
        return 'You do not have permission to perform this action.';


      case 404:
        return 'The requested resource was not found.';


      case 500:
        return 'The server encountered an internal error.';


      default:
        return fallback;

    }

  }

}