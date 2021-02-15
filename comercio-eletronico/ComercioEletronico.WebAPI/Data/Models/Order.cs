using System.Collections.Generic;
using System.Linq;

namespace ComercioEletronico.WebAPI.Data.Models
{
    public enum OrderPaymentType
    {
        Money = 0,
        CreditCard = 1,
    }

    public class Order : ApplicationDbContextEntry
    {
        public string Address { get; set; }
        public double Extras { get; set; }
        public bool IsConfirmed { get; set; }
        public List<OrderItem> Items { get; set; }
        public Client Client { get; set; }
        public OrderPaymentType PaymentType { get; set; }
        public double Total => Extras + Items.Sum(_ => _.Product.Value * _.Count);
    }
}
