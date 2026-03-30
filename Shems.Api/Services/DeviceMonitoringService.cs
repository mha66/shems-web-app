using Hangfire.Console;
using Hangfire.Server;
using Microsoft.EntityFrameworkCore;
using Shems.Api.Database;
using Shems.Api.Interfaces;

namespace Shems.Api.Services;

public class DeviceMonitoringService : IDeviceMonitoringService
{
    private readonly ApplicationDbContext _context;
    // private readonly ILogger<DeviceMonitoringService> _logger;

    public DeviceMonitoringService(ApplicationDbContext context)
    {
        _context = context;
        //_logger = logger;
    }

    public async Task CheckDevicePowerDrawsAsync(PerformContext jobContext)
    {
        jobContext.WriteLine("Hangfire Background Job: Checking for power alerts...");

        // Fetch all profiles and their currently active devices
        var profiles = await _context.AlertProfiles
            .Include(ap => ap.MonitoredDevices)
            .AsNoTracking()
            .ToListAsync();

        if (!profiles.Any()) 
        {
            jobContext.WriteLine("No active alert profiles found.");
            return;
        }

        // Cross-reference the thresholds
        foreach (var profile in profiles)
        {
            var spikingDevices = profile.MonitoredDevices
                .Where(d => d.IsOn && d.CurrentPowerDraw > profile.Threshold)
                .ToList();

            foreach (var device in spikingDevices)
            {
                jobContext.WriteLine($"ALERT: [{profile.AlertType}] triggered! " +
                                   $"Device '{device.Name}' is drawing {device.CurrentPowerDraw}W " +
                                   $"(Threshold: {profile.Threshold}W).");
            }
        }
    }
}
