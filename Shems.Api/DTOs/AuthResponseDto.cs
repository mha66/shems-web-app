namespace Shems.Api.DTOs;
public class AuthResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string Expiration { get; set; } = string.Empty;
}