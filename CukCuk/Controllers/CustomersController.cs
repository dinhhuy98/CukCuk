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
        [HttpGet]
        public IEnumerable<Customer> Get()
        {
            return Customer.ListCustomer;
        }

        // GET api/<CustomersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CustomersController>
        [HttpPost]
        public void Post([FromBody] Customer customer)
        {
            Customer.ListCustomer.Add(customer);
            return;
        }

        // PUT api/<CustomersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CustomersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
