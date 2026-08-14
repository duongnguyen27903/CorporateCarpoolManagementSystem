using CarpoolSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarpoolSystem.Infrastructure.Sqlserver.Persistence
{
    public class CarpoolDbContext : DbContext
    {
        public CarpoolDbContext(DbContextOptions<CarpoolDbContext> options) : base(options)
        {
        }

        public DbSet<Department> Departments { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<CostTransaction> CostTransactions { get; set; }
        public DbSet<RouteDetail> RouteDetails { get; set; }
        public DbSet<RouteH3> RouteH3s { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.Email)
                .IsUnique();

            // Make optional fields explicitly optional in the database schema
            modelBuilder.Entity<Employee>()
                .Property(e => e.Phone)
                .IsRequired(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Address)
                .IsRequired(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.DateOfBirth)
                .IsRequired(false);

            modelBuilder.Entity<Employee>()
                .Property(e => e.Gender)
                .IsRequired(false);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Driver)
                .WithMany(e => e.TripsAsDriver)
                .HasForeignKey(t => t.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Passenger)
                .WithMany(e => e.BookingsAsPassenger)
                .HasForeignKey(b => b.PassengerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Route>()
                .HasOne(r => r.StartZone)
                .WithMany(z => z.RoutesAsStartZone)
                .HasForeignKey(r => r.StartZoneId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Route>()
                .HasOne(r => r.EndZone)
                .WithMany(z => z.RoutesAsEndZone)
                .HasForeignKey(r => r.EndZoneId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CostTransaction>()
                .HasOne(ct => ct.Employee)
                .WithMany(e => e.CostTransactions)
                .HasForeignKey(ct => ct.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Route)
                .WithMany(r => r.Trips)
                .HasForeignKey(t => t.RouteId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<RouteDetail>(entity =>
            {
                entity.ToTable("RouteDetail");

                entity.HasKey(x => x.RouteDetailId);

                entity.Property(x => x.RouteDetailId)
                    .ValueGeneratedOnAdd();

                entity.Property(x => x.RouteId)
                    .IsRequired();

                entity.Property(x => x.Direction)
                    .IsRequired();

                entity.Property(x => x.DepartureTime)
                    .IsRequired();

                entity.Property(x => x.EncodedPolyline)
                    .IsRequired();

                entity.HasOne(x => x.Route)
                    .WithMany(x => x.RouteDetail)
                    .HasForeignKey(x => x.RouteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<RouteH3>(entity =>
            {
                entity.ToTable("RouteH3");

                entity.HasKey(x => new
                {
                    x.RouteDetailId,
                    x.H3Cell
                });

                entity.Property(x => x.RouteDetailId)
                    .IsRequired();

                entity.Property(x => x.H3Cell)
                    .IsRequired();

                entity.Property(x => x.Sequence)
                    .IsRequired();

                entity.Property(x => x.DepartureTime)
                    .IsRequired();

                entity.HasOne(x => x.RouteDetail)
                    .WithMany(x => x.H3Cells)
                    .HasForeignKey(x => x.RouteDetailId)
                    .OnDelete(DeleteBehavior.Cascade);
                // indexing for efficient querying by H3Cell and DepartureTime
                entity.HasIndex(x => new
                {
                    x.H3Cell,
                    x.DepartureTime
                })
                .HasDatabaseName("RouteH3_H3Cell_DepartureTime")
                .IncludeProperties(x => new
                {
                    x.RouteDetailId,
                    x.Sequence
                });
            });
        }
    }
}
