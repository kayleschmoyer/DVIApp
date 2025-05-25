using DVI.API.Models;
using DVI.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace DVI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChecklistController : ControllerBase
    {
        private readonly DVIService _service;

        public ChecklistController(DVIService service)
        {
            _service = service;
        }

        [HttpGet("templates")]
        public async Task<IActionResult> GetTemplates()
        {
            var templates = await _service.GetChecklistTemplatesAsync();
            return Ok(templates);
        }

        [HttpGet("template/{templateId}")]
        public async Task<IActionResult> GetTemplateItems(int templateId)
        {
            var items = await _service.GetChecklistItemsAsync(templateId);
            return Ok(items);
        }

        [HttpPost("template")]
        public async Task<IActionResult> CreateTemplate([FromBody] CreateTemplateRequest request)
        {
            var id = await _service.CreateChecklistTemplateAsync(request.TemplateName, request.CreatedBy);
            return Ok(new { TemplateID = id });
        }

        [HttpPost("item")]
        public async Task<IActionResult> AddChecklistItem([FromBody] AddChecklistItemRequest request)
        {
            await _service.AddChecklistItemAsync(request);
            return Ok(new { Message = "Checklist item added." });
        }
    }
}
