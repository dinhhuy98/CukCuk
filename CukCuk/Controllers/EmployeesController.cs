using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CukCuk.Model;
using System.IO;

namespace CukCuk.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly CustomerdbContext _context;

        public EmployeesController(CustomerdbContext context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployee([FromQuery]String page)
        {
            if (page == null)
                return await _context.Employee.ToListAsync();
            else
            {
                var data = _context.Employee.OrderByDescending(n => n.EmployeeCode).Skip((Int32.Parse(page) - 1) * 40).Take(40).ToList();
                return data;
            }
        }

        /**
         * Lấy tổng số bản ghi trong bảng Employee
         * CreatedBy: NDHuy (09/08/2020)
         */
        [HttpGet("totalrow")]
        public int getTotalRow()
        {
            var count = _context.Employee.Count();
            return count;

        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(Guid id)
        {
            var employee = await _context.Employee.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // PUT: api/Employees/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(Guid id, Employee employee)
        {
            if (id != employee.EmployeeId)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
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

        // POST: api/Employees
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            _context.Employee.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployee", new { id = employee.EmployeeId }, employee);
        }

        [HttpPost("uploadimg/{imgname}")]
        public async Task<IActionResult> ImageUpload(IFormFile image, String imgname)
        {
            if(imgname== "avatardefault.jpg")
                return NoContent();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "upload","employee", imgname);
            using (System.IO.Stream stream = new FileStream(path, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            return NoContent();

        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employee.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employee.Remove(employee);
            await _context.SaveChangesAsync();

            return employee;
        }

        private bool EmployeeExists(Guid id)
        {
            return _context.Employee.Any(e => e.EmployeeId == id);
        }
    }
}
