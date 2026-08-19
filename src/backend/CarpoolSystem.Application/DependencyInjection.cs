using CarpoolSystem.Application.Interfaces;
using CarpoolSystem.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CarpoolSystem.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<IRouteService, RouteService>();
            services.AddScoped<ITripService, TripService>();
            services.AddScoped<IBookingService, BookingService>();
            services.AddScoped<ICostTransactionService, CostTransactionService>();

            services.AddScoped<IZoneService, ZoneService>();
            services.AddScoped<IRouteDetailService, RouteDetailService>();
            services.AddScoped<IPolylineService, PolylineService>();
            services.AddScoped<IMatchingService, MatchingService>();
            services.AddScoped<TokenService>();

            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IRoleService, RoleService>();
            return services;
        }
    }
}