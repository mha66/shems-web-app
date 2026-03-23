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
            SetTokenCookie(token);
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
            SetTokenCookie(token);
            AuthResponseDto authResponse = new AuthResponseDto
            {
                Token = token,
                Expiration = expiration
            };
            return Ok(authResponse);    
        }
        
        return Unauthorized("Invalid username or password!");
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
            expires: DateTime.UtcNow.AddHours(3),
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
            Expires = DateTimeOffset.UtcNow.AddHours(3)
        });
    }

}