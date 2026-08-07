using System.Text;
using CarpoolSystem.Application;
using CarpoolSystem.Infrastructure.Sqlserver;
using CarpoolSystem.Infrastructure.Sqlserver.Persistence; // Thêm
using CarpoolSystem.Domain.Entities; // Thêm
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
    dbContext.Database.Migrate();

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

        // 1. Admin
        var admin = new Employee
        {
            FullName = "Admin System",
            Email = "admin@carpool.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            DepartmentId = 1,
            RoleId = 1, // Admin
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
            DepartmentId = 2, // Phòng Kỹ thuật
            RoleId = 2,       // Driver
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
            DepartmentId = 3, // Phòng Kinh doanh
            RoleId = 3,       // Passenger
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Phone = "0900000002",
            Address = "456 Passenger Avenue",
            DateOfBirth = new DateTime(1995, 8, 20),
            Gender = "Female"
        };
        dbContext.Employees.Add(passenger);

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