namespace DVI.API.Models
{
    public class CreateTemplateRequest
    {
        public string TemplateName { get; set; } = "";
        public int CreatedBy { get; set; }
    }
}
