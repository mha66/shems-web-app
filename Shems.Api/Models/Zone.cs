namespace Shems.Api.Models;

public class Zone
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; //example: "Living Room"
    
    // One-to-Many (One Zone has Many Devices)
    public ICollection<Device> Devices { get; set; } = new List<Device>();
}
