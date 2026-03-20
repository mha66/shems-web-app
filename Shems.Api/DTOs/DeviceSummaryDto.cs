using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;

public class DeviceSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsOn { get; set; }
        public double CurrentPowerDraw { get; set; }
        public string ZoneName { get; set; } = string.Empty; // from the Zone entity
        public List<string> ActiveAlerts { get; set; } = new List<string>(); 
    }