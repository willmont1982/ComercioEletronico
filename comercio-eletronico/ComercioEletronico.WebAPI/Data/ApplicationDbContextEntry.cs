using System;

namespace ComercioEletronico.WebAPI.Data
{
    public abstract class ApplicationDbContextEntry
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
