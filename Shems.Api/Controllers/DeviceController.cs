using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;

namespace Shems.Api.Controllers;

[ApiController]
[Route("api/device")]
[Authorize]
public class DeviceController : ControllerBase
{
    IDeviceService deviceService;

    public DeviceController(IDeviceService deviceService)
    {
        this.deviceService = deviceService;
    }

    // GET: api/device
    [HttpGet]
    public async Task<IActionResult> GetAllDevices()
    {
        var devices = await deviceService.GetAllDevicesAsync();
        return Ok(devices);
    }

    // GET: api/device/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDeviceById(int id)
    {
        var device = await deviceService.GetDeviceByIdAsync(id);
        if (device == null)
            return NotFound();

        return Ok(device);
    }

    // POST: api/device
    [HttpPost]
    [Authorize(Roles = "Admin")] // Only Admins should be adding new hardware to the house
    public async Task<IActionResult> CreateDevice([FromBody] CreateDeviceDto createDto)
    {
        // The [ApiController] attribute ensures DTO validation happens automatically here
        // If createDto violates [Required] or [MaxLength], it returns a 400 Bad Request
        var newDevice = await deviceService.CreateDeviceAsync(createDto);

        return CreatedAtAction(nameof(GetDeviceById), new { id = newDevice.Id }, newDevice);
    }

    // PUT: api/device/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateDeviceStatus(int id, [FromBody] UpdateDeviceStatusDto updateDto)
    {
        // A standard user/resident can toggle their own devices
        var success = await deviceService.UpdateDeviceStatusAsync(id, updateDto);

        if (!success)
            return NotFound($"Device with ID {id} not found.");

        return NoContent(); // Standard 204 response for a successful PUT request
    }

    // DELETE: api/device/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admins should be removing hardware
    public async Task<IActionResult> DeleteDevice(int id)
    {
        var success = await deviceService.DeleteDeviceAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }

    // POST: api/device/5/alerts/2
    [HttpPost("{deviceId}/alerts/{alertProfileId}")]
    [Authorize(Roles = "Admin")] 
    public async Task<IActionResult> AssignAlertProfile(int deviceId, int alertProfileId)
    {
        var success = await deviceService.AssignAlertProfileAsync(deviceId, alertProfileId);

        // Returns a 400 Bad Request if the device/profile doesn't exist, or if they are already linked together.
        if (!success)
            return BadRequest("Failed to assign alert profile. Ensure both IDs exist and are not already linked.");

        return Ok("Alert profile successfully assigned to the device.");
    }
}
