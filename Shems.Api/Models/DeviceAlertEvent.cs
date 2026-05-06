using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shems.Api.Models;

public class DeviceAlertEvent
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int DeviceId { get; set; }

    [Required]
    public string ResidentId { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Message { get; set; } = string.Empty;

    // Automatically set the time the alert was created
    public DateTime Timestamp { get; set; } = DateTime.UtcNow + TimeSpan.FromHours(3); // Adjust to local time (UTC+3)

    // All new alerts are unread by default
    public bool IsRead { get; set; } = false;

    // Navigation Property: Allows EF Core to easily fetch the related device details
    [ForeignKey("DeviceId")]
    public Device? Device { get; set; }
}
