using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using CarpoolSystem.Infrastructure.Sqlserver.Persistence;
using CarpoolSystem.Domain.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace CarpoolSystem.Tests
{
    public class IntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public IntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove existing DbContext registration
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<CarpoolDbContext>));
                    if (descriptor != null) services.Remove(descriptor);

                    // Add InMemory database
                    services.AddDbContext<CarpoolDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb_" + Guid.NewGuid().ToString());
                    });
                });
            });
        }

        private async Task<(HttpClient client, CarpoolDbContext db)> CreateClientAndSeedAsync()
        {
            var client = _factory.CreateClient();

            // Seed data in scope
            using var scope = _factory.Services.CreateScope();
            var services = scope.ServiceProvider;
            var db = services.GetRequiredService<CarpoolDbContext>();

            // Ensure database created
            db.Database.EnsureCreated();

            // Roles
            if (!db.Roles.Any())
            {
                db.Roles.AddRange(new Role { RoleName = "Admin" }, new Role { RoleName = "Driver" }, new Role { RoleName = "Passenger" });
                await db.SaveChangesAsync();
            }

            // Departments
            if (!db.Departments.Any())
            {
                db.Departments.AddRange(new Department { DepartmentName = "Hanh chinh" }, new Department { DepartmentName = "Ky thuat" }, new Department { DepartmentName = "Kinh doanh" });
                await db.SaveChangesAsync();
            }

            // Zones
            if (!db.Zones.Any())
            {
                db.Zones.AddRange(
                    new Zone { ZoneName = "Quan 1", Latitude = 10.776889m, Longitude = 106.700806m },
                    new Zone { ZoneName = "Quan 2", Latitude = 10.780000m, Longitude = 106.720000m },
                    new Zone { ZoneName = "Quan 7", Latitude = 10.751000m, Longitude = 106.702000m }
                );
                await db.SaveChangesAsync();
            }

            // Create employees with plain password hashed via BCrypt
            if (!db.Employees.Any(e => e.Email == "admin@carpool.com"))
            {
                var adminRole = db.Roles.First(r => r.RoleName == "Admin").RoleId;
                var dept = db.Departments.First().DepartmentId;
                db.Employees.Add(new Employee { FullName = "Admin", Email = "admin@carpool.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), DepartmentId = dept, RoleId = adminRole, IsActive = true });
            }
            if (!db.Employees.Any(e => e.Email == "driver@carpool.com"))
            {
                var driverRole = db.Roles.First(r => r.RoleName == "Driver").RoleId;
                var dept = db.Departments.Skip(1).First().DepartmentId;
                db.Employees.Add(new Employee { FullName = "Driver", Email = "driver@carpool.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), DepartmentId = dept, RoleId = driverRole, IsActive = true });
            }
            if (!db.Employees.Any(e => e.Email == "passenger@carpool.com"))
            {
                var passengerRole = db.Roles.First(r => r.RoleName == "Passenger").RoleId;
                var dept = db.Departments.Skip(2).First().DepartmentId;
                db.Employees.Add(new Employee { FullName = "Passenger", Email = "passenger@carpool.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), DepartmentId = dept, RoleId = passengerRole, IsActive = true });
            }

            await db.SaveChangesAsync();

            // Vehicles for driver
            var driver = db.Employees.First(e => e.Email == "driver@carpool.com");
            if (!db.Vehicles.Any(v => v.EmployeeId == driver.EmployeeId))
            {
                db.Vehicles.Add(new Vehicle { EmployeeId = driver.EmployeeId, LicensePlate = "TEST-1", VehicleType = "Sedan", SeatCount = 4, IsActive = true });
                await db.SaveChangesAsync();
            }

            // Routes for driver
            if (!db.Routes.Any(r => r.EmployeeId == driver.EmployeeId))
            {
                var z = db.Zones.ToList();
                db.Routes.Add(new Route { EmployeeId = driver.EmployeeId, StartZoneId = z[0].ZoneId, EndZoneId = z[1].ZoneId, StartTime = new TimeOnly(8, 0), DaysOfWeek = "Mon-Fri", IsActive = true });
                await db.SaveChangesAsync();
            }

            return (client, db);
        }

        private async Task<string> LoginAndGetToken(HttpClient client, string email, string password)
        {
            var loginObj = new { Email = email, Password = password };
            var resp = await client.PostAsync("/api/auth/login", new StringContent(JsonSerializer.Serialize(loginObj), Encoding.UTF8, "application/json"));
            resp.EnsureSuccessStatusCode();
            var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
            return doc.RootElement.GetProperty("AccessToken").GetString();
        }

        [Fact]
        public async Task TripBookingCost_FullFlow_Works()
        {
            var (client, db) = await CreateClientAndSeedAsync();

            // login driver and passenger
            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);

            // create trip by driver
            var vehicle = db.Vehicles.First(v => v.EmployeeId == db.Employees.First(e => e.Email == "driver@carpool.com").EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == vehicle.EmployeeId);

            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            createResp.EnsureSuccessStatusCode();
            var tripDoc = JsonDocument.Parse(await createResp.Content.ReadAsStringAsync());
            var tripId = tripDoc.RootElement.GetProperty("tripId").GetInt32();

            // passenger books
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var bookResp = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            bookResp.EnsureSuccessStatusCode();
            var bookDoc = JsonDocument.Parse(await bookResp.Content.ReadAsStringAsync());
            var bookingId = bookDoc.RootElement.GetProperty("bookingId").GetInt32();

            // driver confirms
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var confirmResp = await client.PutAsync($"/api/booking/{bookingId}/confirm", null);
            confirmResp.EnsureSuccessStatusCode();

            // passenger checkin
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var checkinResp = await client.PutAsync($"/api/booking/{bookingId}/checkin", null);
            checkinResp.EnsureSuccessStatusCode();

            // driver complete trip
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var statusResp = await client.PutAsync($"/api/trip/{tripId}/status", new StringContent(JsonSerializer.Serialize(new { Status = "Completed" }), Encoding.UTF8, "application/json"));
            statusResp.EnsureSuccessStatusCode();

            // allow some time (synchronous in code, so immediate)

            // passenger get cost history
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var costResp = await client.GetAsync("/api/cost/my-history");
            costResp.EnsureSuccessStatusCode();
            var costDoc = JsonDocument.Parse(await costResp.Content.ReadAsStringAsync());
            Assert.True(costDoc.RootElement.GetArrayLength() >= 1);
        }

        [Fact]
        public async Task Booking_WhenNoSeats_ReturnsBadRequest()
        {
            var (client, db) = await CreateClientAndSeedAsync();
            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            // create trip with 1 seat
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var vehicle = db.Vehicles.First(v => v.EmployeeId == db.Employees.First(e => e.Email == "driver@carpool.com").EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == vehicle.EmployeeId);
            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 1 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            createResp.EnsureSuccessStatusCode();
            var tripId = JsonDocument.Parse(await createResp.Content.ReadAsStringAsync()).RootElement.GetProperty("tripId").GetInt32();

            // two passengers try to book (same passenger twice simulate)
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var bookResp1 = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            bookResp1.EnsureSuccessStatusCode();

            var bookResp2 = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            Assert.Equal(HttpStatusCode.BadRequest, bookResp2.StatusCode);
        }

        [Fact]
        public async Task Passenger_CannotCreateTrip_ReturnsForbidden()
        {
            var (client, db) = await CreateClientAndSeedAsync();
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var createTripBody = new { RouteId = 1, VehicleId = 1, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            Assert.Equal(HttpStatusCode.Forbidden, createResp.StatusCode);
        }

        [Fact]
        public async Task Driver_CannotCheckInOthersBooking_ReturnsForbidden()
        {
            var (client, db) = await CreateClientAndSeedAsync();
            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            // create trip and booking
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var vehicle = db.Vehicles.First(v => v.EmployeeId == db.Employees.First(e => e.Email == "driver@carpool.com").EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == vehicle.EmployeeId);
            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            createResp.EnsureSuccessStatusCode();
            var tripId = JsonDocument.Parse(await createResp.Content.ReadAsStringAsync()).RootElement.GetProperty("tripId").GetInt32();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var bookResp = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            bookResp.EnsureSuccessStatusCode();
            var bookingId = JsonDocument.Parse(await bookResp.Content.ReadAsStringAsync()).RootElement.GetProperty("bookingId").GetInt32();

            // driver tries to checkin booking (should be forbidden)
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var checkinResp = await client.PutAsync($"/api/booking/{bookingId}/checkin", null);
            Assert.Equal(HttpStatusCode.Forbidden, checkinResp.StatusCode);
        }
    }
}
