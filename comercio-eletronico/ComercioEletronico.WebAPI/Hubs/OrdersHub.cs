using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ComercioEletronico.WebAPI.Hubs
{
    [EnableCors]
    public class OrdersHub : Hub
    {
        public async Task ConfirmOrder(int orderId, bool isConfirmed)
        {
            await Clients.All.SendAsync("UpdateOrder", orderId, isConfirmed);
        }
    }
}
