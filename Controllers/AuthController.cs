using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Data.SqlClient;

namespace DVI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            using var conn = new SqlConnection(_config.GetConnectionString("VastOfficeDb"));
            using var cmd = new SqlCommand(@"
                SELECT U.MECHANIC_NUMBER, U.PasswordHash, M.MECHANIC_NAME
                FROM DVIUsers U
                INNER JOIN MECHANIC M ON U.MECHANIC_NUMBER = M.MECHANIC_NUMBER
                WHERE U.Email = @Email", conn);

            cmd.Parameters.AddWithValue("@Email", request.Email);
            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            if (!reader.HasRows)
                return Unauthorized("Invalid credentials");

            await reader.ReadAsync();

            string mechNumber = reader["MECHANIC_NUMBER"].ToString()!;
            string hash = reader["PasswordHash"].ToString()!;

            if (!BCrypt.Net.BCrypt.Verify(request.Password, hash))
                return Unauthorized("Invalid credentials");

            string token = GenerateJwtToken(mechNumber, request.Email);
            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(string mechanicNumber, string email)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim("MechanicNumber", mechanicNumber)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpireMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}
