namespace Shems.Api.DTOs;
public class ResidentDashboardDto
{
    public string Username { get; set; } = string.Empty;
    public double TargetMonthlyBudget { get; set; }
    public double PreferredTemperature { get; set; }
    public double CurrentHomePowerDraw { get; set; }
    public int ActiveDevicesCount { get; set; }
}