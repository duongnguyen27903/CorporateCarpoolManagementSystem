# Frontend Integration Guide — CarpoolSystem Backend (Sprint 2)

Base URL (development):
- http://localhost:5147/api

Authentication
--------------
1. Register (optional for seeding)
   - POST /api/auth/register
   - Body (JSON):
	 {
	   "FullName": "Alice Driver",
	   "Email": "driver@example.com",
	   "Password": "Password123!",
	   "DepartmentId": 1,
	   "RoleId": 2
	 }
   - Response: EmployeeResponse

2. Login
   - POST /api/auth/login
   - Body:
	 {
	   "Email":"driver@example.com",
	   "Password":"Password123!"
	 }
   - Response: { AccessToken, RefreshToken, EmployeeId, FullName, Role }
   - Use `AccessToken` in Authorization header: `Authorization: Bearer <token>`

Common headers for protected endpoints:
- Authorization: Bearer <AccessToken>
- Content-Type: application/json

Trip endpoints
--------------
- POST /api/trip (Driver only)
  - Body: { "RouteId": 1, "VehicleId": 2, "DepartureTime": "2026-08-12T08:00:00Z", "AvailableSeats": 3 }
  - Response: TripResponse

- GET /api/trip/my-trips (Driver only)
  - No body
  - Response: [ TripResponse ]

- GET /api/trip/active (Public after auth)
  - Response: [ TripResponse ]

- GET /api/trip/{id}
  - Response: TripResponse or 404

- PUT /api/trip/{id}/status (Driver only)
  - Body: { "Status": "Completed" }
  - Response: TripResponse

Booking endpoints
-----------------
- POST /api/booking
  - Body: { "TripId": 123 }
  - Response: BookingResponse (status = "Pending")

- GET /api/booking/my-bookings
  - Response: [ BookingResponse ]

- PUT /api/booking/{id}/confirm (Driver only)
  - Confirms booking -> status = "Confirmed"

- PUT /api/booking/{id}/cancel
  - Passenger or Driver (before check-in) may cancel -> status = "Cancelled" and trip.AvailableSeats++

- PUT /api/booking/{id}/checkin
  - Passenger only, must be Confirmed -> status = "CheckedIn" and CheckInTime set

Cost endpoints
--------------
- GET /api/cost/my-history?month=2026-08
  - Returns cost transactions for current employee, optional month filter (format yyyy-MM)

- GET /api/cost/trip/{tripId}
  - Admin-only (current controller restricts to Admin). Returns list of cost transactions for that trip.

Postman collection
------------------
- See `docs/CarpoolSystem.postman_collection.json` for a ready-to-import collection. It contains sample requests for Auth, Trip, Booking and Cost endpoints and placeholder variables for `{{baseUrl}}` and `{{token}}`.

Notes for Frontend integration
------------------------------
- Always call POST /api/auth/login to obtain AccessToken. Set `Authorization: Bearer <token>` for subsequent calls.
- Role-dependent endpoints require JWT role claim (e.g. Driver) to be present in token.
- Handle error codes:
  - 401 Unauthorized: missing/invalid token
  - 403 Forbidden: role or ownership violation
  - 400 BadRequest: business validation (no seats, invalid input)
  - 404 NotFound: resource not found

Seed data
---------
- If you need seed data, add code in Program.cs to create Departments, Roles and a few Employees, Zones, Vehicles, Routes. I can add a small seeder on request.

Contact
-------
- If any endpoint behavior differs from expectations, provide example request/response and I will adjust service logic.

Cập nhật lần cuối: 2026-08-06
