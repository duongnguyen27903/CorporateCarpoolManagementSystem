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

        private async Task<string> GenerateTokenForUserAsync(string email)
        {
            using var scope = _factory.Services.CreateScope();
            var services = scope.ServiceProvider;
            var unitOfWork = services.GetRequiredService<CarpoolSystem.Application.Interfaces.IUnitOfWork>();
            var tokenService = services.GetRequiredService<CarpoolSystem.Application.Services.TokenService>();

            var userRepo = unitOfWork.Repository<CarpoolSystem.Domain.Entities.Employee>();
            var users = await userRepo.FindAsync(u => u.Email == email);
            var user = users.FirstOrDefault();
            if (user == null) throw new InvalidOperationException($"User not found: {email}");

            var roleRepo = unitOfWork.Repository<CarpoolSystem.Domain.Entities.Role>();
            var role = await roleRepo.GetByIdAsync(user.RoleId);
            var roleName = role?.RoleName ?? "Employee";

            return tokenService.GenerateToken(user.EmployeeId, user.Email, roleName);
        }

        private async Task<(HttpClient client, string driverToken, string passengerToken, int vehicleId, int routeId)> CreateClientAndSeedAsync()
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

            // Create employees using the Application service to ensure consistent logic (password hashing etc.)
            var employeeService = services.GetRequiredService<CarpoolSystem.Application.Services.IEmployeeService>();

            var adminRoleId = db.Roles.First(r => r.RoleName == "Admin").RoleId;
            var driverRoleId = db.Roles.First(r => r.RoleName == "Driver").RoleId;
            var passengerRoleId = db.Roles.First(r => r.RoleName == "Passenger").RoleId;

            var dept1 = db.Departments.First().DepartmentId;
            var dept2 = db.Departments.Skip(1).First().DepartmentId;
            var dept3 = db.Departments.Skip(2).First().DepartmentId;

            if (!db.Employees.Any(e => e.Email == "admin@carpool.com"))
            {
                await employeeService.RegisterEmployeeAsync("Admin", "admin@carpool.com", "123456", dept1, adminRoleId);
            }
            if (!db.Employees.Any(e => e.Email == "driver@carpool.com"))
            {
                await employeeService.RegisterEmployeeAsync("Driver", "driver@carpool.com", "123456", dept2, driverRoleId);
            }
            if (!db.Employees.Any(e => e.Email == "passenger@carpool.com"))
            {
                await employeeService.RegisterEmployeeAsync("Passenger", "passenger@carpool.com", "123456", dept3, passengerRoleId);
            }

            // Save any changes from service registration
            await db.SaveChangesAsync();

            // Verify seeded users exist and password hashes verify correctly
            var adminUser = db.Employees.FirstOrDefault(e => e.Email == "admin@carpool.com");
            var driverUser = db.Employees.FirstOrDefault(e => e.Email == "driver@carpool.com");
            var passengerUser = db.Employees.FirstOrDefault(e => e.Email == "passenger@carpool.com");

            if (adminUser == null || driverUser == null || passengerUser == null)
            {
                throw new InvalidOperationException("Seeding failed: one or more users not created");
            }

            // Confirm password hashes are valid
            if (!BCrypt.Net.BCrypt.Verify("123456", adminUser.PasswordHash) || !BCrypt.Net.BCrypt.Verify("123456", driverUser.PasswordHash) || !BCrypt.Net.BCrypt.Verify("123456", passengerUser.PasswordHash))
            {
                throw new InvalidOperationException($"Password hash verification failed. AdminHash={adminUser.PasswordHash}, DriverHash={driverUser.PasswordHash}, PassengerHash={passengerUser.PasswordHash}");
            }

            // Vehicles for driver
            var driver = db.Employees.First(e => e.Email == "driver@carpool.com");
            int vehicleId;
            if (!db.Vehicles.Any(v => v.EmployeeId == driver.EmployeeId))
            {
                var v = new Vehicle { EmployeeId = driver.EmployeeId, LicensePlate = "TEST-1", VehicleType = "Sedan", SeatCount = 4, IsActive = true };
                db.Vehicles.Add(v);
                await db.SaveChangesAsync();
                vehicleId = v.VehicleId;
            }
            else
            {
                vehicleId = db.Vehicles.First(v => v.EmployeeId == driver.EmployeeId).VehicleId;
            }

            // Routes for driver
            int routeId;
            if (!db.Routes.Any(r => r.EmployeeId == driver.EmployeeId))
            {
                var z = db.Zones.ToList();
                var rt = new Route { EmployeeId = driver.EmployeeId, StartZoneId = z[0].ZoneId, EndZoneId = z[1].ZoneId, StartTime = new TimeOnly(8, 0), DaysOfWeek = "Mon-Fri", IsActive = true };
                db.Routes.Add(rt);
                await db.SaveChangesAsync();
                routeId = rt.RouteId;
            }
            else
            {
                routeId = db.Routes.First(r => r.EmployeeId == driver.EmployeeId).RouteId;
            }

            // Generate tokens using TokenService from the same scope to ensure same provider
            var tokenService = services.GetRequiredService<CarpoolSystem.Application.Services.TokenService>();

            var driverRoleEntity = db.Roles.First(r => r.RoleName == "Driver");
            var passenger = db.Employees.First(e => e.Email == "passenger@carpool.com");
            var passengerRoleEntity = db.Roles.First(r => r.RoleName == "Passenger");

            var driverToken = tokenService.GenerateToken(driver.EmployeeId, driver.Email, driverRoleEntity.RoleName);
            var passengerToken = tokenService.GenerateToken(passenger.EmployeeId, passenger.Email, passengerRoleEntity.RoleName);
            return (client, driverToken, passengerToken, vehicleId, routeId);
        }

        private async Task<string> LoginAndGetToken(HttpClient client, string email, string password)
        {
            var loginObj = new { Email = email, Password = password };
            var resp = await client.PostAsync("/api/auth/login", new StringContent(JsonSerializer.Serialize(loginObj), Encoding.UTF8, "application/json"));
            var content = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode)
            {
                // Log response body to help debugging
                throw new HttpRequestException($"Login failed for {email}. Status: {resp.StatusCode}. Response: {content}");
            }
            var doc = JsonDocument.Parse(content);
            return doc.RootElement.GetProperty("AccessToken").GetString();
        }

        [Fact]
        public async Task TripBookingCost_FullFlow_Works()
        {
            var (client, driverToken, passengerToken, vehicleId, routeId) = await CreateClientAndSeedAsync();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);

            // create trip by driver
            var createTripBody = new { RouteId = routeId, VehicleId = vehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            if (!createResp.IsSuccessStatusCode)
            {
                var err = await createResp.Content.ReadAsStringAsync();
                throw new Exception($"Create trip failed: {createResp.StatusCode} - {err}");
            }
            var tripDoc = JsonDocument.Parse(await createResp.Content.ReadAsStringAsync());
            var tripId = tripDoc.RootElement.GetProperty("tripId").GetInt32();

            // passenger books
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var bookResp = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            if (!bookResp.IsSuccessStatusCode)
            {
                var err = await bookResp.Content.ReadAsStringAsync();
                throw new Exception($"Create booking failed: {bookResp.StatusCode} - {err}");
            }
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
            var (client, driverToken, passengerToken, vehicleId, routeId) = await CreateClientAndSeedAsync();

            // create trip with 1 seat
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var createTripBody = new { RouteId = routeId, VehicleId = vehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 1 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            if (!createResp.IsSuccessStatusCode)
            {
                var err = await createResp.Content.ReadAsStringAsync();
                throw new Exception($"Create trip failed: {createResp.StatusCode} - {err}");
            }
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
            var (client, _, passengerToken, _, _) = await CreateClientAndSeedAsync();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var createTripBody = new { RouteId = 1, VehicleId = 1, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            Assert.Equal(HttpStatusCode.Forbidden, createResp.StatusCode);
        }

        [Fact]
        public async Task Driver_CannotCheckInOthersBooking_ReturnsForbidden()
        {
            var (client, _, _, vehicleId, routeId) = await CreateClientAndSeedAsync();
            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            // create trip and booking
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var createTripBody = new { RouteId = routeId, VehicleId = vehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            if (!createResp.IsSuccessStatusCode)
            {
                var err = await createResp.Content.ReadAsStringAsync();
                throw new Exception($"Create trip failed: {createResp.StatusCode} - {err}");
            }
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
