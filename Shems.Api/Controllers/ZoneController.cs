using Microsoft.AspNetCore.Mvc;
using Shems.Api.DTOs;
using Shems.Api.Interfaces;

namespace Shems.Api.Controllers;

[ApiController]
[Route("api/zone")]
public class ZoneController : ControllerBase
{
    IZoneService zoneService;
    public ZoneController(IZoneService zoneService)
    {
        this.zoneService = zoneService;
    }

    // GET: api/zone
    [HttpGet]
    public async Task<IActionResult> GetAllZones()
    {
        var zones = await zoneService.GetAllZoneSummariesAsync();
        return Ok(zones);
    }

    // GET: api/zone/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetZoneById(int id)
    {
        var zone = await zoneService.GetZoneByIdAsync(id);
        if (zone == null)
            return NotFound();

        return Ok(zone);
    }

    // POST: api/zone
    [HttpPost]
    //[Authorize(Roles = "Admin")] // Restrict creation to Admins
    public async Task<IActionResult> CreateZone([FromBody] CreateZoneDto createZoneDto)
    {
        // The [ApiController] attribute ensures DTO validation happens automatically here
        // If createZoneDto violates [Required] or [MaxLength], it returns a 400 Bad Request

        var newZone = await zoneService.CreateZoneAsync(createZoneDto);

        // Returns a 201 Created and points to the GetZoneById endpoint
        return CreatedAtAction(nameof(GetZoneById), new { id = newZone.Id }, newZone);
    }

    // DELETE: api/zone/5
    [HttpDelete("{id}")]
    //[Authorize(Roles = "Admin")] // Restrict deletion to Admins
    public async Task<IActionResult> DeleteZone(int id)
    {
        var success = await zoneService.DeleteZoneAsync(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent(); // Standard REST response for a successful delete
    }
}
