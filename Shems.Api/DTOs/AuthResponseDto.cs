namespace Shems.Api.DTOs;
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Expiration { get; set; } = string.Empty;
}