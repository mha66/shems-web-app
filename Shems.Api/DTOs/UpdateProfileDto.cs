using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;
public class UpdateProfileDto
{
    [Required]
    [Range(10, 1000, ErrorMessage = "Please set a realistic monthly budget.")]
    public double? TargetMonthlyBudget { get; set; }

    [Required]
    [Range(15, 30, ErrorMessage = "Preferred temperature must be between 15°C and 30°C.")]
    public double? PreferredTemperature { get; set; }
}