using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using CarpoolSystem.Infrastructure.Sqlserver.Persistence;
using BCrypt.Net;
using CarpoolSystem.Domain.Entities;
using RouteEntity = CarpoolSystem.Domain.Entities.Route;
using VehicleEntity = CarpoolSystem.Domain.Entities.Vehicle;
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

                    // Add InMemory database with fixed name so seed and requests share same DB
                    services.AddDbContext<CarpoolDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb");
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

        private async Task<HttpClient> CreateClientAndSeedAsync()
        {
            var client = _factory.CreateClient();

            // Debug: check whether Program.cs seeding ran and employees exist in the shared InMemory DB
            using (var scope = _factory.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var db = services.GetRequiredService<CarpoolDbContext>();

                var count = await db.Employees.CountAsync();
                Console.WriteLine($"[IntegrationTests] Employees count: {count}");

                var driver = await db.Employees.FirstOrDefaultAsync(e => e.Email == "driver@carpool.com");
                if (driver == null)
                {
                    Console.WriteLine("[IntegrationTests] driver@carpool.com not found - seeding fallback data in test scope");

                    // Roles
                    if (!db.Roles.Any())
                    {
                        db.Roles.AddRange(new Role { RoleName = "Admin" }, new Role { RoleName = "Driver" }, new Role { RoleName = "Passenger" });
                        await db.SaveChangesAsync();
                    }

                    // Departments
                    if (!db.Departments.Any())
                    {
                        db.Departments.AddRange(new Department { DepartmentName = "Phòng Hành chính", IsActive = true }, new Department { DepartmentName = "Phòng Kỹ thuật", IsActive = true }, new Department { DepartmentName = "Phòng Kinh doanh", IsActive = true });
                        await db.SaveChangesAsync();
                    }

                    // Zones
                    if (!db.Zones.Any())
                    {
                        db.Zones.AddRange(
                            new Zone { ZoneName = "Quan 1", Latitude = 10.776889m, Longitude = 106.700806m },
                            new Zone { ZoneName = "Quan 2", Latitude = 10.780000m, Longitude = 106.720000m }
                        );
                        await db.SaveChangesAsync();
                    }

                    var adminRoleId = db.Roles.First(r => r.RoleName == "Admin").RoleId;
                    var driverRoleId = db.Roles.First(r => r.RoleName == "Driver").RoleId;
                    var passengerRoleId = db.Roles.First(r => r.RoleName == "Passenger").RoleId;

                    var dept1 = db.Departments.First().DepartmentId;
                    var dept2 = db.Departments.Skip(1).First().DepartmentId;
                    var dept3 = db.Departments.Skip(2).First().DepartmentId;

                    // Employees
                    if (!db.Employees.Any(e => e.Email == "admin@carpool.com"))
                    {
                        db.Employees.Add(new Employee
                        {
                            FullName = "Admin System",
                            Email = "admin@carpool.com",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                            DepartmentId = dept1,
                            RoleId = adminRoleId,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    if (!db.Employees.Any(e => e.Email == "driver@carpool.com"))
                    {
                        db.Employees.Add(new Employee
                        {
                            FullName = "Driver User",
                            Email = "driver@carpool.com",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                            DepartmentId = dept2,
                            RoleId = driverRoleId,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    if (!db.Employees.Any(e => e.Email == "passenger@carpool.com"))
                    {
                        db.Employees.Add(new Employee
                        {
                            FullName = "Passenger User",
                            Email = "passenger@carpool.com",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                            DepartmentId = dept3,
                            RoleId = passengerRoleId,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        });
                    }

                    await db.SaveChangesAsync();

                    // Vehicles for driver
                    var driverEmp = await db.Employees.FirstOrDefaultAsync(e => e.Email == "driver@carpool.com");
                    if (driverEmp != null && !db.Vehicles.Any(v => v.EmployeeId == driverEmp.EmployeeId))
                    {
                        db.Vehicles.Add(new VehicleEntity { EmployeeId = driverEmp.EmployeeId, LicensePlate = "ABC-123", VehicleType = "Sedan", SeatCount = 4, IsActive = true });
                        await db.SaveChangesAsync();
                    }

                    // Routes for driver
                    var zones = db.Zones.Take(3).ToList();
                    if (driverEmp != null && zones.Count >= 2 && !db.Routes.Any(r => r.EmployeeId == driverEmp.EmployeeId))
                    {
                        db.Routes.Add(new RouteEntity { EmployeeId = driverEmp.EmployeeId, StartZoneId = zones[0].ZoneId, EndZoneId = zones[1].ZoneId, StartTime = new TimeOnly(8, 0), DaysOfWeek = "2,3,4,5,6", IsActive = true });
                        await db.SaveChangesAsync();
                    }

                    var newCount = await db.Employees.CountAsync();
                    Console.WriteLine($"[IntegrationTests] Seeded employees count: {newCount}");
                }
                else
                {
                    Console.WriteLine($"[IntegrationTests] driver exists: {driver.EmployeeId}");
                }
            }

            return client;
        }

        private async Task<string> LoginAndGetToken(HttpClient client, string email, string password)
        {
            var loginObj = new { Email = email, Password = password };
            var resp = await client.PostAsync("/api/auth/login", new StringContent(JsonSerializer.Serialize(loginObj), Encoding.UTF8, "application/json"));
            var content = await resp.Content.ReadAsStringAsync();
            if (!resp.IsSuccessStatusCode)
            {
                // Log response body to help debugging and include in exception
                Console.WriteLine($"[IntegrationTests] Login failed for {email}. Status: {resp.StatusCode}. Response: {content}");
                throw new HttpRequestException($"Login failed for {email}. Status: {resp.StatusCode}. Response: {content}");
            }

            // Try parse JSON and return AccessToken, provide detailed error if missing
            try
            {
                using var doc = JsonDocument.Parse(content);
                // API serializes property names as camelCase by default (accessToken)
                if (!doc.RootElement.TryGetProperty("accessToken", out var tokenElem))
                {
                    Console.WriteLine($"[IntegrationTests] Login response for {email} did not contain accessToken. Response: {content}");
                    throw new InvalidOperationException($"Login response missing accessToken. Response: {content}");
                }
                return tokenElem.GetString();
            }
            catch (JsonException je)
            {
                Console.WriteLine($"[IntegrationTests] Failed to parse login JSON for {email}. Response: {content}. Error: {je}");
                throw;
            }
        }

        [Fact]
        public async Task TripBookingCost_FullFlow_Works()
        {
            var client = await CreateClientAndSeedAsync();

            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            // get seeded route and vehicle ids from the shared InMemory DB
            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CarpoolDbContext>();
            var driver = db.Employees.First(e => e.Email == "driver@carpool.com");
            var vehicle = db.Vehicles.First(v => v.EmployeeId == driver.EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == driver.EmployeeId);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);

            // create trip by driver
            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
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
            if (!confirmResp.IsSuccessStatusCode)
            {
                var err = await confirmResp.Content.ReadAsStringAsync();
                throw new Exception($"Confirm booking failed: {confirmResp.StatusCode} - {err}");
            }

            // passenger checkin
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var checkinResp = await client.PutAsync($"/api/booking/{bookingId}/checkin", null);
            if (!checkinResp.IsSuccessStatusCode)
            {
                var err = await checkinResp.Content.ReadAsStringAsync();
                throw new Exception($"Checkin failed: {checkinResp.StatusCode} - {err}");
            }

            // driver complete trip
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var statusResp = await client.PutAsync($"/api/trip/{tripId}/status", new StringContent(JsonSerializer.Serialize(new { Status = "Completed" }), Encoding.UTF8, "application/json"));
            if (!statusResp.IsSuccessStatusCode)
            {
                var err = await statusResp.Content.ReadAsStringAsync();
                throw new Exception($"Update trip status failed: {statusResp.StatusCode} - {err}");
            }

            // allow some time (synchronous in code, so immediate)

            // passenger get cost history
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var costResp = await client.GetAsync("/api/cost/my-history");
            if (!costResp.IsSuccessStatusCode)
            {
                var err = await costResp.Content.ReadAsStringAsync();
                throw new Exception($"Get cost history failed: {costResp.StatusCode} - {err}");
            }
            var costDoc = JsonDocument.Parse(await costResp.Content.ReadAsStringAsync());
            Assert.True(costDoc.RootElement.GetArrayLength() >= 1);
        }

        [Fact]
        public async Task Booking_WhenNoSeats_ReturnsBadRequest()
        {
            var client = await CreateClientAndSeedAsync();

            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CarpoolDbContext>();
            var driver = db.Employees.First(e => e.Email == "driver@carpool.com");
            var vehicle = db.Vehicles.First(v => v.EmployeeId == driver.EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == driver.EmployeeId);

            // create trip with 1 seat
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 1 };
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
            if (!bookResp1.IsSuccessStatusCode)
            {
                var err = await bookResp1.Content.ReadAsStringAsync();
                throw new Exception($"Create booking failed (first): {bookResp1.StatusCode} - {err}");
            }

            var bookResp2 = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            Assert.Equal(HttpStatusCode.BadRequest, bookResp2.StatusCode);
        }

        [Fact]
        public async Task Passenger_CannotCreateTrip_ReturnsForbidden()
        {
            var client = await CreateClientAndSeedAsync();

            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CarpoolDbContext>();
            var driver = db.Employees.First(e => e.Email == "driver@carpool.com");
            var vehicle = db.Vehicles.First(v => v.EmployeeId == driver.EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == driver.EmployeeId);

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            Assert.Equal(HttpStatusCode.Forbidden, createResp.StatusCode);
        }

        [Fact]
        public async Task Driver_CannotCheckInOthersBooking_ReturnsForbidden()
        {
            var client = await CreateClientAndSeedAsync();
            var driverToken = await LoginAndGetToken(client, "driver@carpool.com", "123456");
            var passengerToken = await LoginAndGetToken(client, "passenger@carpool.com", "123456");

            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CarpoolDbContext>();
            var driver = db.Employees.First(e => e.Email == "driver@carpool.com");
            var vehicle = db.Vehicles.First(v => v.EmployeeId == driver.EmployeeId);
            var route = db.Routes.First(r => r.EmployeeId == driver.EmployeeId);

            // create trip and booking
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var createTripBody = new { RouteId = route.RouteId, VehicleId = vehicle.VehicleId, DepartureTime = DateTime.UtcNow.AddHours(1), AvailableSeats = 2 };
            var createResp = await client.PostAsync("/api/trip", new StringContent(JsonSerializer.Serialize(createTripBody), Encoding.UTF8, "application/json"));
            if (!createResp.IsSuccessStatusCode)
            {
                var err = await createResp.Content.ReadAsStringAsync();
                throw new Exception($"Create trip failed: {createResp.StatusCode} - {err}");
            }
            var tripId = JsonDocument.Parse(await createResp.Content.ReadAsStringAsync()).RootElement.GetProperty("tripId").GetInt32();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", passengerToken);
            var bookResp = await client.PostAsync("/api/booking", new StringContent(JsonSerializer.Serialize(new { TripId = tripId }), Encoding.UTF8, "application/json"));
            if (!bookResp.IsSuccessStatusCode)
            {
                var err = await bookResp.Content.ReadAsStringAsync();
                throw new Exception($"Create booking failed: {bookResp.StatusCode} - {err}");
            }
            var bookingId = JsonDocument.Parse(await bookResp.Content.ReadAsStringAsync()).RootElement.GetProperty("bookingId").GetInt32();

            // driver tries to checkin booking (should be forbidden)
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", driverToken);
            var checkinResp = await client.PutAsync($"/api/booking/{bookingId}/checkin", null);
            Assert.Equal(HttpStatusCode.Forbidden, checkinResp.StatusCode);
        }
    }
}
