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
            services.AddScoped<TokenService>();

            return services;
        }
    }
}