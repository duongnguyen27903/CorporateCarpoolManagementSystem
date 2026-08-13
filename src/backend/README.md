# CarpoolSystem - Backend (tập hợp mã nguồn hiện tại)

1. Giới thiệu
---------------
Hệ thống Backend cho Corporate Carpool Management System, xây dựng bằng .NET 8 theo kiến trúc Clean Architecture.

2. Cấu trúc project
-------------------
Trong solution (thư mục src/backend) hiện có các project chính sau:

- CarpoolSystem.Domain
  - Chứa tất cả entity/domain models (thư mục Domain/Entities). Đây là layer lõi, không phụ thuộc vào các layer khác.
- CarpoolSystem.Application
  - Chứa business logic (dịch vụ), các interface (IUnitOfWork, IGenericRepository, service interfaces) và lớp TokenService.
- CarpoolSystem.Infrastructure.Sqlserver
  - Chứa CarpoolDbContext, cấu hình EF Core, migrations và implement GenericRepository + UnitOfWork.
  - Migration hiện có: Infrastructure.Sqlserver/Migrations/20260806031452_InitialCreate.cs
- CarpoolSystem.API
  - ASP.NET Core Web API: controllers, DTOs, cấu hình JWT, Program.cs và appsettings.json.
- CarpoolSystem.Tests (nếu có)
  - Chứa unit tests viết bằng xUnit + Moq.

3. Những phần đã hoàn thành (scan mã nguồn hiện tại)
--------------------------------------------------

3.1 Entities (Domain/Entities)
- Department, Role, Employee
- Zone, Vehicle, Route, Trip, Booking
- CostTransaction

3.2 Data access / DbContext
- CarpoolDbContext (src/backend/CarpoolSystem.Infrastructure.Sqlserver/Persistence/CarpoolDbContext.cs) khai báo DbSet cho tất cả entity trên.
- Trong OnModelCreating có thiết lập quan hệ với DeleteBehavior.Restrict cho các foreign key sau (được định nghĩa rõ trong code):
  - Trip -> Driver (Trip.DriverId)  : .OnDelete(DeleteBehavior.Restrict)
  - Trip -> Vehicle (Trip.VehicleId) : .OnDelete(DeleteBehavior.Restrict)
  - Trip -> Route (Trip.RouteId)     : .OnDelete(DeleteBehavior.Restrict)
  - Booking -> Passenger (Booking.PassengerId) : .OnDelete(DeleteBehavior.Restrict)
  - Route -> StartZone (Route.StartZoneId) : .OnDelete(DeleteBehavior.Restrict)
  - Route -> EndZone (Route.EndZoneId)   : .OnDelete(DeleteBehavior.Restrict)
  - CostTransaction -> Employee (CostTransaction.EmployeeId) : .OnDelete(DeleteBehavior.Restrict)

  Lý do: code thiết lập Restrict để tránh lỗi "multiple cascade paths" hoặc xóa tình cờ các bản ghi tham chiếu; hành vi này bảo vệ tính toàn vẹn dữ liệu khi quan hệ phức tạp.

3.3 Generic Repository + UnitOfWork
- Interface: src/backend/CarpoolSystem.Application/Interfaces/IGenericRepository.cs và IUnitOfWork.cs
- Implementation: src/backend/CarpoolSystem.Infrastructure.Sqlserver/Repositories/GenericRepository.cs và UnitOfWork.cs
  - UnitOfWork lưu cache các repository theo kiểu dynamicaly và cung cấp SaveChangesAsync() và Repository<T>().

3.4 Services đã hiện thực (Application/Services)
- EmployeeService (src/backend/CarpoolSystem.Application/Services/EmployeeService.cs)
  - RegisterEmployeeAsync(...) : kiểm tra email unique, hash password bằng BCrypt và lưu.
  - ValidateCredentialsAsync(...) : kiểm tra mật khẩu bằng BCrypt, nạp Role bằng repository Role.
  - UpdateProfileAsync(...), GetEmployeesByDepartmentAsync(...), SaveRefreshTokenAsync(...), GetEmployeeByRefreshTokenAsync(...)
- VehicleService (src/backend/CarpoolSystem.Application/Services/VehicleService.cs)
  - RegisterVehicleAsync(...), GetVehiclesByEmployeeAsync(...), UpdateVehicleAsync(...), DeactivateVehicleAsync(...)
- TokenService (src/backend/CarpoolSystem.Application/Services/TokenService.cs)
  - GenerateToken(...) tạo JWT với claim "employeeId" và role
  - GenerateRefreshToken() tạo chuỗi random base64

3.5 Controllers & các API endpoint (với thông tin HTTP method, route, và [Authorize])
- AuthController (src/backend/CarpoolSystem.API/Controllers/AuthController.cs)
  - POST /api/auth/login            -> public (không có [Authorize])
  - POST /api/auth/refresh          -> public
  - POST /api/auth/register         -> public

- EmployeeController (src/backend/CarpoolSystem.API/Controllers/EmployeeController.cs)
  - Controller có [Authorize] áp dụng cho tất cả endpoint bên trong.
  - GET  /api/employee/department/{departmentId}  -> [Authorize(Roles = "Admin")] (chỉ Admin)
  - PUT  /api/employee/{id}/profile                -> yêu cầu [Authorize] và controller kiểm tra claim employeeId trùng với id (token ownership)

