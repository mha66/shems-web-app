using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;
public class CreateAlertProfileDto
{
    [Required(ErrorMessage = "Alert type is required.")]
    [MaxLength(100)]
    public string AlertType { get; set; } = string.Empty; // example: "High Power Draw", "Offline"

    [Required(ErrorMessage = "Alert threshold is required.")]
    public double? Threshold { get; set; }
}