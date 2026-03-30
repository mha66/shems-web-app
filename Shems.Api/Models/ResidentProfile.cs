using System.ComponentModel.DataAnnotations.Schema;

namespace Shems.Api.Models;
public class ResidentProfile
{
    public int Id { get; set; }
    public double TargetMonthlyBudget { get; set; }
    public double PreferredTemperature { get; set; }
    
    [ForeignKey("Resident")]
    public string ResidentId { get; set; } = string.Empty;
    public Resident? Resident { get; set; }
}