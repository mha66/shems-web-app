using Microsoft.AspNetCore.Identity;

namespace Shems.Api.Models;

public class Resident : IdentityUser
{
    public string Role { get; set; } = "User"; // For Authorization

    // One-to-One relationship with ResidentProfile
    public ResidentProfile? Profile { get; set; }
}
