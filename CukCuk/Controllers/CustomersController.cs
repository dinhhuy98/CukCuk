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
    public class CustomersController : ControllerBase
    {
        // GET: api/<CustomersController>
        /// <summary>
        /// Lấy danh sách khách hàng
        /// </summary>
        /// <returns></returns>
        /// CreatedBy: NDHuy (30/07/2020)
        [HttpGet]
        public IEnumerable<Customer> Get()
        {
            return Customer.ListCustomer;
        }

        // GET api/<CustomersController>/54354354
        /// <summary>
        /// Lấy ra khách hàng theo CustomerID
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        /// CreatedBy:NDHuy
        [HttpGet("{customerID}")]
        public Customer Get(Guid customerID)
        {
            return Customer.ListCustomer.Where(customer => customer.CustomerID==customerID).FirstOrDefault();
        }

        // POST api/<CustomersController>
        /// <summary>
        /// Thêm mới khách hàng
        /// </summary>
        /// <param name="customer"></param>
        /// CreatedBy:NDHuy (30/07/2020)
        [HttpPost]
        public void Post([FromBody] Customer customer)
        {
            Customer.ListCustomer.Add(customer);
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
        public Customer Put(Guid customerID, [FromBody] Customer customer)
        {
            customer.CustomerID = customerID;
            foreach (Customer c in Customer.ListCustomer)
            {
                if (c.CustomerID == customerID)
                {
                    int k = Customer.ListCustomer.IndexOf(c);
                    Customer.ListCustomer[k] = customer;
                    return Customer.ListCustomer[k];
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
            var item = Customer.ListCustomer.Single(c => c.CustomerID == customerID);
            Customer.ListCustomer.Remove(item);
        }
    }
}
