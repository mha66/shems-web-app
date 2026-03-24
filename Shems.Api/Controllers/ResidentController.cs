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
}
