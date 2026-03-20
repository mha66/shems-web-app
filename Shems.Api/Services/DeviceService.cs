using Microsoft.EntityFrameworkCore;
using Shems.Api.Database;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using Shems.Api.Models;

namespace Shems.Api.Services;

public class DeviceService : IDeviceService
{
    private readonly ApplicationDbContext _context;

    public DeviceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DeviceSummaryDto>> GetAllDevicesAsync()
    {
        return await _context.Devices
            .AsNoTracking()
            .Select(d => new DeviceSummaryDto  // Select automatically projects the related Zone's name and the list of AlertProfiles into the DTO
            {
                Id = d.Id,
                Name = d.Name,
                IsOn = d.IsOn,
                CurrentPowerDraw = d.CurrentPowerDraw,
                // Grabbing the related Zone's name directly via the navigation property
                ZoneName = (d.Zone != null) ? d.Zone.Name : "Unassigned",
                // Projecting the many-to-many list into a simple list of strings
                ActiveAlerts = d.AlertProfiles.Select(ap => ap.AlertType).ToList()
            })
            .ToListAsync();
    }

    public async Task<DeviceSummaryDto?> GetDeviceByIdAsync(int id)
    {
        return await _context.Devices
            .AsNoTracking()
            .Where(d => d.Id == id)
            .Select(d => new DeviceSummaryDto
            {
                Id = d.Id,
                Name = d.Name,
                IsOn = d.IsOn,
                CurrentPowerDraw = d.CurrentPowerDraw,
                ZoneName = (d.Zone != null) ? d.Zone.Name : "Unassigned",
                ActiveAlerts = d.AlertProfiles.Select(ap => ap.AlertType).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<DeviceSummaryDto> CreateDeviceAsync(CreateDeviceDto createDto)
    {
        var device = new Device
        {
            Name = createDto.Name,
            ZoneId = createDto.ZoneId!.Value, //.Value is safely used here because the DTO validation ensures it's not null
            IsOn = false, // Default to off when registered
            CurrentPowerDraw = 0
        };

        _context.Devices.Add(device);
        await _context.SaveChangesAsync();

        return new DeviceSummaryDto
        {
            Id = device.Id,
            Name = device.Name,
            IsOn = device.IsOn,
            CurrentPowerDraw = device.CurrentPowerDraw,
            ZoneName = (device.Zone != null) ? device.Zone.Name : "Unassigned",
            ActiveAlerts = new List<string>() // No alerts on creation
        };
    }

    public async Task<bool> UpdateDeviceStatusAsync(int id, UpdateDeviceStatusDto updateDto)
    {
        var device = await _context.Devices.FindAsync(id);
        if (device == null) 
            return false;

        device.IsOn = updateDto.IsOn!.Value; // .Value is safely used here because the DTO validation ensures it's not null
        device.CurrentPowerDraw = updateDto.CurrentPowerDraw;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteDeviceAsync(int id)
    {
        var device = await _context.Devices.FindAsync(id);
        if (device == null) 
            return false;

        _context.Devices.Remove(device);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AssignAlertProfileAsync(int deviceId, int alertProfileId)
    {
        // We must Include the AlertProfiles collection so EF Core knows what is already attached
        var device = await _context.Devices
            .Include(d => d.AlertProfiles)
            .FirstOrDefaultAsync(d => d.Id == deviceId);

        var alertProfile = await _context.AlertProfiles.FindAsync(alertProfileId);

        // Ensure both device and alert profile exist and prevent duplicate assignments
        if (device == null || alertProfile == null || device.AlertProfiles.Any(ap => ap.Id == alertProfileId))
            return false;

        device.AlertProfiles.Add(alertProfile);
        await _context.SaveChangesAsync();
        return true;
    }
}
