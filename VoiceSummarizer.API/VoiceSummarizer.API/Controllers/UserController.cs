using Microsoft.AspNetCore.Mvc;
using BL.IService;
using BL.DTOs;

namespace VoiceSummarizer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/User/{id}
        [HttpGet("{id}", Name = "GetUserByIdRoute")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        // POST: api/User
        //[HttpPost]
        //public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] UserCreateDto user)
        //{
        //    if (user == null)
        //        return BadRequest();

        //    var createdUser = await _userService.CreateUserAsync(user);
        //    return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        //}

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            var currentUserId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            await _userService.UpdateUserAsync(id, dto, currentUserId);
            return NoContent();
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        //// POST: api/User/login
        //[HttpPost("login")]
        //public async Task<ActionResult<UserResponseDto>> Login([FromBody] UserLoginDto dto)
        //{
        //    var user = await _userService.LoginAsync(dto);
        //    if (user == null)
        //        return Unauthorized("Invalid email or password.");

        //    return Ok(user);
        //}

        

    }

}
