using System.ComponentModel.DataAnnotations;

namespace Shems.Api.Models;

public class AlertSubscription
{
    public int Id { get; set; }
    
    // The user who will receive the alert
    [Required]
    public string ResidentId { get; set; } = string.Empty;
    public Resident? Resident { get; set; }

    // The rule they are subscribed to
    [Required]
    public int AlertProfileId { get; set; }
    public AlertProfile? AlertProfile { get; set; }
}