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
using CarpoolSystem.Application.Helpers;
using CarpoolSystem.Application.Interfaces;

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
    var polylineService =
    scope.ServiceProvider.GetRequiredService<IPolylineService>();
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
        ("Binh Thanh", 10.796000m, 106.713000m),
        // places in Ha Noi
        ("TranKhanhDu",21.02244m, 105.86105m),
        ("MyDinh",21.03264m, 105.76543m),
        ("MaiDong",20.98365m, 105.86332m),
        ("SVDMyDinh",21.01949m, 105.76725m),
        ("BxGiaLam",21.04841m, 105.87836m),
        ("BxYenNghia",20.94980m, 105.74715m),
        ("BacCo",21.02318m, 105.86083m),
        ("BxGiapBat",20.98060m, 105.84151m),
        ("PhucLoi",21.04639m, 105.92374m),
        ("LongBien",21.04149m, 105.84932m),
        ("BxNuocNgam",20.96486m, 105.84211m),
        ("LinhDam",20.96365m, 105.83041m),
        ("PhuDien",21.05936m, 105.76474m),
        ("CauGiay",21.02916m, 105.80386m),
        ("NoiBai",21.21481m, 105.80117m),
        ("DongMy",20.91858m, 105.87366m),
        ("BoHo",21.03192m, 105.85207m),
        ("TuSon",21.12465m, 105.97127m), // Tu Son - Bac Ninh
        ("CVThongNhat",21.01724m, 105.84494m),
        ("HVNongNghiep",21.00471m, 105.93280m),
        ("CVNghiaDo",21.03984m, 105.79758m),
        ("DaiAng",20.90827m, 105.83033m),
        ("CVnuocHoTay",21.07585m, 105.81596m),
        ("HVcanhsat",21.06655m, 105.76249m)
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
        ("Vo Passenger5", "pass5@carpool.com", passengerRoleEntity?.RoleId ?? 0, depts[9].DepartmentId),
        ("Driver01", "driver01@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver02", "driver02@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver03A", "driver03A@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver03B", "driver03B@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver04", "driver04@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver05", "driver05@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver07", "driver07@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver08", "driver08@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver09", "driver09@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver10A", "driver10A@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver11", "driver11@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver12", "driver12@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver13", "driver13@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver26", "driver26@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId),
        ("Driver49", "driver49@carpool.com", driverRoleEntity?.RoleId ?? 0, depts[1].DepartmentId)
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

    // Vehicles (additional for specific drivers)
    var additionalVehicles = new[]
    {
        ("Driver01", "Sedan", 4, "11A-00001"),
        ("Driver02", "Van", 7, "51A-00002"),
        ("Driver03A", "Sedan", 4, "51A-00003"),
        ("Driver03B", "Van", 7, "51A-00004"),
        ("Driver04", "Sedan", 4, "51A-00005"),
        ("Driver05", "Van", 7, "51A-00006"),
        ("Driver07", "Sedan", 4, "51A-00007"),
        ("Driver08", "Van", 7, "51A-00008"),
        ("Driver09", "Sedan", 4, "51A-00009"),
        ("Driver10A", "Van", 7, "51A-00010"),
        ("Driver11", "Sedan", 4, "51A-00011"),
        ("Driver12", "Van", 7, "51A-00012"),
        ("Driver13", "Sedan", 4, "51A-00013"),
        ("Driver26", "Van", 7, "51A-00014"),
        ("Driver49", "Sedan", 4, "51A-00015")
    };
    foreach (var (driverName, vehicleType, seatCount, licensePlate) in additionalVehicles)
    {
        var driver = dbContext.Employees.FirstOrDefault(e => e.FullName == driverName && e.RoleId == driverRoleEntity.RoleId);
        if (driver != null && !dbContext.Vehicles.Any(v => v.LicensePlate == licensePlate))
        {
            dbContext.Vehicles.Add(new VehicleEntity
            {
                EmployeeId = driver.EmployeeId,
                LicensePlate = licensePlate,
                VehicleType = vehicleType,
                SeatCount = seatCount,
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

    //Routes
    var buses = new List<(string Id, string Origin, string Destination)>()
    {
        ("49", "TranKhanhDu","MyDinh"),
        ("26", "MaiDong","SVDMyDinh"),
        ("01", "BxGiaLam","BxYenNghia"),
        ("02","BacCo","BxYenNghia"),
        ("03A","BxGiapBat","BxGiaLam"),
        ("03B","BxGiapBat","PhucLoi"),
        ("04", "LongBien","BxNuocNgam"),
        ("05","LinhDam","PhuDien"),
        ("07","CauGiay","NoiBai"),
        ("08","LongBien","DongMy"),
        ("09","BoHo","BoHo"),
        ("10A","LongBien","TuSon"),
        ("11","CVThongNhat","HVNongNghiep"),
        ("12","CVNghiaDo","DaiAng"),
        ("13","CVnuocHoTay","HVcanhsat")
    };
    // 1. Map all ZoneNames to ZoneIds in a single query
    var zoneNames1 = buses.Select(b => b.Origin).ToList();
    var zoneNames2 = buses.Select(b => b.Destination).ToList();
    var zoneNames = zoneNames1.Concat(zoneNames2).Distinct().ToList();

    var zoneLookup = dbContext.Zones
        .Where(z => zoneNames.Contains(z.ZoneName))
        .ToDictionary(z => z.ZoneName, z => z.ZoneId);

    // 2. Fetch all drivers from the database (or sampleEmployees array)
    //var drivers = dbContext.Users.ToList();
    var drivers = dbContext.Employees.Where(e => e.RoleId == driverRoleEntity.RoleId).ToList(); 

    // 3. Link Bus Code -> Driver (where FullName contains Code) -> Zone IDs
    var assignedRoutes = buses.Select(bus => 
    {
        var (code, origin, destination) = bus;

        // Match driver whose FullName contains "01" (e.g., "Driver01")
        var matchedDriver = drivers.FirstOrDefault(d => 
            d.FullName.Contains(code, StringComparison.OrdinalIgnoreCase));

        return new
        {
            RouteCode = code,
            DriverId = matchedDriver?.EmployeeId,
            StartZoneId = zoneLookup.TryGetValue(origin, out var startId) ? startId : (int?)null,
            StartZoneName = origin,
            EndZoneName = destination,
            EndZoneId = zoneLookup.TryGetValue(destination, out var endId) ? endId : (int?)null
        };
    }).ToList();
    for(int i = 0; i < assignedRoutes.Count; i++)
    {
        var routeInfo = assignedRoutes[i];
        if (routeInfo.DriverId.HasValue && routeInfo.StartZoneId.HasValue && routeInfo.EndZoneId.HasValue)
        {
            if (!dbContext.Routes.Any(r => r.EmployeeId == routeInfo.DriverId.Value && r.StartZoneId == routeInfo.StartZoneId.Value && r.EndZoneId == routeInfo.EndZoneId.Value))
            {
                dbContext.Routes.Add(new RouteEntity
                {
                    EmployeeId = routeInfo.DriverId.Value,
                    StartZoneId = routeInfo.StartZoneId.Value,
                    EndZoneId = routeInfo.EndZoneId.Value,
                    StartTime = new TimeOnly(8 + (i % 3), 0),
                    DaysOfWeek = "2,3,4,5,6",
                    IsActive = true
                });
            }
        }
    }
    dbContext.SaveChanges();

    // RouteDetails
    var routeDetails = new List<(string Origin, string Destination, byte Direction, string EncodedPolyline)>()
    {
        ("TranKhanhDu","MyDinh",1,@"g}h_Cq~beSxFoA|B_@|E@tDk@Hr@Jx@?j@El@Ot@u@hEk@xCqH`BmBb@sBfKs@|DgBjJo@~Co@rCcAdEiB|IgE`U}EjXtPHnI@nHHrEAA~Fa@lLYtKWhH?~@?~@GjAI|CErDF`AZvAj@hB@^Bl@b@`ACdAo@nAqDxHoDvHy@YeB|EgA|C}@`Cy@pCk@xAIXs@bDI\MjAi@tEwAxPgAfNqBfQe@Lc@MuBs@SVdCzAgExD_F|C_AhA{@rDyA|KY`CY@URJ\C`@uAfFqCfHAXQFOHMREX@VDTeApBo@bAy@|@oCpCi@h@kBxBgCjCmCtCMV]n@c@xAKb@aBxHiA`FMr@{FaB_Ci@Um@o@Wc@^?vAkC`E}IvLUn@sGGKZ@fNCfJM`O[|OxH\`ACn@PbQl@b@r@?tCCp@AtAKhEEz@KlAKr@I`@k@hCaAfE}@`ESx@e@jCq@`DMd@wCnNf@RdCcLl@e@f@ItJtEvBbA~Bx@zF|@kEnTMb@OLINAXHPTFTGvLlCLi@sA["),
        ("TranKhanhDu","MyDinh",2,@"_}j_C}hpdSaJqBKOPi@lCcM~@gGgFy@kBg@m@UkB{@e@UeCoAoFiCS]I_@Es@`AqF`@gBfCwKf@wCJqAHgCHcCFsGNqB_F]oLWm@JmC?_B?{CKZwMHyPHoMBgJ`HG`JqMjD}Et@_@\k@bKlClAqElA}Fj@kC\oAXu@^m@z@aAfDoDzIeJ`DaFN?TDT?PGPKN_@AYhDsIfBaFGm@Uy@]e@CqAdBoMt@kCr@oAnF_E~AqAvBaBr@SRe@`Dy[HcAxSzE\QhDyHbCzAHSiKkHyIiFcDuB{@o@mKwMgKuMcB_CmC{DsBeDWYdBwPl@sFTiApAqEp@qBt@oCrJhD~EbBpGxB`L`ErAf@vDtA~D|AN?JQQSA_@k@kB[wAG_AD_EHqCDiAB}BZ_LRcHHqBL{DHaC@{FKuCyGgBoBc@kEaAyHmBP_ATiAPSBUIOQEQDILiHkBfDyPnGi[bBuIb@yBdA_GuJ{BgCy@OJS@MGIICI?QBKHGSw@o@eFKs@YuDE_@@OjAm@Rc@pB_@rHgB"),
        ("MaiDong","SVDMyDinh",1,@"yja_CwlceSS@AeBcEPqAHiKd@sBPkAH}CPuLd@{QhAaDJwCLaCNTxAwEVa]`B}DN^~KV`FMdS_@rIw@zMWtDKxItBbC~CjE`@`ACjK?pNg@t@cNG_OEqCLC`@Iv@Op@UdAYr@{@bBgA|AUd@sAxAgA`A}AhA{AbASBiBhAn@TdA~@ZVzArBNP~@tAjGjIjBxBjIlKERGTa@`AWn@_AtCaBjEeAfCqEhMoBjGeB~DKTo@bAiF`FyCbCaCtCu@`AMPsCjEsLfRKHe@n@uAhCw@hBIXi@fByDtJeG`Pi@tA{AZgD{AgB}@eEsByGaD{EgC]d@wEpDm@\yAnAcAn@OPWX_@r@O`@Od@Mj@Kl@WhBOhAM~@UlA[`Ba@~BYBOVLV?d@[jA_AvCoCjHAVODQLMPEX@XFRgApBo@bA{@z@mCrCi@h@}AhBONoBtBUTkCtCKNc@z@c@xAG^uApGMh@_@jBi@vBa@zAa@tB}@`Du@xDo@vCOnAMxCKrGClBGrB?x@E~DIhFEhGAbFE~BFrBD|DAl@AvAEtBG|ACn@Ej@Gf@Kn@EZUdA_@`B{@nDi@lCe@lB}@`F_EbRf@PhCoLf@]d@GzJxEvB~@x@ZdA\vAX`Dd@xJxA|IrAdEbA|A^r@XFZLRTFZBTKDEjHbBHTLLRF^A~Bv@`F~AbQ~A~B?pHg@MuB_BcA"),
        ("MaiDong","SVDMyDinh",2,@"yjh_CktpdS_@OuAYuCFwBl@sAbAwIo@{Cg@aCy@sA]g@KMOOISAQBWJgHeBOWKMOEOCQ@QJOJWEiHgBeAS}Dk@oBW_JoAyEu@{Bk@q@WiB{@a@ScCoA{DiBo@[KKKSIUCUCi@^}B`@uB\gBhCuKf@qCFg@NyDHaCBcCBsDCiA[mDBaBBkDD{EByDH{GN{HH_EDwA@o@F_AJs@|@iEd@oBz@}D~BmJlA_Gj@eCH]Ry@Tm@b@o@x@cAlCqCXYz@aA|GcHbDcFLAXDV?NGRML[?a@fDuIhBuEEy@m@eAQcAl@kDlAaIHu@Le@Pk@l@oAj@m@`Ao@rAiAp@a@tDwC^WxGjDbI~Dv@`@bEjBfF~B`HlDpAp@To@{As@yGgDUkAhBsE~CeIl@mBlD}IJWt@aC|@uBnA}Bd@m@JK`@s@xBmD~EuHrBcDrCcEdCyCzCcCrCsCvAsANSXc@rB}ErBoGrA{DzBeGxCyHlAsDTo@d@gAFS@OyD}EiA{Ai@q@_E_F}@kAa@o@eB{BmAeBkBeCxEqEbEsDtA{APm@TmCLyAR{@Lk@Ho@Bc@Ba@BiA@yAAiAIaCGcB^g@l@q@pAwCv@y@dAgAdFIbBPl@Tt@t@fAjAbAZx@@xD_@v@WJ}AQyD}DgFuAaB]o@HoHf@mFn@oM^gX@aDCwBUuDYiIhDQrWoA|BO~GWhE]`J[hF_@pOgAnHUKuAlBOpAKjKe@dBKlAG~AG@hBRE"),
        ("BxGiaLam","BxYenNghia",1,@"q_n_CwjfeSq@XC^iExA_@?O}V_DoPL[ZApDxDdAvAbLxYdIhTzF|NnBlDvGzGlExEtBlGp_@|pAAXMPaFbDU\uKzI{CtAcDpCkI`Kj@t@d@a@Py@hBaCfAYHKf@fCd@`C^bD?f@M@KFGLAH?JBHFHFDH@H?FAFEBAxCRlAHX?|BBlDCvFHlFJlED~ERxDTjAi@l@S`FoBz@MlBCfBInHEzA^vCr@{@dEm@zCg@rBaA`GoCxL|EF|DDjNBlIDvC@tCFxEECbG_@hLa@hNM`FAz@?t@QhFE|DF|@VjAn@rB@^Jd@Jb@Fv@GjAmA~B^T|AiCrASlA]tKlFnJxEtAr@jFpCxFjDfAn@dBr@z@`@vB|@rFxBlEhBtGfClDrAZJh@`@x@z@|BfDxBbD|EtHXlAvAbCp@jApE|HhAlBbFxI`CbE~EnIxChFlGtJjCjElAjCdFzHdKzOdEtGh@d@vEdIvHvLrBdDpHdLbEdGdA~AtFlHzGfJtEfG~DlFfFfHbDrE|D|FlAjB`@FtCjE|CzFpD~EhCvDjHrIvC~DhIbLlAbB|IbMnEfGvB|CfL~OvHxK~M~QzGlJjGjJr@lAtAdCzQxWfIlL{@r@G`AzA|B"),
        ("BxGiaLam","BxYenNghia",2,@"gwz~BuvldSFEbA~A`ADjAgAkOyTsCoEkM_RaEkG}C_FcAyAw@eAoAeBcAuA{BcDe@o@gK{NqFqHeFkHsKcOkFoH{EcHaAmAwQqVa@a@k@s@qCkDq@{@g@w@_@e@{A}Bs@eA{@gAs@iAuAgCo@eAg@s@mAoBkCyDcCoDkEgGgHuJkFaI_CgCuD_FqFiHcDqE{CoE{CgEgE}GsBmDiDsFqBcDsAqBSu@s@eAuB}CaFqIkB_DiFuIaDwEwDmFsA{BkD_GoAeCaBqCu@kAeEuH{EyHaAcB{EiI}EiIaCaEgA{@}CuEwCkEeD}E_@e@a@a@c@[UWQG_DkAeFkBsB_Aw@[}@_@yB}@kCeAiEgBeAa@_JyEaFqCeOuHcDaBgDeBMgAf@uAzAaCBEUUwA~AeBpBs@HaAYWGOQA_@i@eBIYSaAG_AB_B@iBHiCDkABiBDgBDeBJmDJyCDcBNoEBw@HkCFsBB}C?cBEyAC{@uA_@s@QgBc@yBi@a@IcOoDPaAJe@Je@HEFO?KEOKIM?KBGLcB_@iEgAmEaAmBc@eE_AmHeAgAQsB[aG_@}AIo@R}CfAoDnAS@eDh@aC[}Ei@mEi@Gb@}@SIAwAk@q@MWC{C]_BQq@cBHEDIBI?KAIEIIIEAGA?g@_@eDmAgG|AkBbB_BpLoJnGiFjAq@zA[j@QN]Cc@c@Uc@GgOeh@sHqW}FuSkBaEqCeDc@c@iI_JoDcIgD}JcFmMkEfL}A|G]@wB{EeDgHRk@fKsDUYsA`@"),
        ("BacCo","BxYenNghia",1,@"{ai_Ce}beSlJaChDi@nEH|Dc@RlC]nByApICNIBwBd@sA\}A\mBb@gE|@aATqA\m@`C{AnI{@vEg@hBw@nE}@|EeAhEc@vCqFkAWvAmBbJ{@jF_@`CqBzISb@k@rC[^y@n@g@r@cA~@{FpFsAxKgBlPjB\rB\bJvFpD|BtBt@|MxEvLdEjOtF`FtBFbAE|@sAfC`@XzAeClAUpAa@zKnFhMlGdFpCzFjDdAn@xGrC`MbFtGfClDtAXHn@b@t@x@dCrDjBnClC`EtA|BXjAhCnEpE|H~AnCnIzNxJxPvGjKpE|H`FdIbElGbEfGpEzGrF`JjL|QrNnTzQtVrEdGjNlR|GzJnAhBb@HrCjEzCzFrD~Ed@n@fBjCxCpDxClDlCnDjGtIjCpDbDrElCvD`ExFt@fAvBzCnDzExCdE|AzBvHnKdDrE~FhIz@jAlEhGnAfBx@pA~BjDrAlBp@jAv@rAf@`AjFrHbGxI~AzBfIlL{@r@AXpBzC"),
        ("BacCo","BxYenNghia",2,@"gvz~BgwldSrAnBV@lAoAuC}DyBkDyFeIgKoOkFwHyBkDm@}@iDoF_AuAkEaGwBaDoA_BeDyEaEuF_CeDmCwDsC}Do@_AiDuEwC_EYg@u@cAcE}FeDyE{A{BcAmAoEeGgCmDaC}C}B{CmAyAcEgFi@y@{BcDq@eA{@eAu@kAwAkCm@aAMOgBsC}BeDoC}DyCiEyCeEoL_P{B}CwD_FqKwNeKeOoF}IuEwH}CwEAIOg@q@gAuB_D}EuIg@y@mCkEgDgFmI}LqAiCiGcKgJ_PoEkHaAcBw@uA_BmC}B{DqBmDq@eAaCaEiA{@sB}CcFsHgCuDUYe@e@e@]UUUKkCaAiE}A{CqA{@]_FqBoHyCcBw@gB}@yLyGgTwKgDcBMgAf@yA`BcCWUiBtBsAzAs@HaAYWEYG{Ak@wAg@gDmA{By@sHmCgEyA_FgB{OwF}CmBwJaGv@{CrA{H\oBdA{FlAeGpAyGPcAj@{BJ[FGJElElA`AaGjBmIHg@^_B^mCbBsHXsAd@aCJe@VoAZwATeAj@aDbAeFz@mEReAfAcF}A_@wA]i@a@BK@MKOIA]B_AcGk@}EEs@RWlEyA~GmB"),
        ("BxGiapBat","BxGiaLam",1,@"ww`_Cmd_eSK?I?Mb@Qt@sCCuCAuGCoEAqOGaKI}NI}G?mIAeOCoNKa@IsCAaDCuFCkJIkGBoGDs@@yAHeB@o@NyACeIAkRI_XG_CBIsCwAc@aEaAsBe@{HkBgEcAP_AVmAFCDGBI?IAGEIXiBHi@d@aC`@oBbAkFr@eDPiAx@qE`CmLr@uCT{@t@{DrAmHjBuIfAyFXyA~@kF\gB@MD_@As@SeB{Dj@m@?QOKe@IG{BJkAN_BT_GzAmD|@wA^sB^KDaBn@aF~CqFnCmCnAiEnBgHhCqFrB{KbEUXuAt@iFtB[NqBlAqAbAQBs@n@MHoGdFk@h@kC`AcBtA|@z@PQzCeChFoEzBgBf@g@RCx@q@l@c@^YXQtA_@T?h@QLMBQ?SEKKOWIQ?IAIEc@cBgB}F}D}MaLk`@iCoJcBmFaBqG{@qB}@uAk@s@wByBcE_EoA{AeA}AgB}Dw@sBgAeDaBuE_FyLy@jB_AnCu@lBaA`DkAvEiCgG}CgH?k@f@GtC_A|EoB[_@eC|@"),
        ("BxGiapBat","BxGiaLam",2,@"w`n_CwjfeSSH@r@i@RcBh@q@Vg@DCwBAuBAwBC_FAwBAaAQgAuAcH}@kEI[Si@jBvAdAz@j@h@hApAVj@l@tAnC`H`B~Dh@fBxC~HlG`PtD`KdA`C~@fBb@r@l@x@lCrCdB|AdBbBl@p@n@~@h@lA\|@n@jBlBpGxBtHnKt^tDxM|EdPH^CPCHKLyCfB{AvAq@l@OHiBzAyEvDcC~@aBpA~@|@|AsArD}CpEsDl@g@f@i@JQ`Ay@x@m@NKjB_AjCkAdCgAx@]bFgBbBm@rE_BnDwAtBw@b@QdDkAhGyBfDmAbBy@~BmBvCmBjLyClFsAhCa@vE@xDk@TrB?h@UbBwBdL}@jEqAlGk@rCo@dDi@~Ca@lBaAxDwA~GoGj\g@bCa@nCCCEEM?KDGFCN@HBJHDJBB?DAi@nCgAfEaAtFpEDlIBdFBrADhECzIChHDdIBvKD~IBxPHzEBbGCjCCpFLxK?lCC^EbFBlJFfHDx@?r@H`IFbA@~LHrHDhKD|G@fJ@jA?z@BnIDbML~NA@WaPOGe@QQKa@_CC"),
        ("BxGiapBat","PhucLoi",1,@"kw`_Cmd_eSa@?Od@Or@{BC_FAaFCkEAoFCcLG_GEmDA_FE_A?u@AiB?qC?_@?cI?oOEqNKg@IgCCcCCkKCiDGK?cOFoCD_BHaB?i@N}AAgXGeCE_IAkJEuFBKuCyGeBsBc@cOoDP_AVmAHEDG@G@ICIEGTwALy@jC}MfAqFvD_SbAyD~@yEv@mEhBsIX{AtBgKj@oDVmAHa@@KBa@?k@UmBuDh@G@k@?OOKe@KGcCDeAT}ATmLxCwA^qB^MD_Bn@cDrBaAl@qDfBeCnAgAd@iEpB}DvA_GvByAj@yEdByBx@kAd@QV{CvAyD~AwBpAqAbASBq@l@MHuGlFe@^ULoBr@YPqAfA~@z@\Y|CgCzAqA`DiCx@s@^[h@i@PChCoBXQtA_@RAd@OPMBQ?OCMEIIGSIQ?I?IGe@cBsCkJcHiV}Jw]oByGmBcHu@kB]m@y@kAqByBa@a@_EyDgAqAo@}@u@sAsAwCc@iASi@o@oBc@oAwAyD}E{Ly@wB}CeIgCsGaAqCk@uAkAiBqAwAsDyCaHgFwIsGy@m@Y_@KWIs@@q@@g@EYW]c@OOAW@SDgAFq@Ek@Sm@_@_BqA{AkAoA{@kBmBgDkDmCqCiDoDwC_D{@_AcF{EsBcBgEeEy@u@aX{VoFcFbS_WRFTAPGRUDO?QAQGO|@iA`C}CLKFE`@M|AWnCi@pAU\CN?R@XHdA^dE|AxHrCr@XFFLKtS}JvJqEjAi@lHdQ`NoGtN{GXE^\v@T|@Az@o@Rc@J_AKu@s@w@m@Qm@AwR}f@QcBty@_`@bDsCaE{CeAqBwAkEcFxBaP`HmDyFe@m@_FbDfAlCdAlCnCeA"),
        ("BxGiapBat","PhucLoi",2,@"}rm_CkfoeStTiJ|BeAdBaA~B|GtDdD}DfDq{@la@h@pAxSxg@OLOd@E^D|@iOjHyCtAa@TuGzCuGqPeKvEcD|AiQpIIIaHmCiFkBgC}@[Ea@?gBXyFfAWHOHIF[^oA~AyAjBKEQAQ@OHOVET@TFPgIfKoIpKbIfIXV\RjMtLn@p@Z\x@t@nI|HtBdBvEzEhA`Av@p@vFzFlExElDpDLNfA|@jAt@rAfAj@b@h@b@jDdCJRp@l@nCpB\VhE|CpAbAzAnAf@`@hAz@bDfCrB|AbAx@d@f@b@h@l@x@\n@Xt@fAjCxBrFt@hBh@hBtArDdAjCbEfKdAvCvAtDbBrE`AzB~@hBv@hAfCrCjBdBXVlBhBb@j@n@~@R\f@lAl@fBzA~EhBfG`HjVvOfi@Vz@Lh@ANEJMLeBdAq@`@yAtAq@l@MJmBzAqEpDSJkBp@mBzA|@z@fFkElHcGf@g@FQfBwAd@[jB_AfAe@l@YhDyAj@Wf@QtAg@`Bm@hBo@tAe@lAc@fHmCtFuBlLeElB}@zBmBtCgBdLcDtFkAdCa@fD@t@AtDi@TlB?j@El@Ot@u@hEk@vCqApGmBdJ_AbFk@|Ca@nBaAvDwAbHiDlQeB|Ie@~Bc@pCIIK?KBIJCJ@JBJDBDBH@HAk@nCcA~DcA|FnED~UJtB?tGEpJDhWJzD@rB?jFBjFBpHBrGClCAnFLtEBdECdCCd@E`UNlFBp@FbGFfC@dEBxFDxDBxB@nNDzOBxA@^@pKFlKJ~NA@_@_PGGe@QQKa@_CCsaLmiLXE^\v@T|@Az@o@Rc@J_AKu@s@w@m@Qm@AwR}f@QcBty@_`@bDsCaE{CeAqBwAkEcFxBaP`HmDyFe@m@_FbDfAlCdAlCnCeA"),
        ("LongBien","BxNuocNgam",1,@"itl_Cgu`eSfAoAHGfAYdBwBlCgC~IoHrC_Cj@m@JQbBwAf@[fCmA`@LHHFZn@DnEKvA?nC?|AOnCOhHgBlEeAhCy@tBk@RQpBl@xHvA~InBjBeJp@{DvCs@lCi@tM}CjAIpCv@|Al@V@nAG~A_@tIqBdD]pAOHGHb@~BlDnCiBz@y@\YjLsIb@?\NGBEFAPJPAzCV?D{CFK@MlANzEUhCWrVmAjDQpQaAbI]xGYhWwApF]?aBaEXlBuBhB_BrAuAfFgF|DoDfBeB~DkHNUt@aAv@qAlAsBrAeCv@qBdBcGRy@bBgGjCwJlBwGhFiSrA{DxByGj@kAXgD^oHj@uHr@uHp@l@tBrBz@fAfA~@vAx@lBvAdBrA~@`An@l@~ApBnArBzAbDt@vAx@tAdBjCxBdCnC`C`@VpGfE|GfE|F~DdCrBfAfAz@|@lA~AlBbDN\fA|Bx@rCv@~Cj@~DNxBNfOSrGBlBn@|ONfD@zGQ`DqChYmCpYk@xGOnGBjCG~AUfA[~AGbA?z@L|@R|@ZhAJfBB`@@lA@`AFzJ?tAWr@@XxA?bF?bPCjLmAvL{ACa@wRhCqBPsBP}HFeDKyCC"),
        ("LongBien","BxNuocNgam",2,@"ku}~Beh_eSoB?Y??Y?qA@kCBuDBgBGm@?qNG_KDaAFwCDcAdAyMlAeMv@gIrAaOb@qETwDDyB?aDCeC?QBkAFmCHmDCaD?e@UsD?_BIcCOsE]eFWaDy@_GmAoEkAaDsAcCkAmBc@o@cBuBsAqAcCsBaFiDeJ{FyFsDaBqAu@u@e@e@eBwBmAcBmBsDkBsD}@{AkBkC}CqDqAyA}@}@cAuAqAmAeBiA}D}Co@fEu@dJi@vHMlDe@rEm@tAyAnE_CfH{BbJiAfEuBrHoAlEsD|McBlGgApCuEbIgArA_@v@kAzBkArBeCbC_Az@oEfEsEpEuBjBcBhB{Kp@gADeBF}CLmBL^~AaFTqJb@oQ~@yP~@i@EcE\eMt@]@c@Ao@MCMMIM@AA]M]A}@n@}IrGw@j@y@x@u@f@mExCuExBqElBkJjEkB`A_Bj@YBgAUyFkAyCw@sDw@kCm@eCe@_B]yA_@g@a@BK@MAICIIGKEIAKBQLCJ?PBHc@XwKpC_Df@QSsGyAiC_@eIvDuB`@wB^}BnA{@\iAd@m@JqAHkANaBe@qAl@iBfAm@b@m@f@SDq@l@MFuEtDiBzAQHoBt@YPmB~AoAfAmBvBDF?DIf@MXq@x@k@p@CB"),
        ("LinhDam","PhuDien",1,@"ym}~Ba_}dSYgDs@mI_CV}ALp@zHt@|IsAHc@ESh@n@jG^lFV~DuL_By@{@cCiCy@eA{@mB_CwEa@tBmDxIeAzCe@jB}@~Eu@Es@Kw@Ky@IiCUeBM{B@eDAuDBu@JaAPgD~@a@X_Ax@kBdDoAjCg@hAw@dCiAlEKXo@lB]fASb@O`@a@x@}@vAeAxAgAdBoA~A{@dAmAdAy@v@}@t@kAv@aB~@mD~A}@h@}C|AiAd@}Ct@mBTq@PcAJYBc@JaACkFa@iDY{B_@kAQe@S_H_BeCk@}Bi@uA[gE~CSHQF_@BkB?}@@UD_@DqBr@WLoBcDMFdCjEUPrBnDrFpJdChErIjN}GnF}IbHgO|Kw@f@eEnCsDjCsC`CcObLgF~DkS|OAEGIICI?M@IFEFCN?PFLaBnAoBvAiCnB_K}OsAuB{A~@_FrBaB~@qIvEwEbC{DxB_CrAsGvCeK|F{FxCiJnEa@FIIQEQCU@M@QHMJQZC^DZJPFdAYhFUhDqCh[E`BKdAk@~Hi@xGw@lCeAxAiEzBkE~BeCdCqAtEyBzQyDdQIn@y\eI}@Oo@tDkBhI}E`T{AhFcDqBc@[k@UoHgC}FyBkB[c@IiBm@oCkA[j@qJY{CE}@EcGWiH_@aTu@{HyAa@CiAQ"),
        ("LinhDam","PhuDien",2,@"_dp_CsdpdSxBZnGnAnERxENnFRfEP|H`@nCJpHLrEPn@x@fCfAh@Rb@mAz@TbBP`G|BnItC^RpDdCUx@TNl@iCpAgEdCaKn@mCP_@nAsFvAwHj\zIj@^n@AFo@D_AvDiRXs@Dy@Ki@jBsLf@qC`CsClFcDvDqBrAaChBgNd@mG|@gLtAkQ~@kL`@m@NELGRQJOBW?UT[dEuBdAi@dDaBbEwBzD{B~C{AdQ_JfJgFbG_D`FiC~@e@zA_ArCjErDbG~BpDxFaEjHwFfHkGvDuC`Ae@`DgCzHyFxAgAbA{@nKqI|\kV`MwJvC|E~FjJ`Ay@aIiLsByDaGaK}KqR{CaFnBs@bAKd@AtB?`@EXITOpByAfA{@tAZvCn@hEbApCp@v@P^R`ANvAPpARv@DvCVvAJjAH~@D`@Mn@EnEo@xCu@dJmEpGgDvEeEzC_ElC{D~@aBp@aBf@}AvDmM`@{@f@eAd@aAb@y@lAsB|@{@d@U^MtCy@tAQ~@E`LCvDZzBRdBVzBNjBoIPk@nA{D~C_HvBhExDxEdA|@^J|ARxHdAQeCsAyPPa@\BZ?bHs@]_DkxMnfK}@Oo@tDkBhI}E`T{AhFcDqBc@[k@UoHgC}FyBkB[c@IiBm@oCkA[j@qJY{CE}@EcGWiH_@aTu@{HyAa@CiAQ"),
        ("CauGiay","NoiBai",1,@"ggj_CcywdS}A`Ek@`BC\SFOHKRGX@XDReApBq@bAy@|@mCrCi@f@mBxBeCjCuC|CkFy@kD_@mDAgMR}HPy@AgAAcCIwG@yD?}@n@aHCk@I?tC@~AErC@|F?vE?z@?hDBvB@xF?dP@|EFx@@pJ?|GAbCe@vAUb@[Zq@BmGU{FOUF}EMyJ[cEUy@EgHy@cEo@}Eu@qF_A_@SqFy@{F}@iHeAuHkAaAYgJwAoKmAyCKuDQuOg@wACqFUgESsAQeBg@gD_B{I}EqCaAy@My@SaBKoC?w@DuCZyU~FkHbBiGzAyAXmAF}@B_HU{FOcdAmDwTs@uBPyBCm@r@_JrBcJpBoH`BaK`CgGxAaKbCmLhCy@ToAJcAJ}AXaFnAyDz@[DO@OASAMI[Ge@FQFSRKPALYR[L_AVwA^o@RaB\k@NwA\o@ReAb@QLuCp@mCn@gHbBuDz@mEp@cCVyCR{@@iC@}KWqJMuLMkGK}JUyKQgKQkJQgIMcLQsNYcHIeOSgUa@eNScSYeKMaLOeOS_NS{QUwNUs@Eq@CkACkMOcKKgKIaHEuC?}BBeHZkUnAsKh@mA@qHb@_CPgJf@}Q`A_Mp@gH^uDPuJ^eACwAIeAUu@_@i@]m@e@o@u@q@aBYkAIoA?kAb@mE|AwHvFcYbG}Y~ByLlF}XfDoPxBmMhBuIaAS_@?yDnSeDq@}@pEk@OWv@"),
        ("CauGiay","NoiBai",2,@"qon`CihwdSV}@jCt@HP{AjIAnDiA`Gq@FmAxGkDdBmGxZ_B~JpAjEgBlJ`@n@_DtPeAdFOt@UfBCp@D|AD`@XnAf@lAf@r@`@f@v@n@`Ad@t@Rl@Jl@FxAA~AEdFYbO}@tAIbLe@rHa@xI_@jF]rDQnDOpGc@tBMjLm@jJg@fMo@dDIbDAlIJtFHzMPfIR|DDrBBdA?jJJrQTjLNvKLzPTrOPxMPtKRtS\pMRnJR|FHtU^tLP|JPlKPtMR|JRnNRxMRjMRjD?bBChCMdD_@tB[bGwArKiCjAYL@^AXCzAWr@MnBe@xEkA`B_@X?R@\HXJN@P?JCJGb@YJSDMJQVQr@UzD}@rD{@x@WhAc@VOhD}@hAWbFgA~EcAlDu@jCi@~DkAbG{A`Ck@jDy@|D_AhE_A|FoAzCu@xDy@`AMTArAAN?pCHhDJzENpEL~CJbDJrENlGRvOj@rTr@rIXfDH`BFpA@nAIx@ObAShDy@pJ_CzHiBjIqB|A]bAQ`BOl@El@?zAFz@F~AVjA\xB~@f@TlFzCvBbAvD|ArATpAJ|J\|CNhGPlFRzFT|D\`Fj@lG`AbC^jFz@bHhAtAT`@BhFz@dFz@pBZ`Er@rEt@NJx@L\HnFl@fE^tJ`@|CLpIT`Od@~CNB_ACeC?gDAoC?{SAs\?qAA{ICuMBuFdH@xT@b@@`B?dDQtBrBN~CVh@bBzAfBnBl@pAQHIJINCR?XFNVTFDL?F@LANKJOFS@IAKx@TbDz@|Bl@nA[v@{ClA}Fj@eC\uATm@^o@f@m@dAeAxB_Cx@}@vBwBhDsD~C}ELCTDV@REPMN]?a@Xs@Zy@^{@jB}E"),
        ("LongBien","DongMy",1,@"gtl_Cgu`eSdAoAHGfAYHKnA{ALOn@m@t@q@HMjAaAnC_ChEkDhB}ADCp@SfCoBl@[`@QnBUl@DpEKvA?lC?lBQbCMrEkA`HcBhCu@tBm@RQnBl@fDj@tCj@hBd@rFhAfCl@x@VzAb@aBrIo@nCcAfEz@RD@zElAlFlAv@VvEz@\HrAXlJZjDFrDHfJCdEKvANdCJjBBvEkEhBoBl@g@`@m@LSONHCBKRc@^UhBDdCHxAH~@NhHXvDPdAD|AN[dDEbAGhF?v@DRfB`CjCfDj@r@HPDX?hB?x@ChAbBe@b@Mx@KjC?t@Ah@IZKv@[bA_@n@KpAGLClACd@Cb@?b@?L@~@NpAXiBnL_@xBSj@e@zDSlAK`@OPzBDrI?x@GbKH`LHrIDvID`N@pE@tA?l@BxLHvDBfDDhJAbH@zJB|J@v@?`ACTEjIyAnHmAjBWlAGbJIx@?xA@hC?dPG`BGjIcAnAMz@K`AM`BUlCa@dEi@dFo@^ElEk@xDg@|Dg@pC[|AKpFYLA|CEzC@xEDfAClAAbBInAG~BCh@@t@Fh@D|Df@fAPrAJbCLxBFjAAjAIr@Ib@K|Ae@lA[zAa@lDeAbHuB`DaAxEuAjHuBlBg@lCw@nGiBbHwBhBg@`A_@~DsBxH{Dr@aKVeAhBcCh@}@x@oCfA}E`@kCNkA^aDV_@h@m@r@w@n@o@XWLOJOTe@Jc@ZeBj@gDj@sDR_BCc@Gc@QoAEQGMTg@?AFKhA_Bh@y@p@aARY^k@^o@JO\g@~@s@dA_AnCkCvAsAjDeEpA{AtBeCvDmEJWLu@HcAAcBKs@Qq@c@w@]g@UM{QkJ"),
        ("LongBien","DongMy",2,@"ctt~BkmeeS|MrGbB|@NLRPJL^j@`@n@Pr@Jp@@x@?j@IbAOt@IT}@bA}BnCkCzCIJcDvDy@dAWT{CxC{@v@mAbAk@d@i@v@aAzAwB~C_ArAGJ?BUd@JVV`BFz@KbAWbBUvAYbBWzAOv@Kj@K`@Uh@UZ{@v@kApAc@f@Y^[rCS`B[lBCTe@rB_@|AERy@jC[h@QXaBtBENQr@OrBWxDKvA_ClAcAf@oAn@aD~Au@^{@^q@RqCx@yDjAeEnAwDdAuDfAeD~@gD~@qBRmA^mF|AmCv@_EjAeDbAaD~@iBNqABaCC_CMaEg@oBYeBQWCeAG_GRuCHkA?kJEeB?g@@yFXqAFmAN{JnA}KxAeFp@{BT_BVqG~@aJfAgDTeG@cD?aIES@wABoG@y@@eAFmAPmEt@{Cd@mCf@qB`@eANaEDgFGgK?mJGmEAiDCEc@SQoC?i@AQt@gFEsJEuD?sKGeKGwBAyMIg@?sG?oIAu@OkMEV_B^iDTk@XiBh@_DdA_Ho@OaBYQAcA?eADm@@o@D}@Hg@Fo@Vo@Xu@Vc@Fy@@mC?w@JeCr@DmAAs@?kBEYIOcAsAoBeCsAcBYe@CO@sAD}EF{@Z}C_BQgCIwFWgDMaAOwDOoCIG?KAO?I?W?]?o@AiBCk@?s@CkAC{@SqAEiFQkEAe@DoCHuEP_Hd@oF]m@EmB]YEqDa@oFy@mFm@oDi@iHgAkDi@}B[kD[wJ}@UeIIaBI_C?_AiC^aItD{APqCp@}@b@aAh@eCbASFmBLiAHcB[oAh@kBhA{AjAQBs@n@MHuDxCeCpBSJqBt@_@V{AnA}ArAkBvBBDBDKh@MX{AhB"),
        ("BoHo","BoHo",1,@"oxj_CmfaeSG`Af@lAfAbAp@RbCYpHeA|@JbAN~@Hp@NfB[xAYbASdAY`@Mt@N|Bf@dDt@rDz@rD~@hBb@~@TjDv@t@XxFbArAXbBzC?HpFNCpAQtGKzDOzFOVKjCY`IItBsC@cB?EbGWpIGvAMnEc@zN?x@?x@GdAIdDCvDF`AP~@r@xB@b@Tx@L~@GfAiAdCZTtAcC`Dq@lEpBhExBvGbDnJ~EfHfEdAp@xB~@bGfCrFxBhBr@hBt@lDrA~CvAhBnApDnFVhCkA|Do@n@mDfF_F|CiL`IcDdCcEtHgE`IoIoFyI_FwD{BkEkC}@i@A@LDCCIACDEHEJMX_@l@Of@KVk@hBaCdGcAjC_@nA{@xB{CzHi@rA{A\oCmAaCmA{IgEWl@vBdAcBvOY|BEZGREj@I^KdAJhEA`Bf@rGRpAPhAb@hBL^x@jD{BnCWXuCnDsAp@qAB{AKoAYqAs@qCyAyEyCu@o@_EqDk@g@OMEGAI?q@N]?a@^}@^_Al@cB^aAXq@Vu@lA}CEi@Cm@IY}@_@QMc@UU_Ae@eBKo@_@qE[kEKiAk@oFm@sFe@yEKsAa@KyDy@mDo@o@QeE_AqAYc@GoEaA{Be@sDm@eBWcB_@aDo@yFoAi@KaAQqIoBMGMMIQG[@qB@_DGi@Bg@BuC?_@@q@d@aF@e@\qATsBb@{Ap@{Ch@}ACU^sA~CgL|@yCN[N}BDs@Iw@|CiAJA\Cn@IXiBLKbAKJu@AyDXQPCd@BtACjAGbAKlAQ~Cq@pBo@@u@?QL{CLsCBY`@uDh@{D`@uEd@qBPgBToC|@cAlCoCpCoCn@m@xCkCjF_FhAeAVGl@e@bAkAn@gCFWLKHAlElA`AcGhBkIh@gC\sCjB{HReAlAgGxAoHgDi@}AUwB[qBMs@IsBQoCYqBSsEQmAE]HWFo@`@k@Z{@\yAv@GJERQbD"),
        ("BoHo","BoHo",2,@"oxj_CkfaeSG~@f@lAfAbAr@RhCYjD[~@MdAIt@EbABnBd@fGiA`AWd@OwBdLmBbJy@dF_@dCsBxIQb@g@|BIZQT{@r@m@v@_Az@uFhFqCbCeCbC{DvDqAxA]bEI|@a@hBe@vEk@hFa@lCSlFIjBAl@Lh@CrAKxACr@EhAA|AIvBEvAK`BEhAEd@BxA?r@G`A]hH]nHQrDEpB[lHSpHGzBWxAi@p@uAhDiEtJ|ATpAXzCn@rIhBrEbAvH|AzB`@^ZTZNZn@`Hb@bDl@zE|@|LJv@H^dAxDJZL\Ff@kA`DaA|CeArC]tAc@f@If@H`@jBlBpBjBvAtA`Az@bEnCdAn@v@`@hCpAn@R`BZhAD~@G^Mp@_@`@c@tAaBbAiAb@m@hB_C`Ay@OSuAlAsAqFYoAe@qCAMc@eG@cBIsCAs@JeAHa@@IBa@FQd@wD|AyN`ClAbElBtFdCbEvBfCnAvDdBbGbG^[kGaGiEcCyAs@{DoBUmAdBkE|A{Dr@kBtA{DvCsHPe@n@qBZ_@\[NETAXDzFtClDrBxD~BfNbJzB{ExGgMxDaDtFgEhHuDpBeBz@yArByBhAoBz@gFwEkHyAwAsEuAeC_AyF_C_G_CcHsCaBs@wHcEgGgDgMoGgEwBeDcBMgA`@oAHK|AaCWUcAhAyBhCu@FwAa@OQA_@o@sBWoAGcANmIFoA@wBR{GNgGRqGVyHBcGrGAl@}PG_@DcBX{KoD{@wEeAbAsIxAyLiB]k@IeEg@}Es@kFm@yCe@qFw@sF{@sB[iDWyCWcD]}@I{GW]H[Fo@b@o@\u@XgAj@SJGLCNQbDwLblBh@{D`@uEd@qBPgBToC|@cAlCoCpCoCn@m@xCkCjF_FhAeAVGl@e@bAkAn@gCFWLKHAlElA`AcGhBkIh@gC\sCjB{HReAlAgGxAoHgDi@}AUwB[qBMs@IsBQoCYqBSsEQmAE]HWFo@`@k@Z{@\yAv@GJERQbD"),
        ("LongBien","TuSon",1,@"wsl_Cwu`eSt@_AHGfAY`@g@dAoAbB_BJM\[|@s@hA_AxBkBjDqCdA}@j@k@PC`Ay@dAu@XQRGbAWR?PGRGFEHIBQ?OCKEKGGUIQ?I?IGW}@}@yC}@{CmBuGoByGgAwDqEuOwEwPyBkHyAuFu@mBm@cAs@cAe@g@}@_Ai@i@gDcDaBiB{@qAg@}@uB}ESo@kAmD{AkEu@}AmC_HwAoDmBeF{DyJ_AmCi@uAYg@s@eAqAyAmAcAcDcCeFuDyH}FyAeAU[IUGi@?{@@I?Q?SGQKUMKKEMGK?MAU@SDeAFo@Ek@Sk@[aBsAwAiAaAq@UOw@y@}C_DmCsCgDkDoDwDa@e@}@aAeF{EqBcB}C{CgBaBmD_D{CoCmAgAuCsCwBsB{B{BoEiE_NoMgB_Bq@o@o@o@}EiFi@k@_@_@g@i@WWUUWO_@KEAWEcA@eDM[MgIwH_@_@Ui@sBmFm@yAm@s@eAmAkBmBmF{FuAyAkCsBmAaAuCgD{@aAc@e@eAgAsCsCuDmD}GqGeAiA_EcEcGcG}@o@y@u@eBgBiBoBeBiBi@m@e@S_CyBcD_DsDoDcA_Aq@q@_@q@yCyCw@w@}EgGgB}ByDyEoDoEwE{FeCcDoKiMkJ{LoBgCmCgDkDyEkB_E{DuI_DaHmCcGmCkFmCuGyB{EyB_FmBeEoBsEsDsIc@cAwCkGwD{Iu@{AoA}ByAyAeCoEaBgDuCkGaCgFoBmEqAsC}LuW"),
        ("LongBien","TuSon",2,@"a||_CmoxeSfQv_@`AxB|C`Hn@lAbBnDh@fA|@bBxAdCvAxAnA|BhA|Bl@xATf@dB`EvA|Cj@hAnAxCfDzHzEvKhCxFrBnEP^dBjEzBlEdBtDhBdEdBvDfB|D~BfFdAxB|DnF~ApBpA~AbDfEpE`G`AlApIfKpHdJdH|IzCrDnGfIxA`BnBpB|@x@\p@xCtCdG|FpDjD`@PVXzDbEf@h@tBvBbBtA~BzBh@h@lBnBvDxDXXhAjA~EpEvFtFrBpBpArAlAtArC`DrAjAdClBxC`DrD|D`@b@Rj@BN@T?VDZDRDNDHDDZV|AfALPDN@PATINw@jAKRAP@RBF@NPVRPF?T?|@Ad@?P@TFh@\pCjCvDpDPVRVBFDJ?L?LCRCPIPQXOb@AT?D@DDLJFNFHBJ?HAJEJKZ[x@iAp@{@NKJIHCPAL?^@LBLFhAjAfAhAlAlAjDjD\\~CvCvBnBbBxAnArA~C`DxDvDfBhBTTb@VdC`CzBxBlDbDdAbAZ^z@v@vCpCzDlDrBdBhAhA|A`Bn@l@hA`AnDhD\^|B`CbClCxBzB~AbBb@`@r@j@dAr@lDpCb@RZ\nBvAFPrDrCp@h@vBvAdDdCtAjArB`BrFfEbBtAl@n@Z^^d@\l@Tb@`AbCrBhFhApCt@~BxAxDlBzEvCrHbArCdCtGr@lBfAdCx@`Bv@hA^b@xB~BtBnBhBfBf@j@n@`AT\f@nAj@dBzA`FjBjGzAnFpEtO|ExPjAdElA~DlA`ElA~DL`@Lj@AJCJMNo@\u@f@u@b@yAtAq@l@MF_F~D{AlAULoBt@WLw@p@yBlBKHoBxBBB@D?BCNEVMXcAjA"),
        ("CVThongNhat","HVNongNghiep",1,@"w|g_C{y_eSFwBJyDDkBmBe@}@UyA_@aC_@wB_@_Ba@gDu@[I}@Q{Bw@ReA|@aFt@uDfAsF~@oD`@kB\kBt@gETgAs@S}A]qA[iDw@_B]gCe@wA]uA[i@c@BK@MAICKGEKEK?K@IDGFCL?LBJc@ZaB`@sA^y@ReDv@]HcC^QSeDs@mBe@iC]sCpAoDbByANuCp@}BnAeC`AQDkBNkAHcB[oAj@}A~@]RkA~@QDs@l@KFoAbAcAx@wAhAoAbASLiBp@GBYPYTy@p@~@z@dA}@dA{@~CmCdBsAp@k@l@g@`@_@h@g@PC~@u@fAy@XQRGbAWR?b@ORMBQ?OCOGIGGSIO?K?IGQo@c@{AwAuEcB{FgAwDq@}BkAcEuAwEeCwIyAgFo@}BaAoDZAXOJBLBHJBF@L?HCJGJGHKDMDcAZS@WAQESE{Af@YF[D_@B_@?wAKkCMaESa@}@gB_EkAoC_@y@qAuCiAiCk@eAcAmCM[Ym@oAkCsAwCgBcEeByDc@_Aa@u@aAyBSe@m@_BqAwCsAwCAcGEeIE}EM{@aA{EuAeH]cAT]cE_D{AiAgE}CoCsBu@m@QOKSGOEUCWAW@_@d@aA^c@dBiAtA_AbAq@zCsBpAy@bCaB|CeBv@e@rKeGhJiFnHeEjHcEzBoAfBu@nDkAfG_BbCq@`A[`A]NEr@a@z@c@v@m@d@c@TUb@o@`@s@JWvCsHbFcN`AmB`BmDzDgKfDcIzAeE|FeOvAkE|@eEf@oCtAkHnBcKvAqHrBgKlAoExEeOzDwL~BwH`BoFbB}F|BsHhFoQvAmEjAsCpBbAdBx@pAj@pDp@hATzDh@`CXf@FhCThBD`ENdBXbB^nJlCdBz@dBvA|GpCzCfArCx@lH`AzDP"),
        ("CVThongNhat","HVNongNghiep",2,@"mne_C__qeSwOwAcI}C_FmBwD{BuKsDqB_@iB_@kA?iAAq@Kw@AiBImAI_AK{@KgAOeBU_AOwAW_Cc@c@My@]oAk@aBy@sAq@y@tBQf@gDzKeErMyBdGsBfHkE`NkErNyBfImB|Gk@bCcCnL_A~EyBtLqAzGk@xCo@zBg@zAsG~PyBbG}BbGoEtLeEnImDxIsDdKYn@c@r@WZy@p@]VuBhAi@Pu@XoJdCoF~Ao@VqAn@_FjCcGdDiDnBc@TgK|FcLtG]PyCbBwGhEoH~Ec@V]Jg@Je@Da@DKAW@SDMHGJGJCL?PDZBLNNTPFBFBp@v@lArA\XbAp@bAt@jCrBd@\v@p@tAhAjCnBv@l@L^Lb@f@hC`A|Ej@pCNbADvFBpF@vCBdDxB`Fp@xAr@lBfAdCf@|@bBvDjAlC|AjDhB~Dp@tAz@zBVn@h@bAxB`FxGdOzId@|AFd@AZE`@KZKz@YTi@HKNI^O`@vAv@pCt@lClA`ExAdFlA`Ev@rChA~Dr@bCvA~Ex@pCp@zBz@nCTv@HZBNAJEJKNk@\}A~@OH{AvAq@l@MFuAhAUR{AjAqBbBSHsBv@WPqAfA|@z@\[vAiAxAoApAgAhBwAfCyBp@SdAy@bAu@b@URKVKNAh@Gt@Kn@DnEKxA?nC?`BQhCM~Cw@bHeBdAWzBq@pBk@POrBj@lDn@lCf@fCn@tE~@|Bh@bAZzAd@dB\jFpAa@nBaAvDwAbHi@lCkAvGaArEiA|FMr@e@~Ba@pCEEGCK?IBA@EDADCH@FBLDDDBH@B?DA_@hBMj@aAxD_@tBc@fCj@BdD@nB?zA?bC?rC@tCHvEErGAj@yNdCgbQf@FhCThBD`ENdBXbB^nJlCdBz@dBvA|GpCzCfArCx@lH`AzDP"),
        ("CVNghiaDo","DaiAng",1,@"_jl_C{qvdSl@CpBEG_@NuACmB@m@Je@L]b@w@`@o@`GaIbAuAl@y@pBmCdCmD`EcGpBoClDeGb@aBpA{G`AwF~BoMZcBhCb@hIbAhDl@lFjArB^b@FnA^jAh@~A~@pFtCdI`EnCrAhJfEhG|CjAn@xCxAfAbAfDnD^a@kBsB}@aAu@u@_@YyCyAsAq@mAm@gEuBUmAb@eA`AeCzA{Dl@yAjAmDtBkFr@gBJ]bAwCnAoCr@oAn@s@\m@zEuH|BsD`D}ElBmC`CuC|CcCbFaFNU`@m@lBqE|@sCv@_C~A{EhAuCfCwGt@oBd@qAj@iB\y@^_AF[nC|@RJhDbAhB^h@@bEhAhGpB`Bn@~Cn@dHpApI_E|DyBfJeFrFqChGmDXr@`CpFr@~AF@`A`@rChAx@Z\c@tB}AdCkBrC_DPOn@q@v@s@r@s@l@cAPUDKxF?rDAa@wDhEg@Mk@zCa@fK{A~GcApC_@~@?^?lCFxCDhABvC@~DAfD?hB@~ECzBI@fAPjCv@nDbAfErA`Gj@lC^dB@~@AxBTr@j@nA`@~@n@hAd@z@`@bAx@jA\^f@n@~@|@r@p@RJRHvBXjC^vC^QeCc@gHq@sGqAuAIQg@aHe@aE@Yr@mC}Bq@dAyGJo@RuDf@_LVaGLkCJwIlAAHw@nCAtEAdC?zAAbBCx@Cx@E`Gu@~@KlAM|BYbEm@tEk@`Dc@|BYxDg@jKsApC[pIg@pAAnF?xEBnAAxACzCQnCCr@@vC\pEj@|@H|CL`BD~@@xAKp@ItA_@vBk@lEoA~HcC`EmAxEsAxC{@`GcBjBk@`EiAxOwEbFeChNiHn@|Fr@hG|@dFtB|L?X@~AIzA_@pAcBrDcHrL}DnH}C~Fg@jAm@vAk@x@g@x@c@j@h@H`AVjAJpAXx@^b@B`Cb@jAZxAN`@DfGxAlE|@~BVdCh@hFx@|L~B~KzBfIrAfEp@fIzArH|AvFz@"),
        ("CVNghiaDo","DaiAng",2,@"usr~Bq~|dSmBe@yBY}E}@sKsBqR_DgDm@qCm@aKqB_BYyDm@g@KgCg@uC_@cFeAqBg@sBe@yBU]Ki@O_AO}@Oe@Ey@_@kAYqAKaAWg@If@o@nAoBVm@Zu@`@}@Vi@nAyBpAkCx@{AtBwDlAyBnEqH~AsDZiAJaBAoBOu@uCoPi@eEiAaKmDjBoGbDsFlC{@\{Bp@uIfCwC|@{Bl@kHtBqEpAwBRoA^{M|DcGhBcD|@eBNsABqCEqBKwDg@qC_@gAKYEaACgCFsGRgAAcJCkC?qH`@qBN{WbDcJnA{AVuRdCkDX{I?kAAcICyAB{IFaAD{@LD^zAQn@CzJIh@?pABGv@uA@u@?EtCWxIUfGu@`PEj@y@|EYfA|Ad@~Ad@s@lCA^b@~El@`GJTjAjAh@zG^bFPdE_LaBSIIIe@e@oAkAyBuCa@iAsAaCeA{BMYOk@?qAAiBc@oBOu@iAoFyCkMMoBGmB}BJyF@_M?yHGwAE_CEoAAcHdAgIjAsFp@uB`@Nh@iALaCXb@vDeG@wB?o@@GHMRq@fAy@v@q@l@uC~CaAbAmDhCkA|@]b@gAc@gAc@y@[y@]QGaA{Bo@wA}AoDoBhAoHvDeKvFcGfDo@XgD~AuBdAiFeAsDs@o@QoCcAsBm@cCw@aD{@c@AmCm@kCw@WMgCw@K^cAjCiAjDoAbDsAdDoFnOeAjDcB|DWb@e@t@gCbCaB|AyCbC{CrDe@r@}@rA_D|EkDjF_ErGKJg@n@uAjCw@jBGTk@dBwDvJiBfF{CxHkArCaGoCmAo@oBaAkFcC_CmAyEeCsCuAuBc@eIaBgE}@qEg@yAc@qDu@[|@uBbMc@`CkCrN]vAWp@cBrCkAfBmD`FyBvCgE~FgDnE_GfIs@`A]|@Gp@E|@@~A{AxAcDAAb@vBF|nUmhF`@DfGxAlE|@~BVdCh@hFx@|L~B~KzBfIrAfEp@fIzArH|AvFz@"),
        ("CVnuocHoTay","HVcanhsat",1,@"aks_CwdzdSaE|F|KrGrCpArMlCzJlBd@d@t@TfAK`BTx@NhDh@jBj@hBn@lAb@zBx@~GfBzF`Af@HxDDlKdAfC@`LHvLQdGe@lCWhGdFfHnEdCfAjDlA|AV^Zl@Hx@P\Rh@F^h@RJ@vE@`GAdG@hR@jEl@FdHBdACrG@ArAAvAbAlBp@xAjArCp@|AAvA?R@|BBrE@r@?rD?rC?~G?nD@pACpBGhFGdHMpC?|DMjJ|CH|BD^DrEVlFRH@zClCdB~AEVBvAMbFG`AGd@QpAcAtEm@fCqAbGeA~FiIba@kBnI_FzSa@MoAo@_@YQWO_@i@cCcAyEg@}BIa@[gA}@q@a@Uk@[_B}@yDeCcAq@aCcAe@]a@Uw@m@m@s@O]eAw@yEiCeGqDeB_AqHqEuG{CkJmCu@M_DMuIHyKVgGR?nBDpBD~AAj@UvAUp@eC~KkCzKwA|FoBbHU~@e@vAi@vA_Ac@g@Iq@As@@wA^oAR"),
        ("CVnuocHoTay","HVcanhsat",2,@"}pq_CqvodSdDy@t@?j@?l@JdAb@d@yAbCsI|@oDjBkH~AwGp@}C\iBz@kDV_APaAAsAI}D?yA|DMtGQzISxE?lCH~@PpGjBlA^jGtClDtBxKnGdItE`At@Vf@l@r@nAv@j@\hBz@hCvAjBlAHHPNVJPJr@d@f@Th@^p@d@LXVbALr@x@rD|@dET~@P`@PVVPx@b@v@^}DvOb@NbE_QbAeEpBgIRg@lAmF`BmHxB}KrBcKrAgIbAsEdAwE`AgENy@XcBFmAH_CHqCHeHEiA_H_@iHUm@?wCJm@Bi@?gEKDgCFuEFgCDqEHoIHgHA_EB_S?cLCkCyFeLBgDGm@iE?oA?{@n@aHACsGAyJ?iBAyGA}Ob@YL]Fi@Gc@UYi@Sq@JWLaBIk@?k@Pa@JgEwAgCgA}A}@kDiBwFwEiAy@g@McFb@eFJeNLkCGoI?kHe@wAUwBC}@EgCe@sJyBq@OgC}@gFkBo@MmGaA_@G[Eo@_@_@QiA@{B_@mE}@cDo@oFgAsBe@kCgAeDqBeCwAuBwAtDqF")
    };
    // Compare Origin and Destination in routeDetails with assignedRoutes to find matching RouteId
    var routesList = dbContext.Routes.ToList();
    foreach (var routeDetailInfo in routeDetails)
    {
        var assignedRoute = assignedRoutes.FirstOrDefault(route =>
            string.Equals(route.StartZoneName, routeDetailInfo.Origin, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(route.EndZoneName, routeDetailInfo.Destination, StringComparison.OrdinalIgnoreCase));

        if (assignedRoute is null || !assignedRoute.StartZoneId.HasValue || !assignedRoute.EndZoneId.HasValue)
        {
            continue;
        }

        var route = routesList.FirstOrDefault(candidate =>
            candidate.StartZoneId == assignedRoute.StartZoneId.Value &&
            candidate.EndZoneId == assignedRoute.EndZoneId.Value &&
            (!assignedRoute.DriverId.HasValue || candidate.EmployeeId == assignedRoute.DriverId.Value));

        if (route is null || dbContext.RouteDetails.Any(rd => rd.RouteId == route.RouteId && rd.Direction == routeDetailInfo.Direction))
        {
            continue;
        }
        var routeDetail= new RouteDetail
        {
            RouteId = route.RouteId,
            RouteDetailName = $"{(routeDetailInfo.Direction == 1 ? assignedRoute.StartZoneName : assignedRoute.EndZoneName)}->{(routeDetailInfo.Direction == 1 ? assignedRoute.EndZoneName : assignedRoute.StartZoneName)}",
            Direction = routeDetailInfo.Direction,
            DepartureTime = routeDetailInfo.Direction == 1 ? new TimeOnly(8, 0) : new TimeOnly(17, 0),
            EncodedPolyline = routeDetailInfo.EncodedPolyline
        };
        dbContext.RouteDetails.Add(routeDetail);
        dbContext.SaveChanges(); // Generates RouteDetailId

        var geoPoints = polylineService
            .Decode(routeDetailInfo.EncodedPolyline)
            .ToList();
        var h3Indexes = RouteH3Converter
            .Convert(geoPoints, resolution: 9)
            .Select((cell, index) => new
            {
                H3Cell = unchecked((long)(ulong)cell),
                Sequence = index
            })
            .GroupBy(x => x.H3Cell) // Required because H3Cell is part of the primary key
            .Select((group, index) => new RouteH3
            {
                RouteDetailId = routeDetail.RouteDetailId,
                H3Cell = group.Key,
                Sequence = (short)index,
                DepartureTime = routeDetail.DepartureTime
            })
            .ToList();
        dbContext.RouteH3s.AddRange(h3Indexes);

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