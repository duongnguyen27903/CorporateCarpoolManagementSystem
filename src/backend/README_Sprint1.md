# Báo cáo tiến độ — Sprint 1 (04/08 – 07/08)

## 1. Mục tiêu Sprint 1 (theo kế hoạch)
- Phân tích yêu cầu, thiết kế CSDL (ERD).
- Thiết lập dự án Backend (Clean Architecture: Domain, Application, Infrastructure.Sqlserver, API).
- Kết nối SQL Server, tạo Migration và Database.
- Cài đặt JWT Authentication (Register, Login, Refresh Token) và phân quyền Role (Admin, Driver, Passenger).
- Xây dựng CRUD cho Employee, Vehicle, Route.
- Viết Unit Test cơ bản cho các Service.
- Cấu hình Swagger để test API.

---

## 2. Những gì đã hoàn thành
Dựa trên mã nguồn hiện tại, các mục đã triển khai chi tiết như sau:

### Cấu trúc dự án
- Đã tạo 4 layers:
  - CarpoolSystem.Domain (entities: Department, Role, Employee, Zone, Vehicle, Route, Trip, Booking, CostTransaction)
  - CarpoolSystem.Application (services, interfaces, DI)
  - CarpoolSystem.Infrastructure.Sqlserver (CarpoolDbContext, GenericRepository, UnitOfWork, Migrations)
  - CarpoolSystem.API (controllers, DTOs, JWT, Swagger)

### Database & Migration
- CarpoolDbContext đã cấu hình quan hệ và DeleteBehavior.Restrict.
- Đã cập nhật Entity Employee để cho phép các trường Phone, Address, DateOfBirth, Gender nhận NULL.
- Migration cần tạo/apply: `MakeEmployeeFieldsNullable` (giải quyết lỗi INSERT NULL vào cột Phone).

### Xác thực (Auth)
- POST /api/auth/register        — Public
- POST /api/auth/login           — Public (trả về AccessToken + RefreshToken)
- POST /api/auth/refresh         — Public

### Employee
- GET  /api/employee/department/{departmentId}  — [Authorize(Roles = "Admin")] (dành cho Admin)
- PUT  /api/employee/{id}/profile              — [Authorize] (chỉ owner được cập nhật thông tin cá nhân)

### Vehicle
- POST   /api/vehicle
- GET    /api/vehicle/my-vehicles
- PUT    /api/vehicle/{id}
- DELETE /api/vehicle/{id}
(All endpoints yêu cầu [Authorize]; controller hiện tại không bắt buộc [Authorize(Roles = "Driver")] tại level controller)

### Route (Sprint 1)
- POST   /api/route
- GET    /api/route/my-routes
- GET    /api/route/{id}
- PUT    /api/route/{id}
- DELETE /api/route/{id}
(All endpoints yêu cầu [Authorize]; service kiểm tra ownership khi update/delete)

### Unit tests
- Đã có unit tests (xUnit + Moq) cho:
  - EmployeeService
  - VehicleService
  - RouteService
- Tổng số test cases: ~9 (gồm: VehicleServiceTests (3), EmployeeServiceTests (2), RouteServiceTests (3), UnitTest1 placeholder)

### Testing & Swagger
- Swagger đã cấu hình; DTO/Controller có XML summary cơ bản.
- Luồng Register → Login đã test thành công bằng Postman và trả về token như mong đợi (sau sửa Employee nullable).

---

## 3. Những vấn đề đã gặp và cách giải quyết
- Lỗi build do file DLL bị lock: đã giải quyết bằng dừng process/kill process trước khi build.
- Lỗi SQL: "Cannot insert the value NULL into column 'Phone'...": đã sửa bằng cách cho các field Phone, Address, DateOfBirth, Gender của Employee nhận NULL và tạo migration `MakeEmployeeFieldsNullable` để update schema.
- (Ghi chú) Một số endpoint yêu cầu role-specific chưa enforce full role-check tại controller (ví dụ Vehicle có thể cần [Authorize(Roles = "Driver"]) nếu yêu cầu nghiệp vụ).

---

## 4. Những gì chưa hoàn thành / Công việc chuyển tiếp
- Module nghiệp vụ chính chưa triển khai: Trip, Booking, Matching, CostTransaction.
- Dashboard/Báo cáo chưa có.
- Tính năng real-time (SignalR) và tích hợp bản đồ/Map chưa làm.
- Cần mở rộng integration test, e2e test và test coverage.

---

## 5. Kết luận và kế hoạch Sprint 2
- Sprint 1 (04/08–07/08) đã hoàn thành mục tiêu nền tảng: cấu trúc dự án, auth, CRUD cơ bản cho Employee/Vehicle/Route, migration xử lý lỗi NULL, unit tests ban đầu, Swagger.
- Sprint 2 (dự kiến 10/08 – 14/08) sẽ tập trung:
  - Triển khai Trip (tạo trip từ route), Booking (passenger book, driver confirm), Matching logic (gợi ý trip phù hợp).
  - Triển khai CostTransaction (tính chia chi phí cơ bản) và báo cáo.
  - Mở rộng unit/integration tests.
  - Hoàn thiện role enforcement và security policies.

---

## 6. Lệnh khuyến nghị (tạo & áp dụng migration)
Từ thư mục `src/backend` (PowerShell):

1) Tạo migration:

```powershell
dotnet ef migrations add MakeEmployeeFieldsNullable --project CarpoolSystem.Infrastructure.Sqlserver --startup-project CarpoolSystem.API
```

2) Áp dụng migration lên database:

```powershell
dotnet ef database update --project CarpoolSystem.Infrastructure.Sqlserver --startup-project CarpoolSystem.API
```

3) Build và chạy tests:

```powershell
dotnet build
dotnet test CarpoolSystem.Tests/CarpoolSystem.Tests.csproj
```

---

**File thay đổi chính trong Sprint 1**
- CarpoolSystem.Domain/Entities/Employee.cs (nullable fields)
- CarpoolSystem.Infrastructure.Sqlserver/Persistence/CarpoolDbContext.cs (IsRequired(false) cho các field Employee nullable)
- CarpoolSystem.Application/Services/IRouteService.cs (mới)
- CarpoolSystem.Application/Services/RouteService.cs (mới)
- CarpoolSystem.Application/DependencyInjection.cs (đăng ký IRouteService)
- CarpoolSystem.API/Controllers/RouteController.cs (mới)
- CarpoolSystem.API/DTOs/RouteDTOs.cs (mới)
- CarpoolSystem.Tests/RouteServiceTests.cs (mới)

---

Cần hỗ trợ gì tiếp theo không? Ví dụ:
- Tạo migration file trong repo để review trước khi apply.
- Thêm kiểm tra tồn tại StartZone/EndZone trong RouteService.
- Áp đặt role policy cho Vehicle endpoints.

Cập nhật lần cuối: 2026-08-06

http://localhost:5147/swagger/index.html