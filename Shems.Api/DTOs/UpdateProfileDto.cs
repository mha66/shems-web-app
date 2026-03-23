using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;
public class UpdateProfileDto
{
    [Required]
    [Range(10, 1000, ErrorMessage = "Please set a realistic monthly budget.")]
    public double? TargetMonthlyBudget { get; set; }

    [Required]
    [Range(5, 45, ErrorMessage = "Preferred temperature must be between 5°C and 45°C.")]
    public double? PreferredTemperature { get; set; }
}