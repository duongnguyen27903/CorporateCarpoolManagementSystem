import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// ============================================================
// BOOKING
// ============================================================

export interface BookingResponse {
  bookingId: number;
  tripId: number;
  passengerId: number;
  passengerName?: string;
  passengerPhone?: string | null;
  passenger?: {
    fullName?: string;
    phone?: string | null;
  };
  status: string;
  cancelReason: string | null;
  checkInTime: string | null;
  createdAt: string;
}


// ============================================================
// TRIP
// ============================================================

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


// ============================================================
// ROUTE
// ============================================================

export interface RouteResponse {
  routeId: number;
  employeeId: number;
  startZoneId: number;
  endZoneId: number;
  startTime: string;
  daysOfWeek: string;
  isActive: boolean;
}


// ============================================================
// ZONE
// ============================================================

export interface ZoneResponse {
  zoneId: number;
  zoneName: string;
  latitude: number;
  longitude: number;
}


// ============================================================
// REQUESTS
// ============================================================

export interface CreateBookingRequest {
  tripId: number;
}


// ============================================================
// SERVICE
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:5147/api';


  // ==========================================================
  // BOOKING APIs
  // ==========================================================

  /**
   * POST /api/booking
   *
   * Create a booking for a trip.
   *
   * Backend:
   * Body:
   * {
   *   "TripId": 123
   * }
   */
  createBooking(
    tripId: number
  ): Observable<BookingResponse> {

    const body: CreateBookingRequest = {
      tripId
    };

    return this.http.post<BookingResponse>(
      `${this.baseUrl}/booking`,
      body
    );
  }


  /**
   * GET /api/booking/my-bookings
   *
   * Get bookings belonging to current employee.
   */
  getMyBookings(): Observable<BookingResponse[]> {

    return this.http.get<BookingResponse[]>(
      `${this.baseUrl}/booking/my-bookings`
    );
  }

  /**
   * GET /api/trip/{tripId}/bookings
   *
   * Get passenger requests for a driver's trip.
   */
  getTripBookings(tripId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(
      `${this.baseUrl}/trip/${tripId}/bookings`
    );
  }


  /**
   * PUT /api/booking/{id}/confirm
   *
   * Driver only.
   */
  confirmBooking(
    bookingId: number
  ): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.baseUrl}/booking/${bookingId}/confirm`,
      {}
    );
  }


  /**
   * PUT /api/booking/{id}/cancel
   *
   * Passenger or Driver.
   */
  cancelBooking(
    bookingId: number
  ): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.baseUrl}/booking/${bookingId}/cancel`,
      {}
    );
  }


  /**
   * PUT /api/booking/{id}/checkin
   *
   * Passenger only.
   */
  checkInBooking(
    bookingId: number
  ): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.baseUrl}/booking/${bookingId}/checkin`,
      {}
    );
  }


  // ==========================================================
  // TRIP APIs
  // ==========================================================

  /**
   * POST /api/trip
   *
   * Driver only.
   */
  createTrip(
    request: {
      routeId: number;
      vehicleId: number;
      departureTime: string;
      availableSeats: number;
    }
  ): Observable<TripResponse> {

    return this.http.post<TripResponse>(
      `${this.baseUrl}/trip`,
      request
    );
  }


  /**
   * GET /api/trip/my-trips
   *
   * Driver only.
   */
  getMyTrips(): Observable<TripResponse[]> {

    return this.http.get<TripResponse[]>(
      `${this.baseUrl}/trip/my-trips`
    );
  }


  /**
   * GET /api/trip/active
   *
   * Get active/open trips.
   */
  getActiveTrips(): Observable<TripResponse[]> {

    return this.http.get<TripResponse[]>(
      `${this.baseUrl}/trip/active`
    );
  }


  /**
   * GET /api/trip/{id}
   *
   * Get a single trip.
   */
  getTrip(
    tripId: number
  ): Observable<TripResponse> {

    return this.http.get<TripResponse>(
      `${this.baseUrl}/trip/${tripId}`
    );
  }


  /**
   * PUT /api/trip/{id}/status
   *
   * Driver only.
   */
  updateTripStatus(
    tripId: number,
    status: string
  ): Observable<TripResponse> {

    return this.http.put<TripResponse>(
      `${this.baseUrl}/trip/${tripId}/status`,
      {
        status
      }
    );
  }


  // ==========================================================
  // ROUTE APIs
  // ==========================================================

  /**
   * GET /api/route/{id}
   *
   * Get route information.
   */
  getRoute(
    routeId: number
  ): Observable<RouteResponse> {

    return this.http.get<RouteResponse>(
      `${this.baseUrl}/route/${routeId}`
    );
  }


  // ==========================================================
  // ZONE APIs
  // ==========================================================

  /**
   * GET /api/Zone/{id}
   *
   * Get zone information.
   */
  getZone(
    zoneId: number
  ): Observable<ZoneResponse> {

    return this.http.get<ZoneResponse>(
      `${this.baseUrl}/Zone/${zoneId}`
    );
  }

}