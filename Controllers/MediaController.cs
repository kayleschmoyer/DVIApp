using DVI.API.Models;
using DVI.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace DVI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MediaController : ControllerBase
    {
        private readonly DVIService _service;

        public MediaController(DVIService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> SaveMedia([FromBody] SaveMediaRequest request)
        {
            await _service.SaveMediaAsync(request.ResultID, request.FileURL, request.MediaType);
            return Ok(new { Message = "Media saved successfully." });
        }

        [HttpGet("{resultId}")]
        public async Task<IActionResult> GetMediaByResultId(int resultId)
        {
            var media = await _service.GetMediaByResultIdAsync(resultId);
            return Ok(media);
        }
    }
}
