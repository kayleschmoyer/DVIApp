namespace DVI.API.Models
{
    public class ChecklistResultRequest
    {
        public int InspectionID { get; set; }
        public int ItemID { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
