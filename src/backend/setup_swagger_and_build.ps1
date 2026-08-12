param(
	[switch]$Elevated
)

# Script tự động: dọn build artifacts, cài lại Swashbuckle, tạo solution nếu cần, restore, build và chạy API
# Đặt file này vào: src/backend/setup_swagger_and_build.ps1
# Chạy: PowerShell (Run as Administrator) -> & "./setup_swagger_and_build.ps1"

function Test-IsAdmin {
	$current = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
	return $current.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Nếu chưa chạy elevated, tự nâng quyền
if (-not (Test-IsAdmin)) {
	if (-not $Elevated) {
		Write-Host "Script đang cần quyền Administrator. Thực hiện nâng quyền..." -ForegroundColor Yellow
		$psi = New-Object System.Diagnostics.ProcessStartInfo
		$psi.FileName = "powershell.exe"
		$arg = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" -Elevated"
		$psi.Arguments = $arg
		$psi.Verb = "runas"
		try {
			[System.Diagnostics.Process]::Start($psi) | Out-Null
			Write-Host "Đã mở lại script với quyền admin. Script hiện đang thoát ở tiến trình cũ." -ForegroundColor Green
			exit 0
		}
		catch {
			Write-Error "Không thể nâng quyền. Vui lòng mở PowerShell bằng Run as Administrator và chạy script lại."
			exit 1
		}
	}
}

# Bắt đầu thực hiện các bước
$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $backendDir
Write-Host "Working directory: $backendDir" -ForegroundColor Cyan

# Tên solution và đường dẫn csproj
$solutionFile = Join-Path $backendDir 'CarpoolSystem.sln'
$projDomain = Join-Path $backendDir 'CarpoolSystem.Domain\CarpoolSystem.Domain.csproj'
$projApp = Join-Path $backendDir 'CarpoolSystem.Application\CarpoolSystem.Application.csproj'
$projInfra = Join-Path $backendDir 'CarpoolSystem.Infrastructure.Sqlserver\CarpoolSystem.Infrastructure.Sqlserver.csproj'
$projApi = Join-Path $backendDir 'CarpoolSystem.API\CarpoolSystem.API.csproj'
$projTests = Join-Path $backendDir 'CarpoolSystem.Tests\CarpoolSystem.Tests.csproj'

# 1) Tạo solution nếu chưa có
if (-not (Test-Path $solutionFile)) {
	Write-Host "Tạo solution CarpoolSystem.sln..." -ForegroundColor Cyan
	dotnet new sln -n CarpoolSystem | Out-Null
} else {
	Write-Host "Solution đã tồn tại: $solutionFile" -ForegroundColor Green
}

# 2) Thêm các project vào solution (nếu chưa có)
function Add-IfNotInSln($sln, $proj) {
	$slnText = Get-Content $sln -Raw
	if ($slnText -notlike "*" + (Split-Path $proj -Leaf) + "*") {
		Write-Host "Thêm $proj vào solution..." -ForegroundColor Cyan
		dotnet sln $sln add $proj | Out-Null
	}
	else { Write-Host "$proj đã có trong solution" -ForegroundColor Green }
}

Add-IfNotInSln $solutionFile $projDomain
Add-IfNotInSln $solutionFile $projApp
Add-IfNotInSln $solutionFile $projInfra
Add-IfNotInSln $solutionFile $projApi
Add-IfNotInSln $solutionFile $projTests

# 3) Dừng các tiến trình dotnet/devenv để tránh file lock
Write-Host "Dừng tiến trình dotnet/devenv nếu đang chạy..." -ForegroundColor Cyan
Get-Process dotnet, devenv -ErrorAction SilentlyContinue | ForEach-Object {
	try { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue; Write-Host "Stopped process: $($_.Name)" -ForegroundColor Yellow }
	catch { }
}

# 4) Xóa bin/obj của các project (giúp tránh file lock và lỗi restore)
$pathsToClean = @($projApi, $projApp, $projInfra, $projDomain, $projTests) | ForEach-Object { Split-Path $_ }
foreach ($p in $pathsToClean) {
	$bin = Join-Path $p 'bin'
	$obj = Join-Path $p 'obj'
	if (Test-Path $bin) { Remove-Item -Recurse -Force $bin -ErrorAction SilentlyContinue; Write-Host "Removed $bin" }
	if (Test-Path $obj) { Remove-Item -Recurse -Force $obj -ErrorAction SilentlyContinue; Write-Host "Removed $obj" }
}

# 5) Clear NuGet caches
Write-Host "Clear NuGet caches..." -ForegroundColor Cyan
dotnet nuget locals all --clear

# 6) Reinstall Swashbuckle for API project
Write-Host "Remove and re-add Swashbuckle.AspNetCore in API project..." -ForegroundColor Cyan
try {
	dotnet remove $projApi package Swashbuckle.AspNetCore | Out-Null
} catch { }

try {
	dotnet add $projApi package Swashbuckle.AspNetCore --version 10.2.3 | Out-Null
	Write-Host "Added Swashbuckle.AspNetCore v10.2.3" -ForegroundColor Green
} catch {
	Write-Warning "Failed to add Swashbuckle via dotnet. Please check network or nuget settings.";
}

# (Optional) Nếu vẫn gặp lỗi namespace, thêm Microsoft.OpenApi
try {
	dotnet add $projApi package Microsoft.OpenApi --version 1.3.0 | Out-Null
} catch { }

# 7) Restore solution
Write-Host "Restore solution packages..." -ForegroundColor Cyan
$restoreExit = & dotnet restore $solutionFile
if ($LASTEXITCODE -ne 0) { Write-Error "dotnet restore failed. Exit code: $LASTEXITCODE"; exit $LASTEXITCODE }

# 8) Build solution
Write-Host "Build solution..." -ForegroundColor Cyan
$buildExit = & dotnet build $solutionFile --no-restore
if ($LASTEXITCODE -ne 0) { Write-Error "dotnet build failed. Exit code: $LASTEXITCODE"; exit $LASTEXITCODE }

# 9) Run API project (override URL to known port for swagger check)
Write-Host "Run API project on http://localhost:5147..." -ForegroundColor Cyan
Start-Process -FilePath dotnet -ArgumentList "run --project `"$projApi`" --urls http://localhost:5147" -NoNewWindow

Write-Host "Script thực hiện xong. Mở http://localhost:5147/swagger để kiểm tra Swagger UI." -ForegroundColor Green

exit 0
