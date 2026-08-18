import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core'

import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'

import { forkJoin, of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AuthStore } from '../../core/auth/auth.store'
import {
  BookingService,
  BookingResponse,
  TripResponse,
  RouteResponse,
  ZoneResponse
} from '../../../src/app/services/booking.service'

import { CostService } from '../../../src/app/services/cost.service'


interface DashboardTrip {
  booking: BookingResponse
  trip: TripResponse
  route: RouteResponse
  startZone: ZoneResponse | null
  endZone: ZoneResponse | null
}


interface CostTransaction {
  transactionId: number
  tripId: number
  employeeId: number
  amount: number
  transactionMonth: string
  createdAt: string
}


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  template: `
    <div class="mx-auto max-w-7xl space-y-8 pb-10">

      <!-- ===================================================== -->
      <!-- HEADER -->
      <!-- ===================================================== -->

      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <h1 class="text-2xl font-bold text-gray-900">
            Good morning, {{ userName }}
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Here is your mobility summary for today,
            {{ todayText }}.
          </p>

        </div>


        <div class="flex items-center gap-3">

          <a
            *ngIf="isDriver"
            routerLink="/create-trip"
            class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 5v14M5 12h14"/>
            </svg>

            Offer Ride

          </a>


          <a
            routerLink="/rides"
            class="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />

            </svg>

            Find Ride

          </a>

        </div>

      </div>


      <!-- ===================================================== -->
      <!-- LOADING -->
      <!-- ===================================================== -->

      <div
        *ngIf="loading"
        class="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500"
      >
        Loading dashboard...
      </div>


      <!-- ===================================================== -->
      <!-- STATISTICS -->
      <!-- ===================================================== -->

      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">

        <!-- Trips -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >

          <p
            class="text-xs font-bold uppercase tracking-wider text-gray-400"
          >
            TRIPS THIS MONTH
          </p>

          <div class="mt-2 flex items-baseline justify-between">

            <span
              class="text-3xl font-extrabold text-gray-900"
            >
              {{ tripsThisMonth }}
            </span>

            <span
              class="text-sm font-bold text-blue-600"
            >
              trips
            </span>

          </div>

        </div>


        <!-- Total paid -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >

          <p
            class="text-xs font-bold uppercase tracking-wider text-gray-400"
          >
            TOTAL PAID
          </p>

          <div class="mt-2 flex items-baseline justify-between">

            <span
              class="text-3xl font-extrabold text-gray-900"
            >
              {{ totalPaid | number:'1.0-0' }}
            </span>

            <span
              class="text-sm font-bold text-red-500"
            >
              VND
            </span>

          </div>

        </div>

      </div>


      <!-- ===================================================== -->
      <!-- MAIN -->
      <!-- ===================================================== -->

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">


        <!-- =================================================== -->
        <!-- UPCOMING TRIPS -->
        <!-- =================================================== -->

        <div class="lg:col-span-2 space-y-4">

          <div class="flex items-center justify-between">

            <h2
              class="text-lg font-bold text-gray-900"
            >
              Upcoming Trips
            </h2>

            <a
              routerLink="/my-bookings"
              class="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All
            </a>

          </div>


          <!-- No trips -->

          <div
            *ngIf="!loading && upcomingTrips.length === 0"
            class="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
          >

            <p class="font-semibold text-gray-700">
              No upcoming trips
            </p>

            <p class="mt-1 text-sm text-gray-500">
              Find a ride to start your journey.
            </p>

            <a
              routerLink="/rides"
              class="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Find Ride
            </a>

          </div>


          <!-- Trips -->

          <div
            *ngFor="let item of upcomingTrips"
            class="group relative flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md md:flex-row md:items-center md:justify-between"
          >

            <!-- Left -->

            <div class="flex items-center gap-4">

              <!-- Date -->

              <div
                class="rounded-lg bg-gray-50 px-3 py-2 text-center border border-gray-100 min-w-[70px]"
              >

                <p
                  class="text-[10px] font-bold uppercase text-gray-400"
                >
                  {{ getDayLabel(item.trip.departureTime) }}
                </p>

                <p
                  class="text-base font-black text-gray-900"
                >
                  {{ getTime(item.trip.departureTime) }}
                </p>

              </div>


              <!-- Route -->

              <div class="space-y-1">

                <div
                  class="flex items-center gap-2 text-sm font-bold text-gray-900"
                >

                  <span
                    class="h-2 w-2 rounded-full bg-green-500"
                  ></span>

                  {{ item.startZone?.zoneName || 'Unknown origin' }}

                </div>


                <div
                  class="flex items-center gap-2 text-sm font-bold text-gray-900"
                >

                  <span
                    class="h-2 w-2 rounded-full border-2 border-gray-400 bg-white"
                  ></span>

                  {{ item.endZone?.zoneName || 'Unknown destination' }}

                </div>

              </div>

            </div>


            <!-- Right -->

            <div
              class="flex items-center gap-4"
            >

              <div class="text-right">

                <p
                  class="text-[11px] font-semibold text-gray-400"
                >
                  STATUS
                </p>

                <span
                  class="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                  [ngClass]="getStatusClass(item.booking.status)"
                >
                  {{ item.booking.status }}
                </span>

              </div>


              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
              >
                {{ getInitials(userName) }}
              </div>


              <button
                (click)="viewBookingDetails()"
                class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                title="View details"
              >

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 18l6-6-6-6"/>
                </svg>

              </button>

            </div>

          </div>

        </div>


        <!-- =================================================== -->
        <!-- RIGHT -->
        <!-- =================================================== -->

        <div class="space-y-6 lg:-mt-32">


          <!-- ================================================= -->
          <!-- COST SUMMARY -->
          <!-- ================================================= -->

          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
          >

            <div
              class="flex items-center justify-between border-b border-gray-100 pb-3"
            >

              <h3
                class="font-bold text-gray-900"
              >
                Cost Summary
              </h3>

              <a
                routerLink="/costs"
                class="text-xs font-semibold text-blue-600"
              >
                View
              </a>

            </div>


            <div>

              <p
                class="text-[10px] font-bold uppercase tracking-wider text-gray-400"
              >
                THIS MONTH
              </p>

              <p
                class="mt-1 text-2xl font-extrabold text-gray-900"
              >
                {{ totalPaid | number:'1.0-0' }}
                <span class="text-sm text-gray-500">
                  VND
                </span>
              </p>

            </div>


            <div
              *ngIf="costTransactions.length === 0"
              class="text-xs text-gray-400"
            >
              No cost transactions this month.
            </div>


            <div
              *ngFor="let transaction of costTransactions.slice(0, 3)"
              class="flex items-center justify-between border-t border-gray-100 pt-3"
            >

              <div>

                <p
                  class="text-sm font-semibold text-gray-800"
                >
                  Trip #{{ transaction.tripId }}
                </p>

                <p
                  class="text-[11px] text-gray-400"
                >
                  {{ formatDate(transaction.createdAt) }}
                </p>

              </div>


              <p
                class="text-sm font-bold text-gray-900"
              >
                {{ transaction.amount | number:'1.0-0' }}
              </p>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- RECENT UPDATES -->
          <!-- ================================================= -->

          <div
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
          >

            <div
              class="flex items-center justify-between border-b border-gray-100 pb-3"
            >

              <h3
                class="font-bold text-gray-900"
              >
                Recent Updates
              </h3>

              <span
                *ngIf="pendingCount > 0"
                class="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600"
              >
                {{ pendingCount }} PENDING
              </span>

            </div>


            <div
              *ngIf="pendingCount === 0"
              class="text-sm text-gray-500"
            >
              No pending bookings.
            </div>


            <div
              *ngFor="let booking of pendingBookings.slice(0, 3)"
              class="flex gap-3 border-l-2 border-orange-400 pl-3"
            >

              <p class="text-sm text-gray-600">

                Booking for

                <strong class="text-gray-900">
                  Trip #{{ booking.tripId }}
                </strong>

                is waiting for confirmation.

                <span
                  class="block text-[11px] text-gray-400 mt-0.5"
                >
                  {{ formatDate(booking.createdAt) }}
                </span>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  `
})
export class HomePage implements OnInit {

