using ComercioEletronico.WebAPI.Data.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ComercioEletronico.WebAPI.Services
{
    public class JwtSecurityService
    {
        private readonly string _secret;
        private readonly string _expDate;

        public JwtSecurityService(IConfiguration config)
        {
            _secret = config.GetSection("JWT").GetSection("secret").Value;
            _expDate = config.GetSection("JWT").GetSection("expirationInMinutes").Value;
        }

        public string GenerateJwtToken(Client client)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = typeof(Program).FullName,
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, client.Email),
                    new Claim(ClaimTypes.Name, client.Name),
                    new Claim(ClaimTypes.NameIdentifier, client.Id.ToString()),
                    new Claim(ClaimTypes.Role, client.Role.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_expDate)),
                Issuer = typeof(JwtSecurityService).FullName,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
