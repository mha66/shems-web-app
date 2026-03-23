using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Shems.Api.Models;

namespace Shems.Api.Database;

public class ApplicationDbContext : IdentityDbContext<Resident>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public required DbSet<Zone> Zones { get; set; }
    public required DbSet<Device> Devices { get; set; }
    public required DbSet<AlertProfile> AlertProfiles { get; set; }
    public required DbSet<ResidentProfile> ResidentProfiles { get; set; }
}