using Microsoft.EntityFrameworkCore;
using Shems.Api.Database;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using Shems.Api.Models;

namespace Shems.Api.Services;
public class AlertProfileService : IAlertProfileService
{
    private readonly ApplicationDbContext _context;

    public AlertProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AlertProfileSummaryDto>> GetAllAlertProfilesAsync()
    {
        return await _context.AlertProfiles
            .AsNoTracking()
            .Select(ap => new AlertProfileSummaryDto
            {
                Id = ap.Id,
                AlertType = ap.AlertType,
                Threshold = ap.Threshold,
                MonitoredDeviceCount = ap.MonitoredDevices.Count(),
                MonitoredDevices = ap.MonitoredDevices.Select(d => d.Name).ToList()
            })
            .ToListAsync();
    }

    public async Task<AlertProfileSummaryDto?> GetAlertProfileByIdAsync(int id)
    {
        return await _context.AlertProfiles
            .AsNoTracking()
            .Where(ap => ap.Id == id)
            .Select(ap => new AlertProfileSummaryDto
            {
                Id = ap.Id,
                AlertType = ap.AlertType,
                Threshold = ap.Threshold,
                MonitoredDeviceCount = ap.MonitoredDevices.Count(),
                MonitoredDevices = ap.MonitoredDevices.Select(d => d.Name).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<AlertProfileSummaryDto> CreateAlertProfileAsync(CreateAlertProfileDto createDto)
    {
        var profile = new AlertProfile
        {
            AlertType = createDto.AlertType,
            Threshold = createDto.Threshold!.Value
        };

        _context.AlertProfiles.Add(profile);
        await _context.SaveChangesAsync();

        return new AlertProfileSummaryDto
        {
            Id = profile.Id,
            AlertType = profile.AlertType,
            Threshold = profile.Threshold,
            MonitoredDeviceCount = 0,
            MonitoredDevices = new List<string>()
        };
    }

    public async Task<bool> UpdateAlertThresholdAsync(int id, UpdateAlertProfileDto updateDto)
    {
        var profile = await _context.AlertProfiles.FindAsync(id);
        if (profile == null) 
            return false;

        profile.Threshold = updateDto.Threshold!.Value;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAlertProfileAsync(int id)
    {
        var profile = await _context.AlertProfiles.FindAsync(id);
        if (profile == null) 
            return false;

        _context.AlertProfiles.Remove(profile);
        await _context.SaveChangesAsync();
        return true;
    }
}