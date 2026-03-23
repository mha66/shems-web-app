using Shems.Api.DTOs;

namespace Shems.Api.Interfaces;
public interface IResidentService
{
    Task<ResidentDashboardDto?> GetResidentDashboardAsync(string residentId);
    Task<bool> UpdateProfileSettingsAsync(string residentId, UpdateProfileDto updateDto);
}
