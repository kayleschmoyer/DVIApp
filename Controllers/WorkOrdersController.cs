using Microsoft.AspNetCore.Mvc;

namespace DVI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkOrdersController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var workOrders = new List<object>
            {
                new { Id = 1, WoNumber = "WO-1001", CustomerName = "John Doe", Status = "Open", CreatedAt = DateTime.UtcNow },
                new { Id = 2, WoNumber = "WO-1002", CustomerName = "Jane Smith", Status = "In Progress", CreatedAt = DateTime.UtcNow.AddDays(-1) },
                new { Id = 3, WoNumber = "WO-1003", CustomerName = "Mike Johnson", Status = "Completed", CreatedAt = DateTime.UtcNow.AddDays(-2) }
            };

            return Ok(workOrders);
        }
    }
}