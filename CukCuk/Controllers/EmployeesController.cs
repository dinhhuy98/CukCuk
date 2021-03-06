﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CukCuk.Model;
using System.IO;
using System.Collections;

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

        
        
        /// <summary>
        /// Lấy tổng số bản ghi trong bảng Employee
        /// CreatedBy: NDHuy (09/08/2020)
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// Upload ảnh truyền từ client vào folder upload
        /// CreatedBy: NDHuy (10/08/2020)
        /// </summary>
        /// <param name="image"></param>
        /// <param name="imgname"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Trả về EmployeeCode lớn nhất
        /// CreatedBy: NDHuy (11/08/2020)
        /// </summary>
        /// <returns></returns>
        [HttpGet("maxemployeecode")]
        public String getMaxEmployeeCode()
        {

            var max = _context.Employee.Max(s=>s.EmployeeCode).ToString();
            return max;

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

        /// <summary>
        /// Check nhân viên có tồn tại dựa trên tham số employeeCode
        /// CreatedBy: NDHuy (11/08/2020)
        /// </summary>
        /// <param name="employeeCode"></param>
        /// <returns></returns>
        [HttpGet("findemployeebycode")]
        public Boolean findEmployeeByCode([FromQuery]String employeeCode)
        {
            Employee employee = _context.Employee.Where(s => s.EmployeeCode == employeeCode).FirstOrDefault();
            if (employee != null)
                return true;
            else
                return false;
        }

        /// <summary>
        /// Xóa nhiều nhân viên dựa trên danh sách EmployeeId truyền vào
        /// CreatedBy: NDHuy (12/08/2020)
        /// </summary>
        /// <param name="listEmployeeId"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> deleteMultipleEmployee([FromBody]ArrayList listEmployeeId)
        {

            foreach(String id in listEmployeeId)
            {
                Guid idInGuid = Guid.Parse(id);
                var employee = await _context.Employee.FindAsync(idInGuid);
                if (employee != null)
                {
                    _context.Employee.Remove(employee);
                    await _context.SaveChangesAsync();
                }
  
            }
            return NoContent();
        }
    }
}
