using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Shems.Api.DTOs;
using Shems.Api.Models;

namespace Shems.Api.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<Resident> _userManager;
    private readonly IConfiguration _configuration;

    // Injecting Identity's UserManager and the appsettings.json Configuration
    public AuthController(UserManager<Resident> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var userExists = await _userManager.FindByNameAsync(registerDto.Username);
        if (userExists != null)
            return Conflict("Username already exists!");

        // Create the new Resident
        var user = new Resident
        {
            Email = registerDto.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = registerDto.Username,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Role = "User" // Default role.
        };

        // UserManager automatically hashes the password and saves it to the database
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            var (token, expiration) = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            SetTokenCookie(token);
            SetRefreshTokenCookie(refreshToken);
            AuthResponseDto authResponse = new AuthResponseDto
            {
                Token = token,
                Expiration = expiration
            };
            return Ok(authResponse);
        }

        return BadRequest(result.Errors);
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // Find the user
        var user = await _userManager.FindByNameAsync(loginDto.Username);

        // Check if user exists and password is correct
        if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            var (token, expiration) = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            SetTokenCookie(token);
            SetRefreshTokenCookie(refreshToken);
            AuthResponseDto authResponse = new AuthResponseDto
            {
                Token = token,
                Expiration = expiration
            };
            return Ok(authResponse);
        }

        return Unauthorized("Invalid username or password!");
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        // Grab the refresh token from the cookie
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { Message = "No refresh token found in cookies." });

        // Find the user attached to this specific token
        var user = _userManager.Users.SingleOrDefault(u => u.RefreshToken == refreshToken);

        // Validate existence and expiration
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return Unauthorized(new { Message = "Invalid or expired refresh token. Please log in again." });

        // Token Rotation: Generate brand new tokens to prevent reuse
        var (newJwtToken, _) = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        // Update the database
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        // Set the new cookies
        SetTokenCookie(newJwtToken);
        SetRefreshTokenCookie(newRefreshToken);

        return Ok(new { Message = "Session successfully refreshed." });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // Grab the token to identify the user
        var refreshToken = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            var user = _userManager.Users.SingleOrDefault(u => u.RefreshToken == refreshToken);
            if (user != null)
            {
                // Nullify the token in the database
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _userManager.UpdateAsync(user);
            }
        }

        // Delete the cookies from the user's browser
        Response.Cookies.Delete("jwt");
        Response.Cookies.Delete("refreshToken");

        return Ok(new { Message = "Logged out successfully." });
    }

    private (string Token, string Expiration) GenerateJwtToken(Resident user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            //new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // Short-lived JWT for better security
            signingCredentials: creds
        );

        return (
            new JwtSecurityTokenHandler().WriteToken(token),
            token.ValidTo.ToString("yyyy-MM-dd HH:mm:ss") // ISO 8601 format
        );
    }

    private void SetTokenCookie(string token)
    {
        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddMinutes(15)
        });
    }

    private string GenerateRefreshToken()
    {
        // Generates a cryptographically secure random 64-byte string
        var randomNumber = new byte[64];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(7) // Lives much longer than the JWT
        });
    }

}