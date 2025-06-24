using DL.Entities;
using Microsoft.AspNetCore.Mvc;
using BL.IService;
using BL.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace VoiceSummarizer.API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SummaryController : ControllerBase
    {
        private readonly ISummaryService _summaryService;

        public SummaryController(ISummaryService summaryService)
        {
            _summaryService = summaryService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SummaryResponseDto>> GetSummaryById(int id)
        {
            var summary = await _summaryService.GetSummaryByIdAsync(id);
            if (summary == null)
            {
                return NotFound();
            }
            return Ok(summary);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SummaryResponseDto>>> GetAllSummaries()
        {
            var summaries = await _summaryService.GetAllSummariesAsync();
            return Ok(summaries);
        }

        [HttpPost]
        public async Task<ActionResult<SummaryResponseDto>> CreateSummary([FromBody] SummaryCreateDto summary)
        {//מה זה הקוד הזה?
            var created = await _summaryService.CreateSummaryAsync(summary);
            return CreatedAtAction(nameof(GetSummaryById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSummary(int id, [FromBody] SummaryUpdateDto summary)
        {

            await _summaryService.UpdateSummaryAsync(id,summary);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSummary(int id)
        {
            await _summaryService.DeleteSummaryAsync(id);
            return NoContent();
        }
    }

}
