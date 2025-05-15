using BL.DTOs;
using BL.IService;
using Microsoft.AspNetCore.Mvc;

namespace VoiceSummarizer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserService _userService;
       // private readonly IJwtService _jwtService;

        public AuthController(IUserService userService
            //,IJwtService jwtService
            )
        {
            _userService = userService;
           // _jwtService = jwtService;
        }
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] UserLoginDto dto)
        {
            try
            {
                var user = await _userService.LoginAsync(dto);
                if (user == null)
                    return Unauthorized("Invalid email or password.");

                return Ok(user);
            }
            catch (Exception ex)
            {
                // זמנית - לא להשאיר בפרודקשן!
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] UserCreateDto user)
        {
            if (user == null)
                return BadRequest();
            
            var createdUser = await _userService.CreateUserAsync(user);
            return CreatedAtRoute("GetUserByIdRoute", new { id = createdUser.Id }, createdUser);

        }
    }
}
