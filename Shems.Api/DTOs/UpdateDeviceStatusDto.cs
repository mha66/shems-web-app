using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace Shems.Api.DTOs;

public class UpdateDeviceStatusDto
{
    [Required(ErrorMessage = "Device Status (On/Off) is required.")]
    public bool? IsOn { get; set; }

    // Simulating a hardware update of its power draw
    [Range(0, 5000, ErrorMessage = "Power draw must be between 0 and 5000 watts.")]
    public double CurrentPowerDraw { get; set; }
}