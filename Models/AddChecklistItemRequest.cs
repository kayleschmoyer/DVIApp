namespace DVI.API.Models
{
    public class AddChecklistItemRequest
    {
        public int TemplateID { get; set; }
        public string ItemName { get; set; } = "";
        public string Category { get; set; } = "";
        public int DisplayOrder { get; set; }
    }
}
