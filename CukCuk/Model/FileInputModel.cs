using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CukCuk.Model
{
    public class FileInputModel
    {
        public Customer Customerr { get; set; }
        public IFormFile Image { get; set; }
    }
}
