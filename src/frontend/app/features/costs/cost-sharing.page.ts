import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CostService } from '../../../src/app/services/cost.service';


// ============================================================
// API MODELS
// ============================================================

export interface CostTransaction {
  transactionId: number;
  tripId: number;
  employeeId: number;
  amount: number;
  transactionMonth: string;
  createdAt: string;
}

export interface TripResponse {
  tripId: number;
  routeId: number;
  driverId: number;
  vehicleId: number;
  departureTime: string;
  availableSeats: number;
  status: string;
  createdAt: string;
}

export interface RouteResponse {
  routeId: number;
  employeeId: number;
  startZoneId: number;
  endZoneId: number;
  startTime: string;
  daysOfWeek: string;
  isActive: boolean;
}

export interface ZoneResponse {
  zoneId: number;
  zoneName: string;
  latitude: number;
  longitude: number;
}


// ============================================================
// VIEW MODEL
// ============================================================

interface TransactionViewModel extends CostTransaction {
  trip?: TripResponse;
  route?: RouteResponse;
  startZoneName?: string;
  endZoneName?: string;
  role: 'DRIVER' | 'PASSENGER';
}


// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-cost-sharing-page',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="mx-auto max-w-6xl pb-10">

      <!-- ================================================== -->
      <!-- HEADER -->
      <!-- ================================================== -->

      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Cost Sharing & Wallet
          </h1>

          <p class="mt-1 text-sm text-gray-500">
            Your carpool cost and transaction history
          </p>
        </div>

        <button
          type="button"
          (click)="loadData()"
          [disabled]="loading()"
          class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            [class.animate-spin]="loading()"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"></path>
            <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"></path>
          </svg>

          Refresh
        </button>
      </div>


      <!-- ================================================== -->
      <!-- ERROR -->
      <!-- ================================================== -->

      @if (error()) {
        <div
          class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <div class="flex items-start gap-3">
            <svg
              class="mt-0.5 shrink-0"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>

            <div>
              <p class="font-bold">
                Unable to load cost data
              </p>

              <p class="mt-1">
                {{ error() }}
              </p>
            </div>
          </div>
        </div>
      }


      <!-- ================================================== -->
      <!-- LOADING -->
      <!-- ================================================== -->

      @if (loading()) {

        <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">

          @for (item of [1, 2, 3]; track item) {
            <div
              class="h-32 animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div class="h-3 w-24 rounded bg-gray-200"></div>
              <div class="mt-4 h-8 w-32 rounded bg-gray-200"></div>
            </div>
          }

        </div>

      } @else {

        <!-- ================================================== -->
        <!-- SUMMARY -->
        <!-- ================================================== -->

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">

          <!-- TOTAL PAID -->

          <div
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-wider text-gray-500"
              >
                TOTAL PAID
              </p>

              <p class="mt-1 text-3xl font-extrabold text-gray-900">
                {{ formatCurrency(totalPaid()) }}
              </p>

              <p class="mt-2 text-xs font-medium text-gray-400">
                {{ transactions().length }} transaction(s)
              </p>
            </div>

            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>


          <!-- TOTAL RECEIVED -->

          <div
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div>
              <p
                class="text-[10px] font-bold uppercase tracking-wider text-gray-500"
              >
                TOTAL RECEIVED
              </p>

              <p class="mt-1 text-3xl font-extrabold text-emerald-600">
                {{ formatCurrency(totalReceived()) }}
              </p>

              <p class="mt-2 text-xs font-medium text-gray-400">
                Based on available cost transaction data
              </p>
            </div>

            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="17" y1="7" x2="7" y2="17"></line>
                <polyline points="17 17 7 17 7 7"></polyline>
              </svg>
            </div>
          </div>


          <!-- TOTAL SAVINGS -->

          <div
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div class="mb-4 flex items-center justify-between">

              <h3 class="text-sm font-bold text-gray-900">
                CO2 & Cost Saved
              </h3>

              <svg
                class="text-emerald-500"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="8"></circle>
                <path d="M12 6v6l4.25 2.5"></path>
              </svg>

            </div>

            <p
              class="text-[10px] font-bold uppercase tracking-wider text-gray-500"
            >
              TOTAL SAVINGS
            </p>

            <div class="mt-1 flex items-center justify-between">

              <p class="text-3xl font-extrabold text-emerald-600">
                {{ formatCurrency(totalSavings()) }}
              </p>

              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>

            </div>

            <div class="mt-6">

              <div
                class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
              >
                <div
                  class="h-full bg-emerald-500 transition-all duration-500"
                  [style.width.%]="savingsPercentage()"
                ></div>
              </div>

              <p class="mt-2 text-xs font-semibold text-gray-500">
                {{ savingsPercentage() }}% of monthly corporate goal achieved.
              </p>

            </div>
          </div>

        </div>


        <!-- ================================================== -->
        <!-- CONTENT -->
        <!-- ================================================== -->

        <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          <!-- ================================================= -->
          <!-- LEFT -->
          <!-- ================================================= -->

          <div class="space-y-6">

            <!-- MONTHLY SPENDING -->

            <div
              class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >

              <div class="mb-4 flex items-center justify-between">

                <h3 class="text-sm font-bold text-gray-900">
                  Monthly Spending
                </h3>

                <span
                  class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500"
                >
                  {{ currentMonth }}
                </span>

              </div>


              <div
                class="relative flex h-40 w-full items-end justify-around pb-6 pt-4"
              >

                <!-- GRID -->

                <div
                  class="absolute right-0 top-0 h-[1px] w-full bg-gray-100"
                >
                  <span
                    class="absolute -right-1 -top-2 bg-white pl-2 text-[10px] text-gray-400"
                  >
                    {{ formatShortCurrency(maxWeeklyAmount()) }}
                  </span>
                </div>

                <div
                  class="absolute right-0 top-[50%] h-[1px] w-full bg-gray-100"
                >
                  <span
                    class="absolute -right-1 -top-2 bg-white pl-2 text-[10px] text-gray-400"
                  >
                    {{ formatShortCurrency(maxWeeklyAmount() / 2) }}
                  </span>
                </div>


                <!-- BARS -->

                @for (
                  week of weeklySpending();
                  track week.label
                ) {

                  <div class="flex h-full flex-col justify-end">

                    <div
                      class="w-10 rounded-t-sm bg-[#2563EB] transition-all duration-500"
                      [style.height.%]="week.height"
                      [title]="formatCurrency(week.amount)"
                    ></div>

                  </div>

                }

              </div>


              <div
                class="mt-2 flex justify-around text-xs font-bold text-gray-400"
              >
                @for (
                  week of weeklySpending();
                  track week.label
                ) {
                  <span>{{ week.label }}</span>
                }
              </div>

            </div>

          </div>


          <!-- ================================================= -->
          <!-- RIGHT -->
          <!-- ================================================= -->

          <div class="lg:col-span-2">

            <!-- TRANSACTION HISTORY -->

            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >

              <div
                class="flex items-center justify-between border-b border-gray-100 p-5"
              >

                <div>

                  <h3 class="text-base font-bold text-gray-900">
                    Transaction History
                  </h3>

                  <p class="mt-1 text-xs text-gray-500">
                    {{ currentMonth }}
                  </p>

                </div>

                <button
                  type="button"
                  (click)="loadData()"
                  class="flex items-center gap-1 text-sm font-bold text-[#2563EB] hover:underline"
                >
                  Refresh

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"></path>
                    <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"></path>
                  </svg>

                </button>

              </div>


              <!-- EMPTY -->

              @if (transactions().length === 0) {

                <div class="p-12 text-center">

                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                      ></rect>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>

                  <p class="mt-4 font-semibold text-gray-900">
                    No transactions found
                  </p>

                  <p class="mt-1 text-sm text-gray-500">
                    You don't have any cost transactions for
                    {{ currentMonth }}.
                  </p>

                </div>

              } @else {

                <!-- TABLE -->

                <div class="overflow-x-auto">

                  <table
                    class="w-full min-w-[800px] text-left text-sm"
                  >

                    <thead
                      class="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500"
                    >

                      <tr>

                        <th class="px-6 py-4">
                          DATE
                        </th>

                        <th class="px-6 py-4">
                          ROLE
                        </th>

                        <th class="px-6 py-4">
                          ROUTE
                        </th>

                        <th class="px-6 py-4">
                          AMOUNT
                        </th>

                        <th class="px-6 py-4">
                          STATUS
                        </th>

                        <th class="px-6 py-4">
                          TRIP
                        </th>

                      </tr>

                    </thead>


                    <tbody
                      class="divide-y divide-gray-100"
                    >

                      @for (
                        transaction of transactions();
                        track transaction.transactionId
                      ) {

                        <tr class="transition hover:bg-gray-50">

                          <!-- DATE -->

                          <td class="px-6 py-4">

                            <p class="font-bold text-gray-900">
                              {{ formatDate(transaction.createdAt) }}
                            </p>

                            <p class="text-xs text-gray-500">
                              {{ formatTime(transaction.createdAt) }}
                            </p>

                          </td>


                          <!-- ROLE -->

                          <td class="px-6 py-4">

                            @if (transaction.role === 'DRIVER') {

                              <span
                                class="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700"
                              >
                                DRIVER
                              </span>

                            } @else {

                              <span
                                class="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-600"
                              >
                                PASSENGER
                              </span>

                            }

                          </td>


                          <!-- ROUTE -->

                          <td class="px-6 py-4">

                            @if (
                              transaction.startZoneName ||
                              transaction.endZoneName
                            ) {

                              <p class="font-bold text-gray-900">
                                {{ transaction.startZoneName || 'Unknown' }}
                                →
                              </p>

                              <p class="text-xs text-gray-500">
                                {{ transaction.endZoneName || 'Unknown' }}
                              </p>

                            } @else {

                              <p class="font-semibold text-gray-400">
                                Route #{{ transaction.trip?.routeId || 'N/A' }}
                              </p>

                            }

                          </td>


                          <!-- AMOUNT -->

                          <td class="px-6 py-4">

                            <span
                              class="font-extrabold"
                              [class.text-emerald-600]="
                                transaction.role === 'DRIVER'
                              "
                              [class.text-gray-900]="
                                transaction.role !== 'DRIVER'
                              "
                            >

                              {{
                                transaction.role === 'DRIVER'
                                  ? '+'
                                  : '-'
                              }}{{ formatCurrency(transaction.amount) }}

                            </span>

                          </td>


                          <!-- STATUS -->

                          <td class="px-6 py-4">

                            <span
                              class="text-xs font-bold text-emerald-600"
                            >
                              COMPLETED
                            </span>

                          </td>


                          <!-- TRIP -->

                          <td class="px-6 py-4">

                            <span
                              class="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600"
                            >
                              #{{ transaction.tripId }}
                            </span>

                          </td>

                        </tr>

                      }

                    </tbody>

                  </table>

                </div>

              }

            </div>

          </div>

        </div>

      }

    </div>
  `
})
export class CostSharingPage implements OnInit {

  // ============================================================
  // DEPENDENCIES
  // ============================================================

  private readonly costService = inject(CostService);
  private readonly http = inject(HttpClient);


  // ============================================================
  // CONFIG
  // ============================================================

  private readonly apiUrl = 'http://localhost:5147/api';


  // ============================================================
  // STATE
  // ============================================================

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly transactions =
    signal<TransactionViewModel[]>([]);


  // ============================================================
  // CURRENT MONTH
  // ============================================================

  readonly currentMonth = this.getCurrentMonth();


  // ============================================================
  // COMPUTED
  // ============================================================

  readonly totalPaid = computed(() => {

    return this.transactions()
      .filter(transaction => transaction.role === 'PASSENGER')
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

  });


  readonly totalReceived = computed(() => {

    return this.transactions()
      .filter(transaction => transaction.role === 'DRIVER')
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

  });


  readonly totalSavings = computed(() => {

    const paid = this.totalPaid();

    const received = this.totalReceived();

    /*
     * This is only a UI estimate.
     *
     * The current backend does not provide a dedicated
     * "saving" field.
     */
    if (paid === 0) {
      return 0;
    }

    return Math.max(paid - received, 0);

  });


  readonly savingsPercentage = computed(() => {

    const value = this.totalSavings();

    if (value <= 0) {
      return 0;
    }

    /*
     * UI goal:
     * $200 monthly saving = 100%
     */
    return Math.min(
      Math.round((value / 200000) * 100),
      100
    );

  });


  readonly weeklySpending = computed(() => {

    const weeks = [
      {
        label: 'W1',
        amount: 0
      },
      {
        label: 'W2',
        amount: 0
      },
      {
        label: 'W3',
        amount: 0
      },
      {
        label: 'W4',
        amount: 0
      }
    ];


    for (const transaction of this.transactions()) {

      const date = new Date(transaction.createdAt);

      const day = date.getDate();

      let index = Math.floor((day - 1) / 7);

      if (index > 3) {
        index = 3;
      }

      weeks[index].amount += transaction.amount;

    }


    const max = Math.max(
      ...weeks.map(week => week.amount),
      1
    );


    return weeks.map(week => ({
      ...week,
      height:
        week.amount === 0
          ? 4
          : Math.max(
              Math.round((week.amount / max) * 100),
              8
            )
    }));

  });


  readonly maxWeeklyAmount = computed(() => {

    return Math.max(
      ...this.weeklySpending().map(
        week => week.amount
      ),
      1
    );

  });


  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {

    this.loadData();

  }


  // ============================================================
  // LOAD COST DATA
  // ============================================================

  loadData(): void {

    this.loading.set(true);

    this.error.set(null);


    /*
     * Main API:
     *
     * GET /api/cost/my-history?month=YYYY-MM
     */
    this.costService
      .getMyCostHistory(this.currentMonth)
      .subscribe({

        next: (response: CostTransaction[]) => {

          const transactions =
            Array.isArray(response)
              ? response
              : [];

          this.loadTransactionDetails(transactions);

        },

        error: (err) => {

          console.error(
            'Failed to load cost history:',
            err
          );

          this.loading.set(false);

          this.error.set(
            this.getErrorMessage(err)
          );

        }

      });

  }


  // ============================================================
  // LOAD TRIP / ROUTE / ZONE
  // ============================================================

  private loadTransactionDetails(
    transactions: CostTransaction[]
  ): void {

    if (transactions.length === 0) {

      this.transactions.set([]);

      this.loading.set(false);

      return;

    }


    /*
     * First get every Trip.
     *
     * CostTransaction:
     * {
     *   transactionId,
     *   tripId,
     *   employeeId,
     *   amount
     * }
     */

    const tripRequests =
      transactions.map(transaction =>

        this.http
          .get<TripResponse>(
            `${this.apiUrl}/trip/${transaction.tripId}`
          )
          .pipe(
            catchError(error => {

              console.error(
                `Failed to load trip ${transaction.tripId}`,
                error
              );

              return of(null);

            })
          )

      );


    forkJoin(tripRequests)
      .subscribe({

        next: trips => {

          this.loadRoutes(
            transactions,
            trips
          );

        },

        error: error => {

          console.error(
            'Failed to load trips:',
            error
          );

          /*
           * Even if Trip API fails, still show
           * the raw cost transactions.
           */

          this.transactions.set(
            transactions.map(transaction => ({
              ...transaction,
              role: 'PASSENGER'
            }))
          );

          this.loading.set(false);

        }

      });

  }


  // ============================================================
  // LOAD ROUTES
  // ============================================================

  private loadRoutes(
    transactions: CostTransaction[],
    trips: (TripResponse | null)[]
  ): void {

    const routeIds = [
      ...new Set(
        trips
          .filter(
            (trip): trip is TripResponse =>
              trip !== null
          )
          .map(trip => trip.routeId)
      )
    ];


    if (routeIds.length === 0) {

      this.transactions.set(
        transactions.map((transaction, index) => {

          const trip = trips[index];

          return {
            ...transaction,
            trip: trip ?? undefined,
            role:
              trip &&
              trip.driverId === transaction.employeeId
                ? 'DRIVER'
                : 'PASSENGER'
          };

        })
      );

      this.loading.set(false);

      return;

    }


    const routeRequests =
      routeIds.map(routeId =>

        this.http
          .get<RouteResponse>(
            `${this.apiUrl}/route/${routeId}`
          )
          .pipe(
            catchError(error => {

              console.error(
                `Failed to load route ${routeId}`,
                error
              );

              return of(null);

            })
          )

      );


    forkJoin(routeRequests)
      .subscribe({

        next: routes => {

          const routeMap =
            new Map<number, RouteResponse>();


          routeIds.forEach(
            (routeId, index) => {

              const route = routes[index];

              if (route) {
                routeMap.set(
                  routeId,
                  route
                );
              }

            }
          );


          this.loadZones(
            transactions,
            trips,
            routeMap
          );

        },

        error: error => {

          console.error(
            'Failed to load routes:',
            error
          );

          this.finishTransactions(
            transactions,
            trips,
            new Map()
          );

        }

      });

  }


  // ============================================================
  // LOAD ZONES
  // ============================================================

  private loadZones(
    transactions: CostTransaction[],
    trips: (TripResponse | null)[],
    routes: Map<number, RouteResponse>
  ): void {

    const zoneIds = [
      ...new Set(
        [...routes.values()]
          .flatMap(route => [
            route.startZoneId,
            route.endZoneId
          ])
      )
    ];


    if (zoneIds.length === 0) {

      this.finishTransactions(
        transactions,
        trips,
        routes
      );

      return;

    }


    const zoneRequests =
      zoneIds.map(zoneId =>

        this.http
          .get<ZoneResponse>(
            `${this.apiUrl}/Zone/${zoneId}`
          )
          .pipe(
            catchError(error => {

              console.error(
                `Failed to load zone ${zoneId}`,
                error
              );

              return of(null);

            })
          )

      );


    forkJoin(zoneRequests)
      .subscribe({

        next: zones => {

          const zoneMap =
            new Map<number, ZoneResponse>();


          zoneIds.forEach(
            (zoneId, index) => {

              const zone = zones[index];

              if (zone) {

                zoneMap.set(
                  zoneId,
                  zone
                );

              }

            }
          );


          this.finishTransactions(
            transactions,
            trips,
            routes,
            zoneMap
          );

        },

        error: error => {

          console.error(
            'Failed to load zones:',
            error
          );

          this.finishTransactions(
            transactions,
            trips,
            routes
          );

        }

      });

  }


  // ============================================================
  // BUILD VIEW MODEL
  // ============================================================

  private finishTransactions(
    transactions: CostTransaction[],
    trips: (TripResponse | null)[],
    routes: Map<number, RouteResponse>,
    zones: Map<number, ZoneResponse> = new Map()
  ): void {

    const result: TransactionViewModel[] = [];


    transactions.forEach(
      (transaction, index) => {

        const trip = trips[index];


        let route: RouteResponse | undefined;

        let startZoneName: string | undefined;

        let endZoneName: string | undefined;


        if (trip) {

          route =
            routes.get(trip.routeId);


          if (route) {

            startZoneName =
              zones.get(
                route.startZoneId
              )?.zoneName;


            endZoneName =
              zones.get(
                route.endZoneId
              )?.zoneName;

          }

        }


        /*
         * IMPORTANT:
         *
         * We DON'T use:
         *
         * user.role
         *
         * because AuthUser doesn't contain role.
         *
         * Instead:
         *
         * transaction.employeeId === trip.driverId
         *
         * => DRIVER
         *
         * otherwise
         *
         * => PASSENGER
         */

        const role =
          trip &&
          trip.driverId === transaction.employeeId
            ? 'DRIVER'
            : 'PASSENGER';


        result.push({

          ...transaction,

          trip: trip ?? undefined,

          route,

          startZoneName,

          endZoneName,

          role

        });

      }
    );


    /*
     * Newest transaction first.
     */

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );


    this.transactions.set(result);

    this.loading.set(false);

  }


  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  formatCurrency(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'vi-VN',
      {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }
    ).format(amount);

  }


  formatShortCurrency(
    amount: number
  ): string {

    if (amount >= 1_000_000) {

      return `${(
        amount / 1_000_000
      ).toFixed(1)}M`;

    }


    if (amount >= 1_000) {

      return `${(
        amount / 1_000
      ).toFixed(0)}K`;

    }


    return `${Math.round(amount)}`;

  }


  // ============================================================
  // DATE FORMAT
  // ============================================================

  formatDate(
    value: string
  ): string {

    const date = new Date(value);

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }
    ).format(date);

  }


  formatTime(
    value: string
  ): string {

    const date = new Date(value);

    return new Intl.DateTimeFormat(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(date);

  }


  // ============================================================
  // CURRENT MONTH
  // ============================================================

  private getCurrentMonth(): string {

    const date = new Date();

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');


    return `${year}-${month}`;

  }


  // ============================================================
  // ERROR MESSAGE
  // ============================================================

  private getErrorMessage(
    error: any
  ): string {

    if (error?.status === 401) {

      return 'Your session has expired. Please log in again.';

    }


    if (error?.status === 403) {

      return 'You do not have permission to view cost history.';

    }


    if (error?.status === 404) {

      return 'The cost history endpoint was not found.';

    }


    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }


    return 'An unexpected error occurred while loading your cost history.';

  }

}