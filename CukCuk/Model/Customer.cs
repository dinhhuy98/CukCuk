using System;
using System.Collections.Generic;

namespace CukCuk.Model
{
    public partial class Customer
    {
        public Guid CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string MemberCardNo { get; set; }
        public string CustomerGroup { get; set; }
        public string CustomerTel { get; set; }
        public DateTime? Birthday { get; set; }
        public string CompanyName { get; set; }
        public string CustomerTaxCode { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerAddress { get; set; }
        public string Note { get; set; }
        public bool? Is5FoodMember { get; set; }
    }
}
