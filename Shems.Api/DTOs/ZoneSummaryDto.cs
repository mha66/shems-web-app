using System.ComponentModel.DataAnnotations;

namespace Shems.Api.DTOs;
    public class ZoneSummaryDto
    {
        public int Id { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public int ActiveDevicesCount { get; set; }
        public double TotalCurrentWattage { get; set; }
    }
