using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CukCuk.Model;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CukCuk.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CustomersTestController : ControllerBase
    {
        // GET: api/<CustomersController>
        /// <summary>
        /// Lấy danh sách khách hàng
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: NDHuy (30/07/2020)
        [HttpGet]
        public IEnumerable<Customerr> Get()
        {
            return Customerr.ListCustomer;
        }

        // GET api/<CustomersController>/54354354
        /// <summary>
        /// Lấy ra khách hàng theo CustomerID
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        /// CreatedBy:NDHuy
        [HttpGet("{customerID}")]
        public Customerr Get(Guid customerID)
        {
            return Customerr.ListCustomer.Where(customer => customer.CustomerID==customerID).FirstOrDefault();
        }

        // POST api/<CustomersController>
        /// <summary>
        /// Thêm mới khách hàng
        /// </summary>
        /// <param name="customer"></param>
        /// CreatedBy:NDHuy (30/07/2020)
        [HttpPost]
        public void Post([FromBody] Customerr customer)
        {
            Customerr.ListCustomer.Add(customer);
            return;
        }

        // PUT api/<CustomersController>/5
        /// <summary>
        /// Chỉnh sửa khách hàng
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="customer"></param>
        /// <returns></returns>
        /// CreatedBy:NDHuy (30/07/2020)
        [HttpPut("{customerID}")]
        public Customerr Put(Guid customerID, [FromBody] Customerr customer)
        {
            customer.CustomerID = customerID;
            foreach (Customerr c in Customerr.ListCustomer)
            {
                if (c.CustomerID == customerID)
                {
                    int k = Customerr.ListCustomer.IndexOf(c);
                    Customerr.ListCustomer[k] = customer;
                    return Customerr.ListCustomer[k];
                }
            }
            return null;
            
        }

        // DELETE api/<CustomersController>/5
        /// <summary>
        /// Xóa khách hàng
        /// </summary>
        /// <param name="customerID"></param>
        /// CreatedBy: NDHuy (30/07/2020)
        [HttpDelete("{customerID}")]
        public void Delete(Guid customerID)
        {
            var item = Customerr.ListCustomer.Single(c => c.CustomerID == customerID);
            Customerr.ListCustomer.Remove(item);
        }
    }
}
