using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using System.Security.Claims;

namespace Shems.Api.Controllers;

[Route("api/resident")]
[ApiController]
[Authorize]
public class ResidentController : ControllerBase
{
    private readonly IResidentService _residentService;

    public ResidentController(IResidentService residentService)
    {
        _residentService = residentService;
    }

    // GET: api/resident/18c0b788-a238-43c4-9077-d20e30567216/dashboard
    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> GetDashboard(string id)
    {
        // Security Check: Grab the User ID hiding inside the JWT token
        // Sub claim is renamed to NameIdentifier when using AspNet Identity, so look for that instead of "sub"
        var tokenUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        System.Diagnostics.Debug.WriteLine($"Token User ID: {tokenUserId}, Requested Dashboard ID: {id}");
        // If the user is trying to access ID x, but their token says they are ID y, block them
        // (Unless they are an Admin, who can view anyone's dashboard)
        if (tokenUserId != id && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        var dashboard = await _residentService.GetResidentDashboardAsync(id);
        if (dashboard == null)
        {
            return NotFound("Resident not found.");
        }

        return Ok(dashboard);
    }

    // PUT: api/resident/18c0b788-a238-43c4-9077-d20e30567216/profile
    [HttpPut("{id}/profile")]
    public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdateProfileDto updateDto)
    {
        // Same Security Check to prevent users from changing each other's budgets
        var tokenUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (tokenUserId != id && !User.IsInRole("Admin"))
        {
            return Forbid(); 
        }

        var success = await _residentService.UpdateProfileSettingsAsync(id, updateDto);

        if (!success)
        {
            return NotFound($"Resident with ID {id} not found.");
        }

        return NoContent();
    }

    // Get all users so the Admin can populate a dropdown
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllResidents()
    {
        var residents = await _residentService.GetAllResidentsAsync();
        return Ok(residents);
    }

    // Get the current subscriptions for a specific user to pre-check the boxes
    [HttpGet("{id}/subscriptions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetResidentSubscriptions(string id)
    {
        var subscribedProfileIds = await _residentService.GetResidentSubscriptionsAsync(id);
        return Ok(subscribedProfileIds);
    }

    // Save the new list of checked boxes
    [HttpPost("{id}/subscriptions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateResidentSubscriptions(string id, [FromBody] SubscriptionUpdateDto dto)
    {
        var success = await _residentService.UpdateResidentSubscriptionsAsync(id, dto.AlertProfileIds);
        
        // If the service returns false, the user ID was invalid.
        if (!success) 
            return NotFound("User not found.");

        return Ok("Subscriptions successfully updated.");
    }

    [HttpGet("{id}/alerts/unread")]
    [Authorize] // Standard users can access this, not just Admins
    public async Task<IActionResult> GetUnreadAlerts(string id)
    {
        var alerts = await _residentService.GetUnreadAlertsAsync(id);
        return Ok(alerts);
    }

    [HttpPut("{id}/alerts/{alertId}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAlertAsRead(string id, int alertId)
    {
        var success = await _residentService.MarkAlertAsReadAsync(alertId, id);
        if (!success) return NotFound("Alert not found or access denied.");
        
        return Ok();
    }

    [HttpPut("{id}/alerts/read-all")]
    [Authorize]
    public async Task<IActionResult> MarkAllAlertsAsRead(string id)
    {
        await _residentService.MarkAllAlertsAsReadAsync(id);
        return Ok();
    }
}
