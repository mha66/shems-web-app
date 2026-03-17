using Microsoft.EntityFrameworkCore;
using Shems.Api.Models;

namespace Shems.Api.Database;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Zone> Zones { get; set; }
    public DbSet<Device> Devices { get; set; }
}