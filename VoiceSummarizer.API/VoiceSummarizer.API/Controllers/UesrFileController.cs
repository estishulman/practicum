//using DL.Entities;
//using Microsoft.AspNetCore.Mvc;
//using BL.IService;
//using BL.DTOs;

//namespace VoiceSummarizer.API.Controllers
//{
//    //[ApiController]
//    //[Route("api/[controller]")]
//    //public class UserFileController : ControllerBase
//    //{
//    //    private readonly IUserFileService _userFileService;

//    //    public UserFileController(IUserFileService userFileService)
//    //    {
//    //        _userFileService = userFileService;
//    //    }

//    //    // GET: api/UserFile/{id}
//    //    [HttpGet("{id}")]
//    //    public async Task<ActionResult<UserFileResponseDto>> GetFileById(int id)
//    //    {
//    //        var file = await _userFileService.GetFileByIdAsync(id);
//    //        if (file == null)
//    //        {
//    //            return NotFound();
//    //        }
//    //        return Ok(file);
//    //    }

//    //    // GET: api/UserFile
//    //    [HttpGet]
//    //    public async Task<ActionResult<IEnumerable<UserFileResponseDto>>> GetAllFiles()
//    //    {
//    //        var files = await _userFileService.GetAllFilesAsync();
//    //        return Ok(files);
//    //    }

//    //    // POST: api/UserFile
//    //    [HttpPost]
//    //    public async Task<ActionResult<UserFileResponseDto>> UploadFile([FromBody] UserCreateDto file)
//    //    {
//    //        if (file == null)
//    //        {
//    //            return BadRequest();
//    //        }

//    //        var createdFile = await _userFileService.UploadFileAsync(file);
//    //        return CreatedAtAction(nameof(GetFileById), new { id = createdFile.Id }, createdFile);
//    //    }

//    //    // PUT: api/UserFile/{id}
//    //    [HttpPut("{id}")]
//    //    public async Task<IActionResult> UpdateFile(int id, [FromBody] UserCreateDto file)
//    //    {
//    //        await _userFileService.UpdateFileAsync(file);
//    //        return NoContent();
//    //    }

//    //    // DELETE: api/UserFile/{id}
//    //    [HttpDelete("{id}")]
//    //    public async Task<IActionResult> DeleteFile(int id)
//    //    {
//    //        await _userFileService.DeleteFileAsync(id);
//    //        return NoContent();
//    //    }

//    //    // POST: api/UserFile/{id}/generate-summary
//    //    [HttpPost("{id}/generate-summary")]
//    //    public async Task<ActionResult<SummaryResponseDto>> GenerateSummary(int id)
//    //    {
//    //        var summary = await _userFileService.GenerateSummaryAsync(id);
//    //        return Ok(summary);
//    //    }
//    //}


//    [ApiController]
//    [Route("api/[controller]")]
//    public class UserFileController : ControllerBase
//    {
//        private readonly IUserFileService _service;

//        public UserFileController(IUserFileService service)
//        {
//            _service = service;
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            return Ok(await _service.GetAllAsync());
//        }

//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetById(int id)
//        {
//            var result = await _service.GetByIdAsync(id);
//            return result == null ? NotFound() : Ok(result);
//        }

//        [HttpPost]
//        public async Task<IActionResult> Add(UserFileCreateDto dto)
//        {
//            var result = await _service.AddAsync(dto);
//            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, UserFileUpdateDto dto)
//        {
//            var success = await _service.UpdateAsync(id, dto);
//            return success ? NoContent() : NotFound();
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var success = await _service.DeleteAsync(id);
//            return success ? NoContent() : NotFound();
//        }
//    }

//}


//using BL.DTOs;
//using BL.IService;
//using Microsoft.AspNetCore.Mvc;
//using System.Threading.Tasks;

//namespace API.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class UserFileController : ControllerBase
//    {
//        private readonly IUserFileService _userFileService;

//        public UserFileController(IUserFileService userFileService)
//        {
//            _userFileService = userFileService;
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            var files = await _userFileService.GetAllAsync();
//            return Ok(files);
//        }

//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetById(int id)
//        {
//            var file = await _userFileService.GetByIdAsync(id);
//            return file == null ? NotFound() : Ok(file);
//        }

//        [HttpPost]
//        public async Task<IActionResult> Create(UserFileInputDto dto)
//        {
//            var newFile = await _userFileService.CreateAsync(dto);
//            return CreatedAtAction(nameof(GetById), new { id = newFile.Id }, newFile);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> Update(int id, UserFileInputDto dto)
//        {
//            var success = await _userFileService.UpdateAsync(id, dto);
//            return success ? NoContent() : NotFound();
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var success = await _userFileService.DeleteAsync(id);
//            return success ? NoContent() : NotFound();
//        }

//        [HttpGet("{fileId}/summary")]
//        public async Task<IActionResult> GetSummary(int fileId)
//        {
//            var summary = await _userFileService.GetSummaryForFileAsync(fileId);
//            return summary == null ? NotFound() : Ok(summary);
//        }

//        [HttpPost("{fileId}/summary")]
//        public async Task<IActionResult> CreateSummary(int fileId)
//        {
//            var summary = await _userFileService.CreateSummaryForFileAsync(fileId);
//            return Ok(summary);
//        }
//    }
//}




using Microsoft.AspNetCore.Mvc;
using BL.IService;
using BL.DTOs;

namespace VoiceSummarizer.API.Controllers
{
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
