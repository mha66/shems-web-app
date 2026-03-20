using Shems.Api.DTOs;

namespace Shems.Api.Interfaces;

public interface IDeviceService
{
    Task<IEnumerable<DeviceSummaryDto>> GetAllDevicesAsync();
    Task<DeviceSummaryDto?> GetDeviceByIdAsync(int id);
    Task<DeviceSummaryDto> CreateDeviceAsync(CreateDeviceDto createDto);
    Task<bool> UpdateDeviceStatusAsync(int id, UpdateDeviceStatusDto updateDto);
    Task<bool> DeleteDeviceAsync(int id);
    Task<bool> AssignAlertProfileAsync(int deviceId, int alertProfileId);
}
