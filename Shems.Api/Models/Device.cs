using System.ComponentModel.DataAnnotations.Schema;

namespace Shems.Api.Models;

public class Device
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // example: "Air Conditioner"
    public bool IsOn { get; set; }
    public double CurrentPowerDraw { get; set; } // in watts
    
    [ForeignKey("Zone")]
    public int ZoneId { get; set; }
    public Zone? Zone { get; set; }

    // Many-to-Many
    public ICollection<AlertProfile> AlertProfiles { get; set; } = new List<AlertProfile>();

}