using System;
using System.Text;
using CarpoolSystem.Application;
using CarpoolSystem.Infrastructure.Sqlserver;
using CarpoolSystem.Infrastructure.Sqlserver.Persistence;
using CarpoolSystem.Domain.Entities;
using RouteEntity = CarpoolSystem.Domain.Entities.Route;
using VehicleEntity = CarpoolSystem.Domain.Entities.Vehicle;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpClient();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]
                    ?? throw new InvalidOperationException("Missing Jwt:Key")))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "CarpoolSystem API",
        Version = "v1",
        Description = "Corporate Carpool Management System"
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ============================================================
// 🔥 TỰ ĐỘNG MIGRATE VÀ SEED DỮ LIỆU
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CarpoolDbContext>();
    dbContext.Database.EnsureCreated();

    if (dbContext.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
    {
        dbContext.Database.Migrate();
    }

    Console.WriteLine("[Program] Starting seeding data (if necessary)...");

    // ==================== BASIC SEED ====================
    if (!dbContext.Employees.Any(e => e.Email == "admin@carpool.com"))
    {
        // Seed Roles
        if (!dbContext.Roles.Any())
        {
            dbContext.Roles.AddRange(
                new Role { RoleName = "Admin" },
                new Role { RoleName = "Driver" },
                new Role { RoleName = "Passenger" }
            );
        }

        // Seed Departments (few)
        if (!dbContext.Departments.Any())
        {
            dbContext.Departments.AddRange(
                new Department { DepartmentName = "Phòng Hành chính", IsActive = true },
                new Department { DepartmentName = "Phòng Kỹ thuật", IsActive = true },
                new Department { DepartmentName = "Phòng Kinh doanh", IsActive = true }
            );
        }

        dbContext.SaveChanges();

        var adminRole = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Admin");
        var driverRole = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Driver");
        var passengerRole = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Passenger");
        // Match seeded department names exactly (they include diacritics). Fallback to first department when not found.
        var deptHanhChinh = dbContext.Departments.FirstOrDefault(d => d.DepartmentName.StartsWith("Phòng Hành chính")) ?? dbContext.Departments.FirstOrDefault();
        var deptKyThuat = dbContext.Departments.FirstOrDefault(d => d.DepartmentName.StartsWith("Phòng Kỹ thuật")) ?? dbContext.Departments.FirstOrDefault();
        var deptKinhDoanh = dbContext.Departments.FirstOrDefault(d => d.DepartmentName.StartsWith("Phòng Kinh doanh")) ?? dbContext.Departments.FirstOrDefault();

        // Admin
        dbContext.Employees.Add(new Employee
        {
            FullName = "Admin System",
            Email = "admin@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = deptHanhChinh?.DepartmentId ?? dbContext.Departments.First().DepartmentId,
            RoleId = adminRole?.RoleId ?? dbContext.Roles.First().RoleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000000",
            Address = "Default Address",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male"
        });

        // Driver
        dbContext.Employees.Add(new Employee
        {
            FullName = "Driver User",
            Email = "driver@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = deptKyThuat?.DepartmentId ?? dbContext.Departments.First().DepartmentId,
            RoleId = driverRole?.RoleId ?? dbContext.Roles.First().RoleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000001",
            Address = "123 Driver Street",
            DateOfBirth = new DateTime(1985, 5, 15),
            Gender = "Male"
        });

        // Passenger
        dbContext.Employees.Add(new Employee
        {
            FullName = "Passenger User",
            Email = "passenger@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = deptKinhDoanh?.DepartmentId ?? dbContext.Departments.First().DepartmentId,
            RoleId = passengerRole?.RoleId ?? dbContext.Roles.First().RoleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000002",
            Address = "456 Passenger Avenue",
            DateOfBirth = new DateTime(1995, 8, 20),
            Gender = "Female"
        });

        dbContext.SaveChanges();
    }

    // ==================== DEMO SEED (luôn chạy nếu thiếu) ====================
    // Zones
    var zonesData = new[]
    {
        ("Quan 1", 10.776889m, 106.700806m),
        ("Quan 2", 10.780000m, 106.720000m),
        ("Quan 3", 10.774000m, 106.693000m),
        ("Quan 4", 10.747000m, 106.704000m),
        ("Quan 5", 10.762000m, 106.666000m),
        ("Quan 6", 10.754000m, 106.659000m),
        ("Quan 7", 10.751000m, 106.702000m),
        ("Quan 10", 10.770000m, 106.666000m),
        ("Thu Duc", 10.854000m, 106.766000m),
        ("Binh Thanh", 10.796000m, 106.713000m)
    };
    foreach (var (zn, lat, lon) in zonesData)
    {
        if (!dbContext.Zones.Any(z => z.ZoneName == zn))
        {
            dbContext.Zones.Add(new Zone { ZoneName = zn, Latitude = lat, Longitude = lon });
        }
    }
    dbContext.SaveChanges();

    // Roles (ensure)
    var requiredRoles = new[] { "Admin", "Driver", "Passenger" };
    foreach (var rn in requiredRoles)
    {
        if (!dbContext.Roles.Any(r => r.RoleName == rn))
            dbContext.Roles.Add(new Role { RoleName = rn });
    }
    dbContext.SaveChanges();

    // Departments (ensure 10)
    var deptNames = new[]
    {
        "Phòng Hành chính", "Phòng Kỹ thuật", "Phòng Kinh doanh", "Phòng Nhân sự", "Phòng Marketing",
        "Phòng Tài chính", "Phòng Pháp chế", "Phòng CSKH", "Phòng Sản xuất", "Phòng QC"
    };
    foreach (var dn in deptNames)
    {
        if (!dbContext.Departments.Any(d => d.DepartmentName == dn))
        {
            dbContext.Departments.Add(new Department { DepartmentName = dn, IsActive = true });
        }
    }
    dbContext.SaveChanges();

    // Employees (ensure ~10)
    var adminRoleEntity = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Admin");
    var driverRoleEntity = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Driver");
    var passengerRoleEntity = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Passenger");
    var depts = dbContext.Departments.Take(10).ToList();

    var sampleEmployees = new[]
    {
        ("Alice Admin", "admin.demo@carpool.com", adminRoleEntity?.RoleId ?? 0, depts[0].DepartmentId),
        ("Duong Driver1", "driver1@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Tran Driver2", "driver2@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[2].DepartmentId),
        ("Nguyen Driver3", "driver3@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[3].DepartmentId),
        ("Le Driver4", "driver4@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[4].DepartmentId),
        ("Pham Passenger1", "pass1@carpool.com", passengerRoleEntity?.RoleId ?? 0, depts[5].DepartmentId),
        ("Hoang Passenger2", "pass2@carpool.com", passengerRoleEntity?.RoleId ?? 0, depts[6].DepartmentId),
        ("Bui Passenger3", "pass3@carpool.com", passengerRoleEntity?.RoleId ?? 0, depts[7].DepartmentId),
        ("Pham Passenger4", "pass4@carpool.com", passengerRoleEntity?.RoleId ?? 0, depts[8].DepartmentId),
        ("Vo Passenger5", "pass5@carpool.com", passengerRoleEntity?.RoleId ?? 0, depts[9].DepartmentId)
    };
    foreach (var (fullName, email, roleId, deptId) in sampleEmployees)
    {
        if (!dbContext.Employees.Any(e => e.Email == email))
        {
            dbContext.Employees.Add(new Employee
            {
                FullName = fullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                DepartmentId = deptId,
                RoleId = roleId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Phone = "090" + new Random().Next(1000000, 9999999).ToString(),
                Address = "Demo Address"
            });
        }
    }
    dbContext.SaveChanges();

    // Vehicles (10)
    var driversList = dbContext.Employees.Where(e => e.RoleId == driverRoleEntity.RoleId).ToList();
    var vehiclePlates = new[]
    {
        "51A-12345", "59B-67890", "54C-11111", "50D-22222", "49E-33333",
        "70F-44444", "60G-55555", "52H-66666", "77K-77777", "51L-88888"
    };
    for (int i = 0; i < 10; i++)
    {
        var plate = vehiclePlates[i];
        if (!dbContext.Vehicles.Any(v => v.LicensePlate == plate))
        {
            var owner = driversList.Count > 0 ? driversList[i % driversList.Count] : dbContext.Employees.First();
            dbContext.Vehicles.Add(new VehicleEntity
            {
                EmployeeId = owner.EmployeeId,
                LicensePlate = plate,
                VehicleType = (i % 2 == 0) ? "Sedan" : "Van",
                SeatCount = (i % 2 == 0) ? 4 : 7,
                IsActive = true
            });
        }
    }
    dbContext.SaveChanges();

    // Routes (10)
    var zones = dbContext.Zones.ToList();
    var driversForRoutes = dbContext.Employees.Where(e => e.RoleId == driverRoleEntity.RoleId).ToList();
    for (int i = 0; i < 10; i++)
    {
        var owner = driversForRoutes.Count > 0 ? driversForRoutes[i % driversForRoutes.Count] : dbContext.Employees.First();
        var startZone = zones[i % zones.Count].ZoneId;
        var endZone = zones[(i + 1) % zones.Count].ZoneId;
        if (!dbContext.Routes.Any(r => r.EmployeeId == owner.EmployeeId && r.StartZoneId == startZone && r.EndZoneId == endZone))
        {
            dbContext.Routes.Add(new RouteEntity
            {
                EmployeeId = owner.EmployeeId,
                StartZoneId = startZone,
                EndZoneId = endZone,
                StartTime = new TimeOnly(8 + (i % 3), 0),
                DaysOfWeek = "2,3,4,5,6",
                IsActive = true
            });
        }
    }
    dbContext.SaveChanges();

    // Trips (10)
    var routes = dbContext.Routes.ToList();
    var allVehicles = dbContext.Vehicles.ToList();
    var tripStatuses = new[] { "Open", "Completed", "Cancelled" };
    for (int i = 0; i < 10; i++)
    {
        var rt = routes[i % routes.Count];
        var driverEmp = dbContext.Employees.First(e => e.EmployeeId == rt.EmployeeId);
        var vehicle = allVehicles.FirstOrDefault(v => v.EmployeeId == driverEmp.EmployeeId) ?? allVehicles.First();
        var departure = DateTime.UtcNow.Date.AddDays(i % 5).AddHours(7 + (i % 10));
        if (!dbContext.Trips.Any(t => t.RouteId == rt.RouteId && t.DriverId == rt.EmployeeId && t.VehicleId == vehicle.VehicleId && t.DepartureTime == departure))
        {
            dbContext.Trips.Add(new Trip
            {
                RouteId = rt.RouteId,
                DriverId = rt.EmployeeId,
                VehicleId = vehicle.VehicleId,
                DepartureTime = departure,
                AvailableSeats = 3 + (i % 3),
                Status = tripStatuses[i % tripStatuses.Length],
                CreatedAt = DateTime.UtcNow
            });
        }
    }
    dbContext.SaveChanges();

    // Bookings (10)
    var trips = dbContext.Trips.ToList();
    var passengers = dbContext.Employees.Where(e => e.RoleId == passengerRoleEntity.RoleId).ToList();
    var bookingStatuses = new[] { "Pending", "Confirmed", "CheckedIn", "Cancelled" };
    for (int i = 0; i < 10; i++)
    {
        var trip = trips[i % trips.Count];
        var passengerEmployee = passengers[i % passengers.Count];
        if (!dbContext.Bookings.Any(b => b.TripId == trip.TripId && b.PassengerId == passengerEmployee.EmployeeId))
        {
            var status = bookingStatuses[i % bookingStatuses.Length];
            var booking = new Booking
            {
                TripId = trip.TripId,
                PassengerId = passengerEmployee.EmployeeId,
                Status = status,
                CreatedAt = DateTime.UtcNow
            };
            if (status == "CheckedIn") booking.CheckInTime = DateTime.UtcNow;
            dbContext.Bookings.Add(booking);
        }
    }
    dbContext.SaveChanges();

    // CostTransactions (10)
    var transactionsMonth = DateTime.UtcNow.ToString("yyyy-MM");
    var completedTrips = dbContext.Trips.Where(t => t.Status == "Completed").ToList();
    var checkedInBookings = dbContext.Bookings.Where(b => b.Status == "CheckedIn").ToList();
    var created = 0;

    foreach (var b in checkedInBookings)
    {
        if (created >= 10) break;
        if (!dbContext.CostTransactions.Any(ct => ct.TripId == b.TripId && ct.EmployeeId == b.PassengerId))
        {
            dbContext.CostTransactions.Add(new CostTransaction
            {
                TripId = b.TripId,
                EmployeeId = b.PassengerId,
                Amount = 20000 + (created * 1000),
                TransactionMonth = transactionsMonth,
                CreatedAt = DateTime.UtcNow
            });
            created++;
        }
    }

    foreach (var t in completedTrips)
    {
        if (created >= 10) break;
        var bookingsForTrip = dbContext.Bookings.Where(b => b.TripId == t.TripId && b.Status != "Cancelled").ToList();
        foreach (var b in bookingsForTrip)
        {
            if (created >= 10) break;
            if (!dbContext.CostTransactions.Any(ct => ct.TripId == b.TripId && ct.EmployeeId == b.PassengerId))
            {
                dbContext.CostTransactions.Add(new CostTransaction
                {
                    TripId = b.TripId,
                    EmployeeId = b.PassengerId,
                    Amount = 15000 + (created * 500),
                    TransactionMonth = transactionsMonth,
                    CreatedAt = DateTime.UtcNow
                });
                created++;
            }
        }
    }
    dbContext.SaveChanges();

    Console.WriteLine($"[Program] Final seeded counts - Departments:{dbContext.Departments.Count()}, Roles:{dbContext.Roles.Count()}, Employees:{dbContext.Employees.Count()}, Zones:{dbContext.Zones.Count()}, Vehicles:{dbContext.Vehicles.Count()}, Routes:{dbContext.Routes.Count()}, Trips:{dbContext.Trips.Count()}, Bookings:{dbContext.Bookings.Count()}, CostTransactions:{dbContext.CostTransactions.Count()}");
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CarpoolSystem API v1"));
}

app.UseCors("Angular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();