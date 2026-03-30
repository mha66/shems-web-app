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
    }
}