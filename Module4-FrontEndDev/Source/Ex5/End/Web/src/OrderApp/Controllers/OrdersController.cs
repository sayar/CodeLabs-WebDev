using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderApp.Models;
using OrderApp.ViewModels;

namespace OrderApp.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private OrdersContext context;

        public OrdersController(OrdersContext context)
        {
            this.context = context;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.context.Dispose();
            }

            base.Dispose(disposing);
        }

        // GET: api/orders
        [HttpGet]
        public IEnumerable<OrderViewModel> Get()
        {
            return this.context.Orders.Select(o =>
                new OrderViewModel()
                {
                    Address = o.Address,
                    OrderTotal = o.OrderDetails.Select(od => od.Quantity * od.Product.Price).Sum(),
                    Continent = o.Continent,
                    Country = o.Country,
                    Language = o.Language,
                    Date = o.Date.ToString(),
                    Name = o.Name,
                    Id = o.OrderId,
                    Phone = o.Phone
                });
        }

        // GET: api/orders/5
        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<IActionResult> GetOrder([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await this.context.Orders
                                                .Include(o => o.OrderDetails)
                                                .ThenInclude(od => od.Product)
                                                .SingleAsync(m => m.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order.OrderDetails.Select(orderDetails => new OrderDetailsItem()
            {
                Comments = orderDetails.Comments,
                OrderDetailsId = orderDetails.OrderDetailsId,
                ProductName = orderDetails.Product.Name,
                ProductId = orderDetails.Product.ProductId,
                Price = orderDetails.Product.Price,
                Quantity = orderDetails.Quantity
            }));
        }
    }
}