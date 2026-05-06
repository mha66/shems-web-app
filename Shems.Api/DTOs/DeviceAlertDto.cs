namespace Shems.Api.DTOs;

public class DeviceAlertDto
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string DeviceName { get; set; } = string.Empty; // Useful for the UI to say "Kitchen Fridge is spiking!"
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
}
