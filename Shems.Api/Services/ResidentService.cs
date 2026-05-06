using Microsoft.EntityFrameworkCore;
using Shems.Api.Database;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using Shems.Api.Models;

namespace Shems.Api.Services
{
    public class ResidentService : IResidentService
    {
        private readonly ApplicationDbContext _context;

        public ResidentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResidentDashboardDto?> GetResidentDashboardAsync(string residentId)
        {
            // Fetch the user and their profile
            var resident = await _context.Users
                .Include(u => u.Profile)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == residentId);

            if (resident == null) 
                return null;

            // Perform aggregation to get the current state of the house
            var homeStats = await _context.Devices
                .AsNoTracking()
                .Where(d => d.IsOn)
                .GroupBy(d => 1) // Group everything into one bucket to run aggregate math
                .Select(g => new 
                {
                    TotalPower = g.Sum(d => d.CurrentPowerDraw),
                    ActiveCount = g.Count()
                })
                .FirstOrDefaultAsync();

            // Map it all into the final Dashboard DTO
            return new ResidentDashboardDto
            {
                Username = resident.UserName ?? "Unknown User",
                FirstName = resident.FirstName ?? "First",
                LastName = resident.LastName ?? "Last",
                TargetMonthlyBudget = resident.Profile?.TargetMonthlyBudget ?? 0,
                PreferredTemperature = resident.Profile?.PreferredTemperature ?? 22.0, // Default 22°C
                CurrentHomePowerDraw = homeStats?.TotalPower ?? 0,
                ActiveDevicesCount = homeStats?.ActiveCount ?? 0
            };
        }

        public async Task<bool> UpdateProfileSettingsAsync(string residentId, UpdateProfileDto updateDto)
        {
            // Note: We use the residentId to find the profile, ensuring users can only update their own data
            var profile = await _context.ResidentProfiles.FirstOrDefaultAsync(p => p.ResidentId == residentId);

            if (profile == null)
            {
                // The user exists, but they haven't set up a profile yet --> create it.
                profile = new ResidentProfile
                {
                    ResidentId = residentId,
                    TargetMonthlyBudget = updateDto.TargetMonthlyBudget!.Value,
                    PreferredTemperature = updateDto.PreferredTemperature!.Value
                };
                _context.ResidentProfiles.Add(profile);
            }
            else
            {
                // The profile exists --> update it
                profile.TargetMonthlyBudget = updateDto.TargetMonthlyBudget!.Value;
                profile.PreferredTemperature = updateDto.PreferredTemperature!.Value;
            }

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<ResidentSummaryDto>> GetAllResidentsAsync()
        {
            return await _context.Users
                .Select(u => new ResidentSummaryDto
                {
                    Id = u.Id,
                    UserName = u.UserName!,
                    Email = u.Email!
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<int>> GetResidentSubscriptionsAsync(string residentId)
        {
            return await _context.AlertSubscriptions
                .Where(sub => sub.ResidentId == residentId)
                .Select(sub => sub.AlertProfileId)
                .ToListAsync();
        }

        public async Task<bool> UpdateResidentSubscriptionsAsync(string residentId, List<int> alertProfileIds)
        {
            // Verify user exists
            var resident = await _context.Users.FindAsync(residentId);
            if (resident == null) return false;

            // Delete old subscriptions
            var oldSubscriptions = _context.AlertSubscriptions.Where(sub => sub.ResidentId == residentId);
            _context.AlertSubscriptions.RemoveRange(oldSubscriptions);

            // Add new subscriptions
            foreach (var profileId in alertProfileIds)
            {
                _context.AlertSubscriptions.Add(new AlertSubscription
                {
                    ResidentId = residentId,
                    AlertProfileId = profileId
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<DeviceAlertDto>> GetUnreadAlertsAsync(string residentId)
        {
            return await _context.DeviceAlertEvents
                .Include(a => a.Device) // Pulls in the related device data
                .Where(a => a.ResidentId == residentId && !a.IsRead)
                .OrderByDescending(a => a.Timestamp) // Newest alerts first
                .Select(a => new DeviceAlertDto
                {
                    Id = a.Id,
                    DeviceId = a.DeviceId,
                    DeviceName = a.Device != null ? a.Device.Name : "Unknown Device",
                    Message = a.Message,
                    Timestamp = a.Timestamp,
                    IsRead = a.IsRead
                })
                .ToListAsync();
        }

        public async Task<bool> MarkAlertAsReadAsync(int alertId, string residentId)
        {
            // Ensure the user actually owns this alert before marking it read
            var alert = await _context.DeviceAlertEvents
                .FirstOrDefaultAsync(a => a.Id == alertId && a.ResidentId == residentId);

            if (alert == null) return false;

            alert.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> MarkAllAlertsAsReadAsync(string residentId)
        {
            // EF Core 7+ Bulk Update: Instantly flips all unread alerts to true in one SQL query
            var updatedCount = await _context.DeviceAlertEvents
                .Where(a => a.ResidentId == residentId && !a.IsRead)
                .ExecuteUpdateAsync(s => s.SetProperty(a => a.IsRead, true));

            return updatedCount > 0; // Returns true if at least one alert was updated
        }
    }
}