  // ============================================================
  // DEPENDENCIES
  // ============================================================

  private readonly authStore = inject(AuthStore)

  private readonly bookingService = inject(BookingService)

  private readonly costService = inject(CostService)

  private readonly router = inject(Router)

  private readonly cdr = inject(ChangeDetectorRef)


  // ============================================================
  // STATE
  // ============================================================

  loading = true

  upcomingTrips: DashboardTrip[] = []

  pendingTrips: DashboardTrip[] = []

  pendingBookings: BookingResponse[] = []

  costTransactions: CostTransaction[] = []


  // ============================================================
  // USER
  // ============================================================

  get userName(): string {
    return this.authStore.user()?.name || 'User'
  }


  get userRole(): string {
    return this.authStore.user()?.role || ''
  }


  get isDriver(): boolean {
    return this.userRole.toLowerCase() === 'driver'
  }


  // ============================================================
  // STATISTICS
  // ============================================================

  get tripsThisMonth(): number {
    const currentMonth =
      this.getCurrentMonth()

    return this.upcomingTrips.filter(
      item =>
        item.trip.departureTime.startsWith(currentMonth)
    ).length
  }


  get totalPaid(): number {
    return this.costTransactions.reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    )
  }


  get pendingCount(): number {
    return this.pendingBookings.length
  }


  // ============================================================
  // DATE
  // ============================================================

  readonly currentMonth =
    this.getCurrentMonth()


  get todayText(): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }
    ).format(new Date())

  }


  private getCurrentMonth(): string {

    const now = new Date()

    const year =
      now.getFullYear()

    const month =
      String(now.getMonth() + 1)
        .padStart(2, '0')

    return `${year}-${month}`
  }


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {
    this.loadDashboard()
  }


  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  private loadDashboard(): void {

    this.loading = true

    this.bookingService
      .getMyBookings()
      .pipe(
        catchError(error => {

          console.error(
            'Failed to load bookings:',
            error
          )

          return of([])
        })
      )
      .subscribe(bookings => {

        this.loadBookingDetails(bookings)

      })

    this.cdr.detectChanges()
    this.loadCosts()

  }


  // ============================================================
  // LOAD BOOKING DETAILS
  // ============================================================

  private loadBookingDetails(
    bookings: BookingResponse[]
  ): void {

    if (bookings.length === 0) {

      this.upcomingTrips = []

      this.pendingTrips = []

      this.pendingBookings = []

      this.loading = false
      this.cdr.detectChanges()
      return

    }

    this.pendingBookings = bookings.filter(
      booking =>
        (booking.status ?? '').trim().toLowerCase() === 'pending'
    )


    const requests = bookings.map(
      booking =>

        this.bookingService
          .getTrip(booking.tripId)
          .pipe(
            catchError(error => {

              console.error(
                `Failed to load trip ${booking.tripId}:`,
                error
              )

              return of(null)
            })
          )
    )


    forkJoin(requests)
      .subscribe(trips => {

        const validTrips =
          trips.filter(
            (trip): trip is TripResponse =>
              trip !== null
          )


        const detailRequests =
          validTrips.map(trip => {

            const booking =
              bookings.find(
                b =>
                  b.tripId === trip.tripId
              )

            if (!booking) {
              return of(null)
            }


            return forkJoin({

              booking: of(booking),

              trip: of(trip),

              route:
                this.bookingService
                  .getRoute(trip.routeId)
                  .pipe(
                    catchError(() => of(null))
                  )

            })

          })


        forkJoin(detailRequests)
          .subscribe(details => {

            const finalRequests =
              details
                .filter(
                  item => item !== null
                )
                .map(item => {

                  if (!item) {
                    return of(null)
                  }


                  return forkJoin({

                    booking: of(item.booking),

                    trip: of(item.trip),

                    route: of(item.route),

                    startZone:
                      item.route
                        ? this.bookingService
                            .getZone(
                              item.route.startZoneId
                            )
                            .pipe(
                              catchError(
                                () => of(null)
                              )
                            )
                        : of(null),

                    endZone:
                      item.route
                        ? this.bookingService
                            .getZone(
                              item.route.endZoneId
                            )
                            .pipe(
                              catchError(
                                () => of(null)
                              )
                            )
                        : of(null)

                  })

                })


            forkJoin(finalRequests)
              .subscribe(results => {

                const dashboardTrips =
                  results.filter(
                    (
                      item
                    ): item is DashboardTrip =>
                      item !== null
                  )


                this.upcomingTrips =
                  dashboardTrips
                    .filter(item =>
                      new Date(
                        item.trip.departureTime
                      ).getTime()
                      >= Date.now()
                    )
                    .sort(
                      (a, b) =>
                        new Date(
                          a.trip.departureTime
                        ).getTime()
                        -
                        new Date(
                          b.trip.departureTime
                        ).getTime()
                    )


                this.pendingTrips =
                  dashboardTrips.filter(
                    item =>
                      item.booking.status
                        .toLowerCase()
                      === 'pending'
                  )


                this.loading = false
                this.cdr.detectChanges()
              })

          })

      })

  }


  // ============================================================
  // LOAD COST
  // ============================================================

  private loadCosts(): void {

    this.costService
      .getMyCostHistory(this.currentMonth)
      .pipe(
        catchError(error => {

          console.error(
            'Failed to load cost history:',
            error
          )

          return of([])
        })
      )
      .subscribe(
        transactions => {

          this.costTransactions =
            transactions as CostTransaction[]

          this.cdr.detectChanges()
        }
      )

  }


  // ============================================================
  // HELPERS
  // ============================================================

  getDayLabel(
    dateString: string
  ): string {

    const date =
      new Date(dateString)

    const today =
      new Date()

    if (
      date.toDateString()
      === today.toDateString()
    ) {
      return 'TODAY'
    }


    const tomorrow =
      new Date(today)

    tomorrow.setDate(
      today.getDate() + 1
    )


    if (
      date.toDateString()
      === tomorrow.toDateString()
    ) {
      return 'TOMORROW'
    }


    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric'
      }
    ).format(date)

  }


  getTime(
    dateString: string
  ): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    ).format(
      new Date(dateString)
    )

  }


  formatDate(
    dateString: string
  ): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    ).format(
      new Date(dateString)
    )

  }


  getInitials(
    name: string
  ): string {

    if (!name) {
      return 'U'
    }


    return name
      .split(' ')
      .filter(Boolean)
      .map(
        part =>
          part.charAt(0).toUpperCase()
      )
      .slice(0, 2)
      .join('')

  }


  getStatusClass(
    status: string
  ): string {

    switch (
      status.toLowerCase()
    ) {

      case 'confirmed':
        return 'bg-green-100 text-green-700'

      case 'pending':
        return 'bg-yellow-100 text-yellow-800'

      case 'checkedin':
      case 'checked-in':
        return 'bg-blue-100 text-blue-700'

      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-gray-100 text-gray-600'

    }

  }


  // ============================================================
  // NAVIGATION
  // ============================================================

  viewBookingDetails(): void {

    this.router.navigate([
      '/my-bookings'
    ])

  }

}