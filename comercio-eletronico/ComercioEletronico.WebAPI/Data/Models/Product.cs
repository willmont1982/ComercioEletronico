namespace ComercioEletronico.WebAPI.Data.Models
{
    public class Product : ApplicationDbContextEntry
    {
        public string Description { get; set; }
        public string ImageBase64 { get; set; }
        public string Name { get; set; }
        public double Value { get; set; }
    }
}
