namespace DVI.API.Models
{
    public class SaveMediaRequest
    {
        public int ResultID { get; set; }
        public string FileURL { get; set; } = "";
        public string MediaType { get; set; } = "Photo";
    }
}
