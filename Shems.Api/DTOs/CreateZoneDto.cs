
using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;
public class CreateZoneDto
{
    [Required(ErrorMessage = "Zone name is required.")]
    [MaxLength(50, ErrorMessage = "Zone name cannot exceed 50 characters.")]
    public string Name { get; set; } = string.Empty;
}