using ComercioEletronico.WebAPI.Data;
using ComercioEletronico.WebAPI.Data.Models;
using ComercioEletronico.WebAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ComercioEletronico.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext applicationDbContext, IConfiguration configuration)
        {
            _applicationDbContext = applicationDbContext;
            _configuration = configuration;
        }

        [HttpPost("token"), AllowAnonymous]
        public async Task<ActionResult<JwtSecurityToken>> PostToken(Client client)
        {
            try
            {
                if (await _applicationDbContext.Clients
                    .Where(_ => _.Email == client.Email)
                    .Where(_ => _.Password == client.Password)
                    .FirstAsync() is Client _client)
                {

                    var jwt = new JwtSecurityService(_configuration);

                    var token = jwt.GenerateJwtToken(_client);

                    var jwtSecurityToken = new JwtSecurityToken
                    {
                        Schema = JwtBearerDefaults.AuthenticationScheme,
                        Token = token
                    };

                    return jwtSecurityToken;
                }

                throw new NullReferenceException();
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception);
            }

            return NotFound();
        }
    }
}
