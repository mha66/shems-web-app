using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;
using System.Security.Claims; // Required for reading the JWT token data

namespace Shems.Api.Controllers;

[Route("api/resident")]
[ApiController]
//[Authorize] // Requires a valid JWT token
public class ResidentController : ControllerBase
{
    private readonly IResidentService _residentService;

    public ResidentController(IResidentService residentService)
    {
        _residentService = residentService;
    }

    // GET: api/resident/5/dashboard
    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> GetDashboard(string id)
    {
        // Security Check: Grab the User ID hiding inside the JWT token
        var tokenUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // If the user is trying to access ID 5, but their token says they are ID 2, block them
        // (Unless they are an Admin, who can view anyone's dashboard)
        // if (tokenUserId != id && !User.IsInRole("Admin"))
        // {
        //     return Forbid(); // Returns a 403 Forbidden HTTP status
        // }

        var dashboard = await _residentService.GetResidentDashboardAsync(id);
        if (dashboard == null)
        {
            return NotFound("Resident not found.");
        }

        return Ok(dashboard);
    }

    // PUT: api/resident/5/profile
    [HttpPut("{id}/profile")]
    public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdateProfileDto updateDto)
    {
        // Same Security Check to prevent users from changing each other's budgets
        // var tokenUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        // if (tokenUserId != id && !User.IsInRole("Admin"))
        // {
        //     return Forbid(); 
        // }

        var success = await _residentService.UpdateProfileSettingsAsync(id, updateDto);

        if (!success)
        {
            return NotFound($"Resident with ID {id} not found.");
        }

        return NoContent();
    }
}
