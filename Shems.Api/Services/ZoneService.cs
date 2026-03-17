using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using Shems.Api.Database;
using Microsoft.EntityFrameworkCore;


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
        throw new NotImplementedException();
    }

    public async Task<ZoneSummaryDto> CreateZoneAsync(CreateZoneDto createZoneDto)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteZoneAsync(int id)
    {
        throw new NotImplementedException();
    }
}