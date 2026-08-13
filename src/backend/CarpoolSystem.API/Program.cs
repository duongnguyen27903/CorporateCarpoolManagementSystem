using System.Text;
using CarpoolSystem.Application;
using CarpoolSystem.Infrastructure.Sqlserver;
using CarpoolSystem.Infrastructure.Sqlserver.Persistence; // Thêm
using CarpoolSystem.Domain.Entities; // Thêm
using RouteEntity = CarpoolSystem.Domain.Entities.Route;
using VehicleEntity = CarpoolSystem.Domain.Entities.Vehicle;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net; // Thêm (cần cài package BCrypt.Net-Next)
using Microsoft.EntityFrameworkCore; // Thêm

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

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
// Cấu hình CORS
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
// 🔥 TỰ ĐỘNG MIGRATE VÀ SEED DỮ LIỆU (THÊM VÀO ĐÂY)
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<CarpoolDbContext>();
    // Ensure DB is created (works for InMemory as well)
    dbContext.Database.EnsureCreated();
    // Only apply EF migrations when using a relational provider. The InMemory provider used in tests
    // does not support Migrate() and will throw. Check the provider name before calling Migrate.
    if (dbContext.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
    {
        dbContext.Database.Migrate();
    }

    Console.WriteLine("[Program] Starting seeding data (if necessary)...");

    // Kiểm tra nếu chưa có tài khoản admin
    if (!dbContext.Employees.Any(e => e.Email == "admin@carpool.com"))
    {
        // Seed Roles nếu chưa có
        if (!dbContext.Roles.Any())
        {
            dbContext.Roles.AddRange(
                new Role { RoleName = "Admin" },
                new Role { RoleName = "Driver" },
                new Role { RoleName = "Passenger" }
            );
        }

        // Seed Departments nếu chưa có
        if (!dbContext.Departments.Any())
        {
            dbContext.Departments.AddRange(
                new Department { DepartmentName = "Phòng Hành chính", IsActive = true },
                new Department { DepartmentName = "Phòng Kỹ thuật", IsActive = true },
                new Department { DepartmentName = "Phòng Kinh doanh", IsActive = true }
            );
        }

        dbContext.SaveChanges(); // Lưu Roles và Departments để có ID

        // Lấy RoleId và DepartmentId một cách an toàn từ database (không dùng ID cứng)
        var adminRole = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Admin");
        var driverRole = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Driver");
        var passengerRole = dbContext.Roles.FirstOrDefault(r => r.RoleName == "Passenger");

        var deptHanhChinh = dbContext.Departments.FirstOrDefault(d => d.DepartmentName.Contains("Hanh"));
        var deptKyThuat = dbContext.Departments.FirstOrDefault(d => d.DepartmentName.Contains("Ky"));
        var deptKinhDoanh = dbContext.Departments.FirstOrDefault(d => d.DepartmentName.Contains("Kinh"));

        // 1. Admin
        var admin = new Employee
        {
            FullName = "Admin System",
            Email = "admin@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = deptHanhChinh?.DepartmentId ?? 0,
            RoleId = adminRole?.RoleId ?? 0, // Admin
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000000",
            Address = "Default Address",
            DateOfBirth = new DateTime(1990, 1, 1),
            Gender = "Male"
        };
        dbContext.Employees.Add(admin);

        // 2. Driver
        var driver = new Employee
        {
            FullName = "Driver User",
            Email = "driver@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = deptKyThuat?.DepartmentId ?? 0,
            RoleId = driverRole?.RoleId ?? 0,       // Driver
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000001",
            Address = "123 Driver Street",
            DateOfBirth = new DateTime(1985, 5, 15),
            Gender = "Male"
        };
        dbContext.Employees.Add(driver);

        // 3. Passenger
        var passenger = new Employee
        {
            FullName = "Passenger User",
            Email = "passenger@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = deptKinhDoanh?.DepartmentId ?? 0,
            RoleId = passengerRole?.RoleId ?? 0,       // Passenger
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000002",
            Address = "456 Passenger Avenue",
            DateOfBirth = new DateTime(1995, 8, 20),
            Gender = "Female"
        };
        dbContext.Employees.Add(passenger);

        dbContext.SaveChanges();
        dbContext.SaveChanges();

        // Final counts after full seeding
        Console.WriteLine($"[Program] Employees total: {dbContext.Employees.Count()}");
        Console.WriteLine($"[Program] Zones total: {dbContext.Zones.Count()}");
        Console.WriteLine($"[Program] Vehicles total: {dbContext.Vehicles.Count()}");
        Console.WriteLine($"[Program] Routes total: {dbContext.Routes.Count()}");
        // Logging counts after seed
        Console.WriteLine($"[Program] Roles: {dbContext.Roles.Count()}");
        Console.WriteLine($"[Program] Departments: {dbContext.Departments.Count()}");
        Console.WriteLine($"[Program] Employees (after initial add): {dbContext.Employees.Count()}");

        // Ensure Vehicles exist for driver
        // Ensure Zones exist (at least 2) so Routes can reference them
        if (!dbContext.Zones.Any())
        {
            dbContext.Zones.AddRange(
                new Zone { ZoneName = "Quan 1", Latitude = 10.776889m, Longitude = 106.700806m },
                new Zone { ZoneName = "Quan 2", Latitude = 10.780000m, Longitude = 106.720000m }
            );
            dbContext.SaveChanges();
        }

        var driverEmp = dbContext.Employees.FirstOrDefault(e => e.Email == "driver@carpool.com");
        if (driverEmp != null && !dbContext.Vehicles.Any(v => v.EmployeeId == driverEmp.EmployeeId))
        {
            dbContext.Vehicles.Add(new VehicleEntity { EmployeeId = driverEmp.EmployeeId, LicensePlate = "ABC-123", VehicleType = "Sedan", SeatCount = 4, IsActive = true });
            dbContext.Vehicles.Add(new VehicleEntity { EmployeeId = driverEmp.EmployeeId, LicensePlate = "XYZ-789", VehicleType = "Van", SeatCount = 7, IsActive = true });
        }

        dbContext.SaveChanges();

        // Ensure Routes exist for driver
        var zones = dbContext.Zones.Take(3).ToList();
        if (driverEmp != null && zones.Count >= 2 && !dbContext.Routes.Any(r => r.EmployeeId == driverEmp.EmployeeId))
        {
            dbContext.Routes.Add(new RouteEntity { EmployeeId = driverEmp.EmployeeId, StartZoneId = zones[0].ZoneId, EndZoneId = zones[1].ZoneId, StartTime = new TimeOnly(8, 0), DaysOfWeek = "2,3,4,5,6", IsActive = true });
            if (zones.Count >= 3)
            {
                dbContext.Routes.Add(new RouteEntity { EmployeeId = driverEmp.EmployeeId, StartZoneId = zones[1].ZoneId, EndZoneId = zones[2].ZoneId, StartTime = new TimeOnly(17, 0), DaysOfWeek = "2,3,4,5,6", IsActive = true });
            }
        }

        dbContext.SaveChanges();
    }
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CarpoolSystem API v1"));
}

// app.UseHttpsRedirection(); // Tạm comment nếu chưa có HTTPS
app.UseCors("Angular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();