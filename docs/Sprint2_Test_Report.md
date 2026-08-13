# Sprint 2 - Integration & Test Report

Date: 2026-08-06

Overview
--------
Sprint 2 code implemented Trip, Booking, CostTransaction services, API controllers and unit tests. Automated unit tests executed locally and passed. Below are details, test instructions (manual), artefacts (Postman collection, FE doc), and observed unit-test outputs.

Unit test results
-----------------
Command run:
```
cd src/backend
dotnet test CarpoolSystem.Tests/CarpoolSystem.Tests.csproj
```
Output (excerpt):
```
Test summary: total: 15, failed: 0, succeeded: 15, skipped: 0, duration: 2.3s
Build succeeded with 1 warning(s) in 8.9s
```
All unit tests passed.

Manual / End-to-end test plan (execute using Swagger or Postman)
----------------------------------------------------------------
Preconditions:
- Run API: `dotnet run --project src/backend/CarpoolSystem.API/CarpoolSystem.API.csproj --urls http://localhost:5147`
- Ensure database is migrated: run EF migration if needed (see README)
- Create roles, departments, zones, vehicles, routes and users (register) or seed them.

Test scenarios
--------------
1) Trip flow (Driver):
- Login as Driver -> obtain token
- POST /api/trip (Body: RouteId, VehicleId, DepartureTime, AvailableSeats) -> expect 200 and TripResponse
- GET /api/trip/my-trips -> expect list includes created trip
- GET /api/trip/active -> passenger should see trip when status="Open"
- PUT /api/trip/{id}/status with {Status: "Completed"} by Driver -> expect 200; cost calculation triggered automatically
- Error: if Driver uses RouteId or VehicleId not owned -> expect 403 or 400 accordingly

2) Booking flow (Passenger & Driver):
- Login as Passenger -> token
- POST /api/booking {TripId} -> Booking created with status="Pending" and trip.AvailableSeats decremented
- Driver confirms: PUT /api/booking/{id}/confirm -> status="Confirmed"
- Passenger checkin: PUT /api/booking/{id}/checkin -> status="CheckedIn" and CheckInTime set
- Passenger cancel before checkin: PUT /api/booking/{id}/cancel -> status="Cancelled" and trip.AvailableSeats incremented
- Error: Booking when availableSeats == 0 -> expect 400

3) Cost flow:
- After trip completed and participants checked-in, automatic cost calculation runs.
- GET /api/cost/my-history?month=YYYY-MM -> expect list of CostTransaction records for the employee
- GET /api/cost/trip/{tripId} -> Admin only. Expect list of transactions for trip.
- Validate amount = round((distance_km * pricePerKm) / participantCount, 2)

Swagger / OpenAPI
-----------------
- All new endpoints are registered in the API and visible in Swagger UI (http://localhost:5147/swagger).
- DTOs include basic structure; XML comments present for main DTOs/controllers (where added).

Postman collection
------------------
- File created: `docs/CarpoolSystem.postman_collection.json` — import into Postman, update `{{baseUrl}}` to `http://localhost:5147/api`, set `{{token}}` after login.

Frontend integration doc
------------------------
- File created: `docs/FE_API_Integration.md` — contains endpoints, sample requests, auth flow and notes.

Observed issues & fixes
----------------------
- Implemented cost calculation call when Trip status set to "Completed" by TripService; this triggers CostTransactionService.CalculateCostForTripAsync.
- Unit tests initially passed; one compiler warning in EmployeeService about possible null reference was present (non-blocking).

Next actions (recommendations)
-----------------------------
- Perform manual end-to-end tests using Postman collection or Swagger following the scenarios above.
- Seed initial data for Departments, Roles, Zones, Vehicles, Routes, and Users to speed testing. I can add a small seeder if desired.
- Consider DB transaction or concurrency control when modifying AvailableSeats to avoid race conditions.
- Expand integration tests to simulate end-to-end flows (e.g., using WebApplicationFactory and TestServer in xUnit).

Files added
-----------
- src/backend/CarpoolSystem.Application/Interfaces/ITripService.cs
- src/backend/CarpoolSystem.Application/Interfaces/IBookingService.cs
- src/backend/CarpoolSystem.Application/Interfaces/ICostTransactionService.cs
- src/backend/CarpoolSystem.Application/DTOs/TripDTOs.cs
- src/backend/CarpoolSystem.Application/DTOs/BookingDTOs.cs
- src/backend/CarpoolSystem.Application/DTOs/CostDTOs.cs
- src/backend/CarpoolSystem.Application/Services/TripService.cs
- src/backend/CarpoolSystem.Application/Services/BookingService.cs
- src/backend/CarpoolSystem.Application/Services/CostTransactionService.cs
- src/backend/CarpoolSystem.API/Controllers/TripController.cs
- src/backend/CarpoolSystem.API/Controllers/BookingController.cs
- src/backend/CarpoolSystem.API/Controllers/CostTransactionController.cs
- src/backend/CarpoolSystem.Tests/*ServiceTests.cs (unit tests)
- docs/FE_API_Integration.md
- docs/CarpoolSystem.postman_collection.json
- docs/Sprint2_Test_Report.md (this file)

If you want, I can now:
- Add a seeder to Program.cs to pre-populate Roles/Departments/Zones and a Driver/Passenger for manual testing.
- Implement integration tests (TestServer) to automate the end-to-end flows.

Please tell me which of the above you'd like me to do next.
