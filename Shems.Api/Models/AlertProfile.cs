namespace Shems.Api.Models;

public class AlertProfile
{
    public int Id { get; set; }
    public string AlertType { get; set; } = string.Empty; // Example: "Offline Warning"
    public double Threshold { get; set; } 
    
    // Many-to-Many
    public ICollection<Device> MonitoredDevices { get; set; } = new List<Device>();
}