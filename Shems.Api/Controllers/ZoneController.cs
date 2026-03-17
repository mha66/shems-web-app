using Microsoft.AspNetCore.Mvc;
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

}
