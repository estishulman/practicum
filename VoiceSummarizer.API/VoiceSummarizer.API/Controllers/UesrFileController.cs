using Microsoft.AspNetCore.Mvc;
using BL.IService;
using BL.DTOs;
using Microsoft.AspNetCore.Authorization;
using BL.Services;

namespace VoiceSummarizer.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserFileController : ControllerBase
    {
        private readonly IUserFileService _userFileService;

        public UserFileController(IUserFileService userFileService)
        {
            _userFileService = userFileService;
        }

        // GET: api/UserFile/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserFileResponseDto>> GetFileById(int id)
        {
            var file = await _userFileService.GetFileByIdAsync(id);
            if (file == null)
            {
                return NotFound();
            }
            return Ok(file);
        }

        // GET: api/UserFile
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserFileResponseDto>>> GetAllFiles()
        {
            var files = await _userFileService.GetAllFilesAsync();
            return Ok(files);
        }

        // POST: api/UserFile
        [HttpPost]
        public async Task<ActionResult<UserFileResponseDto>> UploadFile([FromBody] UserFileCreateDto file)
        {
            if (file == null)
            {
                return BadRequest();
            }

            var createdFile = await _userFileService.UploadFileAsync(file);
            return CreatedAtAction(nameof(GetFileById), new { id = createdFile.Id }, createdFile);
        }

        // PUT: api/UserFile/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFile(int id, [FromBody] UserFileUpdateDto file)
        {
            await _userFileService.UpdateFileAsync(id,file);
            return NoContent();
        }

        //[HttpGet("presigned-url")]
        //public ActionResult<string> GetPresignedUrl([FromQuery] string fileName, [FromQuery] string contentType)
        //{
        //    var url = _userFileService.GeneratePresignedUrl(fileName, contentType);
        //    return Ok(new { url });
        //}

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl(string fileName, string contentType)
        {
            try
            {
                var url = _userFileService.GeneratePresignedUrl(fileName, contentType);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // ← חשוב להוציא ex.Message בשביל להבין את הסיבה
            }
        }


        // DELETE: api/UserFile/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            await _userFileService.DeleteFileAsync(id);
            return NoContent();
        }

        // POST: api/UserFile/{id}/generate-summary
        [HttpPost("{id}/generate-summary")]
        public async Task<ActionResult<SummaryResponseDto>> GenerateSummary(int id)
        {
            var summary = await _userFileService.GenerateSummaryAsync(id);
            return Ok(summary);
        }
    }

}
