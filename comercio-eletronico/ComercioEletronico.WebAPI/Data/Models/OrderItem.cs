using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComercioEletronico.WebAPI.Data.Models
{
    public class OrderItem : ApplicationDbContextEntry
    {
        public Product Product { get; set; }
        public int Count { get; set; }
    }
}
