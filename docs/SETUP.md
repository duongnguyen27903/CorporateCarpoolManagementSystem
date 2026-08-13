# Setup & Build Guide — Corporate Carpool Management System (Backend)

This document explains required SDK/runtime and how to build/run/test the backend locally. The project targets .NET 8 (net8.0).

Prerequisites
-------------
- Windows (development environment)
- Visual Studio Community 2026 (recommended) or VS Code
- .NET 8 SDK and Runtime (required)

Install .NET 8 SDK & Runtime
---------------------------
1. Download .NET 8 SDK from official site:
   https://dotnet.microsoft.com/en-us/download/dotnet/8.0
2. Run the installer and follow prompts (install SDK and Runtime).
3. Verify installation in PowerShell:
   ```powershell
   dotnet --version
   dotnet --list-runtimes
   ```
   Expected: output includes Microsoft.AspNetCore.App 8.x and Microsoft.NETCore.App 8.x.

Project structure (relevant)
---------------------------
- src/backend/CarpoolSystem.Domain
- src/backend/CarpoolSystem.Application
- src/backend/CarpoolSystem.Infrastructure.Sqlserver
- src/backend/CarpoolSystem.API
- src/backend/CarpoolSystem.Tests

All projects are configured to target net8.0.

Common commands
---------------
Open PowerShell and navigate to project root:
```powershell
cd D:\CorporateCarpoolManagementSystem\src\backend
```

Clean and remove build artifacts:
```powershell
# Clean via dotnet
dotnet clean

# Or manually remove bin/obj
Get-ChildItem -Path . -Recurse -Include bin,obj | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
```

Restore packages and build:
```powershell
dotnet restore
dotnet build
```

Run API locally (with seeder):
```powershell
dotnet run --project CarpoolSystem.API/CarpoolSystem.API.csproj --urls http://localhost:5147
```
After startup, open Swagger: http://localhost:5147/swagger

Run unit + integration tests:
```powershell
dotnet test CarpoolSystem.Tests/CarpoolSystem.Tests.csproj
```

Troubleshooting
---------------
- If `dotnet test` fails with message about missing .NET runtime (e.g. "You must install .NET 8"), ensure .NET 8 runtime is installed and `dotnet --list-runtimes` shows Microsoft.AspNetCore.App 8.x.
- If NuGet packages resolve to unexpected versions, run:
  ```powershell
  dotnet nuget locals all --clear
  dotnet restore
  ```
- If you see warnings NU1603 about versions mismatched, inspect csproj files for explicit PackageReference versions and align to 8.x where appropriate.

Notes about Target Framework alignment
-------------------------------------
- All projects in `src/backend` should have `<TargetFramework>net8.0</TargetFramework>` in their .csproj.
- If you find any project still targeting net10.0, open the .csproj and change to net8.0.

If you want, I can create a CI job configuration (GitHub Actions) that ensures dotnet 8 is used and runs tests on each PR.

---
Generated: 2026-08-06
