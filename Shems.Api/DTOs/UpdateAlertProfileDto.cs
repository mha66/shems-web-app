using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;
public class UpdateAlertProfileDto
{
    [Required(ErrorMessage = "Alert threshold is required.")]
    public double? Threshold { get; set; }
}