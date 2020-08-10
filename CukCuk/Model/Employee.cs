using System;
using System.Collections.Generic;

namespace CukCuk.Model
{
    public partial class Employee
    {
        public Guid EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public DateTime? Birthday { get; set; }
        public bool? Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string IdentificationCard { get; set; }
        public DateTime? DateOfIssue { get; set; }
        public string PlaceOfIssue { get; set; }
        public string Position { get; set; }
        public string Department { get; set; }
        public string EmployeeTaxCode { get; set; }
        public decimal? Salary { get; set; }
        public DateTime? JoinDate { get; set; }
        public string StatusJob { get; set; }
        public string EmployeeAvatar { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string EmployeeName { get; set; }
    }
}
