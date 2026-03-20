using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;

public class CreateDeviceDto
{
    [Required(ErrorMessage = "Device name is required.")]
    [MaxLength(100, ErrorMessage = "Device name cannot exceed 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "A device must be assigned to a Zone.")]
    public int? ZoneId { get; set; }
}