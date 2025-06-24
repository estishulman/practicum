using Microsoft.AspNetCore.Mvc;
using BL.IService;
using BL.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace VoiceSummarizer.API.Controllers
{
    [Authorize]
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

        [HttpGet("lecturers")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetLecturers()
        {
            var lecturers = await _userService.GetLecturersAsync();
            return Ok(lecturers);
        }

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
    }

}
