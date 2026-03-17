using Shems.Api.DTOs;

namespace Shems.Api.Interfaces;

public interface IZoneService
{
    Task<IEnumerable<ZoneSummaryDto>> GetAllZoneSummariesAsync();
    Task<ZoneSummaryDto?> GetZoneByIdAsync(int id);
    Task<ZoneSummaryDto> CreateZoneAsync(CreateZoneDto createZoneDto);
    Task<bool> DeleteZoneAsync(int id);
    
}