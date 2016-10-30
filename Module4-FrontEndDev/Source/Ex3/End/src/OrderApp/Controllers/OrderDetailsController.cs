using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OrderApp.Models;
using OrderApp.ViewModels;

namespace OrderApp.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class OrderDetailsController : Controller
    {
        private OrdersContext context;

        public OrderDetailsController(OrdersContext context)
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
        // PUT: api/OrderDetails/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderDetails([FromRoute] int id, [FromBody] OrderDetailsItem orderDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != orderDetails.OrderDetailsId)
            {
                return BadRequest();
            }

            var storedOrderDetails = await this.context.OrderDetails.SingleAsync(m => m.OrderDetailsId == id);

            if (storedOrderDetails == null)
            {
                return NotFound();
            }

            storedOrderDetails.Quantity = orderDetails.Quantity;
            storedOrderDetails.Comments = orderDetails.Comments;

            await this.context.SaveChangesAsync();

            return new StatusCodeResult(StatusCodes.Status204NoContent);
        }
    }
}