using Shems.Api.DTOs;

namespace Shems.Api.Interfaces;
public interface IAlertProfileService
{
    Task<IEnumerable<AlertProfileSummaryDto>> GetAllAlertProfilesAsync();
    Task<AlertProfileSummaryDto?> GetAlertProfileByIdAsync(int id);
    Task<AlertProfileSummaryDto> CreateAlertProfileAsync(CreateAlertProfileDto createDto);
    Task<bool> UpdateAlertThresholdAsync(int id, UpdateAlertProfileDto updateDto);
    Task<bool> DeleteAlertProfileAsync(int id);
}