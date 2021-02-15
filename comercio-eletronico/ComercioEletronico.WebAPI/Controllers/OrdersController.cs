using ComercioEletronico.WebAPI.Data;
using ComercioEletronico.WebAPI.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ComercioEletronico.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet, Authorize]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            if (User.Identity.IsAuthenticated)
            {
                if (int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int id))
                {
                    var query = _context.Orders
                        .Include(item => item.Items)
                            .ThenInclude(item => item.Product)
                        .Include(item => item.Client)
                        .OrderBy(item => item.IsConfirmed);

                    if (User.FindFirstValue(ClaimTypes.Role) is string @string && Enum.Parse<ClientRole>(@string) == ClientRole.Administrator)
                    {
                        return await query.ToListAsync();
                    }

                    return await query
                        .Where(item => item.Client.Id == id)
                        .ToListAsync();
                }

                return NotFound();
            }

            return Unauthorized();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost, Authorize]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            if (User.Identity.IsAuthenticated)
            {
                _context.Clients.Attach(order.Client);
                _context.Products.AttachRange(order.Items.Select(_ => _.Product));
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetOrder", new { id = order.Id }, order);
            }

            return Unauthorized();
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
