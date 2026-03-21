namespace Shems.Api.DTOs;
public class AlertProfileSummaryDto
{
    public int Id { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public double Threshold { get; set; }
    public int MonitoredDeviceCount { get; set; }
    public List<string> MonitoredDevices { get; set; } = new List<string>();
}