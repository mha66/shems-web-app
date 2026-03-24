using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;

namespace Shems.Api.Controllers;

[ApiController]
[Route("api/alert")]
[Authorize] // Secures the entire controller by default
public class AlertProfileController : ControllerBase
{
    IAlertProfileService alertProfileService;

    public AlertProfileController(IAlertProfileService alertProfileService)
    {
        this.alertProfileService = alertProfileService;
    }

    // GET: api/alert
    [HttpGet]
    public async Task<IActionResult> GetAllAlertProfiles()
    {
        var profiles = await alertProfileService.GetAllAlertProfilesAsync();
        return Ok(profiles);
    }

    // GET: api/alert/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAlertProfileById(int id)
    {
        var profile = await alertProfileService.GetAlertProfileByIdAsync(id);
        if (profile == null)
            return NotFound();
        
        return Ok(profile);
    }

    // POST: api/alert
    [HttpPost]
    [Authorize(Roles = "Admin")] // Only Admins create new types of system alerts
    public async Task<IActionResult> CreateAlertProfile([FromBody] CreateAlertProfileDto createDto)
    {
        var newProfile = await alertProfileService.CreateAlertProfileAsync(createDto);
        return CreatedAtAction(nameof(GetAlertProfileById), new { id = newProfile.Id }, newProfile);
    }

    // PUT: api/alert/5/threshold
    [HttpPut("{id}/threshold")]
    [Authorize(Roles = "Admin")] // Only Admins should change system-wide thresholds
    public async Task<IActionResult> UpdateAlertThreshold(int id, [FromBody] UpdateAlertProfileDto updateDto)
    {
        var success = await alertProfileService.UpdateAlertThresholdAsync(id, updateDto);

        if (!success)
            return NotFound($"Alert Profile with ID {id} not found.");
        
        return NoContent();
    }

    // DELETE: api/alert/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admins should be able to delete alert profiles
    public async Task<IActionResult> DeleteAlertProfile(int id)
    {
        var success = await alertProfileService.DeleteAlertProfileAsync(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}