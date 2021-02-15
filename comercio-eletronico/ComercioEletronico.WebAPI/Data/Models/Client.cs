namespace ComercioEletronico.WebAPI.Data.Models
{
    public enum ClientRole
    {
        Administrator = 0,
        User = 1
    }

    public class Client : ApplicationDbContextEntry
    {
        public string Email { get; set; }
        public string ImageBase64 { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public ClientRole Role { get; set; }
    }
}
