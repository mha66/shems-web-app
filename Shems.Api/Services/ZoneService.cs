using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using Shems.Api.Database;
using Microsoft.EntityFrameworkCore;
using Shems.Api.Models;

namespace Shems.Api.Services;
public class ZoneService : IZoneService
{
    private readonly ApplicationDbContext _context;

    public ZoneService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ZoneSummaryDto>> GetAllZoneSummariesAsync()
    {
        return await _context.Zones
                .AsNoTracking()
                .Select(z => new ZoneSummaryDto
                {
                    Id = z.Id,
                    ZoneName = z.Name,
                    ActiveDevicesCount = z.Devices.Count(d => d.IsOn),
                    TotalCurrentWattage = z.Devices.Sum(d => d.CurrentPowerDraw)
                })
                .ToListAsync();
    }

    public async Task<ZoneSummaryDto?> GetZoneByIdAsync(int id)
    {
        return await _context.Zones
                .AsNoTracking()
                .Where(z => z.Id == id)
                .Select(z => new ZoneSummaryDto
                {
                    Id = z.Id,
                    ZoneName = z.Name,
                    ActiveDevicesCount = z.Devices.Count(d => d.IsOn),
                    TotalCurrentWattage = z.Devices.Sum(d => d.CurrentPowerDraw)
                })
                .FirstOrDefaultAsync();
    }

    public async Task<ZoneSummaryDto> CreateZoneAsync(CreateZoneDto createZoneDto)
    {
        // Map the DTO to the Entity
        var newZone = new Zone
        {
            Name = createZoneDto.Name
        };

        _context.Zones.Add(newZone);
        await _context.SaveChangesAsync();

        // Return the created object as a Read DTO
        return new ZoneSummaryDto
        {
            Id = newZone.Id,
            ZoneName = newZone.Name,
            ActiveDevicesCount = 0,
            TotalCurrentWattage = 0
        };
    }

    public async Task<bool> DeleteZoneAsync(int id)
    {
        var zone = await _context.Zones.FindAsync(id);
        if (zone == null)
            return false;

        _context.Zones.Remove(zone);
        await _context.SaveChangesAsync();
        return true;
    }
}