using Hangfire.Server;

namespace Shems.Api.Interfaces;

public interface IDeviceMonitoringService
    {
        Task CheckDevicePowerDrawsAsync(PerformContext context);
    }