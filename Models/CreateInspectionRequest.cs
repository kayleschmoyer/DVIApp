namespace DVI.API.Models
{
    public class CreateInspectionRequest
    {
        public int EstimateNumber { get; set; }
        public int PerformedBy { get; set; }
        public string? Summary { get; set; }
    }
}
