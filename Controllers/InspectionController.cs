
using DVI.API.Models;
using DVI.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace DVI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InspectionController : ControllerBase
    {
        private readonly DVIService _service;

        public InspectionController(DVIService service)
        {
            _service = service;
        }

        [HttpGet("estimates")]
        public async Task<IActionResult> GetOpenEstimates()
        {
            var data = await _service.GetOpenEstimatesAsync();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInspection([FromBody] CreateInspectionRequest request)
        {
            var newId = await _service.CreateInspectionAsync(request.EstimateNumber, request.PerformedBy, request.Summary);
            return Ok(new { InspectionID = newId });
        }

        [HttpPost("checklist-result")]
        public async Task<IActionResult> SaveChecklistResult([FromBody] ChecklistResultRequest request)
        {
            await _service.SaveChecklistResultAsync(request.InspectionID, request.ItemID, request.Status, request.Notes);
            return Ok(new { Message = "Checklist result saved successfully." });
        }
        [HttpGet("{estimateNumber}")]
        public async Task<IActionResult> GetInspectionsForEstimate(int estimateNumber)
        {
            var data = await _service.GetInspectionsByEstimateAsync(estimateNumber);
            return Ok(data);
        }

        [HttpGet("details/{inspectionId}")]
        public async Task<IActionResult> GetFullInspectionDetails(int inspectionId)
        {
            var data = await _service.GetFullInspectionDetailsAsync(inspectionId);
            return Ok(new
            {
                Header = data.ElementAtOrDefault(0),
                ChecklistResults = data.ElementAtOrDefault(1),
                Media = data.ElementAtOrDefault(2)
            });
        }

    }
}
