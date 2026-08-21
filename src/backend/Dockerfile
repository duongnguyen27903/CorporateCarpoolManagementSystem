# Stage 1: Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# 1. Copy toàn bộ mã nguồn backend (bao gồm cả 5 thư mục project con và file .slnx / .sln)
COPY . .

# 2. Restore toàn bộ 5 project cùng lúc thông qua file Solution (.slnx hoặc .sln)
# (Thay CarpoolSystem.slnx bằng đúng tên file Solution ở gốc thư mục src/backend của bạn)
RUN dotnet restore "CarpoolSystem.slnx"

# 3. Publish riêng project API (Nó sẽ tự động build & đóng gói luôn cả 4 project con còn lại)
RUN dotnet publish "CarpoolSystem.API/CarpoolSystem.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

# File thực thi đầu vào chính là DLL của project API
ENTRYPOINT ["dotnet", "CarpoolSystem.API.dll"]