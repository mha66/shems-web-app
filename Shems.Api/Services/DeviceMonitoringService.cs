using Hangfire.Console;
using Hangfire.Server;
using Microsoft.EntityFrameworkCore;
using Shems.Api.Database;
using Shems.Api.Interfaces;
using Shems.Api.Models; // NEW: Required to access DeviceAlertEvent

namespace Shems.Api.Services;

public class DeviceMonitoringService : IDeviceMonitoringService
{
    private readonly ApplicationDbContext _context;

    public DeviceMonitoringService(ApplicationDbContext context)
    {
        _context = context;
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

        bool newAlertsGenerated = false;

        // Cross-reference the thresholds
        foreach (var profile in profiles)
        {
            var spikingDevices = profile.MonitoredDevices
                .Where(d => d.IsOn && d.CurrentPowerDraw > profile.Threshold)
                .ToList();

            // If no devices are spiking for this profile, skip to the next profile
            if (!spikingDevices.Any()) continue;

            // Fetch users subscribed to this specific alert profile
            var subscriptions = await _context.AlertSubscriptions
                .Where(sub => sub.AlertProfileId == profile.Id)
                .AsNoTracking()
                .ToListAsync();

            if (!subscriptions.Any())
            {
                jobContext.WriteLine($"[{profile.AlertType}] triggered, but no users are subscribed to it.");
                continue;
            }

            foreach (var device in spikingDevices)
            {
                // Format the message once
                var message = $"Warning: '{device.Name}' is drawing {device.CurrentPowerDraw}W (Limit: {profile.Threshold}W).";
                
                // Log it to the Hangfire console for the Admin
                jobContext.WriteLine($"ALERT [{profile.AlertType}]: {message}");

                // Create a personalized alert in the database for EACH subscribed user
                foreach (var sub in subscriptions)
                {
                    var newAlert = new DeviceAlertEvent
                    {
                        DeviceId = device.Id,
                        ResidentId = sub.ResidentId,
                        Message = message,
                        Timestamp = DateTime.UtcNow + TimeSpan.FromHours(3), // Adjust to local time (UTC+3)
                        IsRead = false
                    };
                    
                    _context.DeviceAlertEvents.Add(newAlert);
                    newAlertsGenerated = true;
                }
            }
        }

        // Save all generated alerts to the database in one single transaction
        if (newAlertsGenerated)
        {
            await _context.SaveChangesAsync();
            jobContext.WriteLine("Successfully saved personalized alerts to the database.");
        }
    }
}