- VehicleController (src/backend/CarpoolSystem.API/Controllers/VehicleController.cs)
  - Controller có [Authorize] áp dụng cho tất cả endpoint bên trong.
  - POST /api/vehicle                 -> [Authorize] (đăng ký xe cho user hiện tại, lấy employeeId từ claim)
  - GET  /api/vehicle/my-vehicles     -> [Authorize]
  - PUT  /api/vehicle/{id}            -> [Authorize]
  - DELETE /api/vehicle/{id}          -> [Authorize]

3.6 Unit tests (CarpoolSystem.Tests)
- Tổng số test case hiện có: 6
  - VehicleServiceTests.cs (3 test):
	- RegisterVehicleAsync_ValidInput_ReturnsVehicle
	- RegisterVehicleAsync_InvalidSeatCount_ThrowsArgumentException
	- RegisterVehicleAsync_DuplicateLicensePlate_ThrowsInvalidOperationException
  - EmployeeServiceTests.cs (2 test):
	- ValidateCredentialsAsync_ValidCredentials_ReturnsEmployee
	- ValidateCredentialsAsync_InvalidPassword_ReturnsNull
  - UnitTest1.cs (1 test placeholder) - test rỗng (Test1).

4. Chưa làm / Việc tiếp theo (đối chiếu với Product Backlog)
-----------------------------------------------------------
Theo backlog dự án (các entity / module: Route, Trip, Booking, CostTransaction, Dashboard/Báo cáo, v.v.), hiện trạng mã nguồn thực tế:

- Module Auth & Employee: Đã có service + controller + endpoints (đăng ký, đăng nhập, refresh, cập nhật profile, danh sách theo phòng ban).
- Module Vehicle: Đã có service + controller + endpoints đăng ký, liệt kê, cập nhật, vô hiệu hóa.
- Module Route, Trip, Booking, CostTransaction:
  - Entities đã có trong Domain (Route, Trip, Booking, CostTransaction, Zone) nhưng hiện tại không thấy implementation service hoặc controller tương ứng trong Application/API. Do đó các API và business logic CRUD/flow cho các module này chưa được hoàn thành.
- Dashboard / Báo cáo: Không tìm thấy code cho báo cáo/tổng hợp dữ liệu.

Gợi ý công việc tiếp theo (từ code hiện có):
- Triển khai service và controller cho Route, Trip, Booking, CostTransaction dựa trên pattern hiện tại (IGenericRepository + UnitOfWork + dịch vụ trên Application layer + controller trong API).
- Thêm migration khi schema thay đổi và viết integration tests cho các flow quan trọng (booking, trip lifecycle, cost balancing).

5. Hướng dẫn cài đặt & chạy dự án
---------------------------------
Yêu cầu môi trường:
- .NET 8 SDK cài đặt
- SQL Server (LocalDB hoặc instance) để chạy database migration

Cấu hình appsettings.json (file thực tế ở src/backend/CarpoolSystem.API/appsettings.json):
- ConnectionStrings:DefaultConnection = chuỗi kết nối đến SQL Server (mặc định trong repo: LocalDB `(localdb)\\mssqllocaldb;Database=CarpoolDb;Trusted_Connection=True;`)
- Jwt:Key, Jwt:Issuer, Jwt:Audience, Jwt:TokenValidityInMinutes phải được điền để TokenService hoạt động.

Chạy migration (từ thư mục src/backend):

	dotnet ef database update --project CarpoolSystem.Infrastructure.Sqlserver --startup-project CarpoolSystem.API

Chạy API:

	dotnet run --project CarpoolSystem.API/CarpoolSystem.API.csproj

Chạy unit tests (từ thư mục src/backend):

	dotnet test CarpoolSystem.Tests/CarpoolSystem.Tests.csproj

6. Hướng dẫn test nhanh qua Swagger
-----------------------------------
Các bước kiểm tra chức năng và xác thực quyền cơ bản qua Swagger UI:
1) Mở Swagger (sau khi chạy API): https://localhost:<port>/swagger
2) Register: Gọi POST /api/auth/register với body JSON: { "FullName": "...", "Email": "...", "Password": "...", "DepartmentId": 1, "RoleId": 2 }
3) Login: Gọi POST /api/auth/login với { "Email": "...", "Password": "..." } → response trả AccessToken và RefreshToken.
4) Trong Swagger, nhấn nút Authorize và nhập: Bearer <AccessToken>
5) Thử gọi 1 endpoint có [Authorize], ví dụ: GET /api/vehicle/my-vehicles (phải trả về 401 nếu không authorized, trả dữ liệu nếu token hợp lệ).
6) Thử gọi 1 endpoint có [Authorize(Roles = "Admin")], ví dụ: GET /api/employee/department/{departmentId} (chỉ hoạt động nếu token có claim Role là Admin).

Cập nhật lần cuối: 2026-08-06

----
Ghi chú: README này mô tả chính xác những gì đang có trong mã nguồn (src/backend) tại thời điểm scan. Mọi phần chức năng được nêu là "đã có" hoặc "chưa có" dựa trên file và lớp thực tế tìm thấy trong repository.
