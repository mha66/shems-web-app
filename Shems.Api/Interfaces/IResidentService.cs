using Shems.Api.DTOs;

namespace Shems.Api.Interfaces;
public interface IResidentService
{
    Task<ResidentDashboardDto?> GetResidentDashboardAsync(string residentId);
    Task<bool> UpdateProfileSettingsAsync(string residentId, UpdateProfileDto updateDto);
    Task<IEnumerable<ResidentSummaryDto>> GetAllResidentsAsync();
    Task<IEnumerable<int>> GetResidentSubscriptionsAsync(string residentId);
    
    // Returns a boolean so the Controller knows if the user actually exists
    Task<bool> UpdateResidentSubscriptionsAsync(string residentId, List<int> alertProfileIds);
    Task<IEnumerable<DeviceAlertDto>> GetUnreadAlertsAsync(string residentId);
    Task<bool> MarkAlertAsReadAsync(int alertId, string residentId);
    Task<bool> MarkAllAlertsAsReadAsync(string residentId);
}
