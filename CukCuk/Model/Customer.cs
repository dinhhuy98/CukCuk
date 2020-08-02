using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CukCuk.Model
{
    /// <summary>
    /// Khách hàng
    /// </summary>
    /// CreatedBy:NDHuy (29/07/2020)
    public class Customer
    {
        #region "DECLARE"
        /// <summary>
        /// Danh sách khách hàng (Fixed)
        /// </summary>
        /// CreatedBy:NDHuy (29/07/2020)
        public static List<Customer> ListCustomer = new List<Customer>()
        {
            new Customer()
            {
                CustomerCode="KH0001",
                CustomerName="Nguyễn Đình Huy",
                MemberCardNo="647823648",
                CustomerGroup="ABC",
                CustomerTel="3724982379",
                Birthday=new DateTime(1989,4,1),
                CompanyName="MISA",
                CustomerTaxCode="7856875",
                CustomerEmail="dinhhuy1798@gmail.com",
                CustomerAddress="Ha Noi",
                Note="ugiouhfuisdhfidhsifhu",
                Is5FoodMember=true,

            },
            new Customer()
            {
                CustomerCode="KH0002",
                CustomerName="Nguyễn Văn A",
                MemberCardNo="3463453",
                CustomerGroup="ABC",
                CustomerTel="372493423",
                Birthday=new DateTime(1999,4,11),
                CompanyName="MISA",
                CustomerTaxCode="78561232",
                CustomerEmail="dinhhuy1798@gmail.com",
                CustomerAddress="Hải Phòng",
                Note="ugiouhfrrrr",
                Is5FoodMember=false,

            },
            new Customer()
            {
                CustomerCode="KH0003",
                CustomerName="Nguyễn Vũ F",
                MemberCardNo="65876577",
                CustomerGroup="ABC",
                CustomerTel="3724982379",
                Birthday=new DateTime(1993,10,10),
                CompanyName="MISA",
                CustomerTaxCode="7845645",
                CustomerEmail="dinhhuy1798@gmail.com",
                CustomerAddress="Ha Noi",
                Note="ugiouhfuisdhfidhsifhu",
                Is5FoodMember=true,

            },
            new Customer()
            {
                CustomerCode="KH0004",
                CustomerName="Nguyễn Văn E",
                MemberCardNo="783654765",
                CustomerGroup="ABC",
                CustomerTel="3724982379",
                Birthday=new DateTime(1989,2,4),
                CompanyName="MISA",
                CustomerTaxCode="78587978",
                CustomerEmail="dinhhuy1798@gmail.com",
                CustomerAddress="Ha Tinh",
                Note="ugiouhfuisdhfidhsifhu",
                Is5FoodMember=true,

            },
            new Customer()
            {
                CustomerCode="KH0005",
                CustomerName="Nguyễn Thị C",
                MemberCardNo="457456788",
                CustomerGroup="ABC",
                CustomerTel="3724982379",
                Birthday=new DateTime(1989,5,6),
                CompanyName="MISA",
                CustomerTaxCode="7825346",
                CustomerEmail="dinhhuy1798@gmail.com",
                CustomerAddress="Da Nang",
                Note="ugiouhfuisdhfidhsifhu",
                Is5FoodMember=true,

            }
        };
        #endregion

        #region "Constructor"
        /// <summary>
        /// Hàm khởi tạo
        /// </summary>
        public Customer()
        {
            CustomerID = Guid.NewGuid();
        }
        #endregion

        #region Property
        /// <summary>
        /// Khóa chính (ID khách hàng)
        /// </summary>
        public Guid? CustomerID { get; set; }
        
        /// <summary>
        /// Mã khách hàng
        /// </summary>
        public string CustomerCode { get; set; }

        /// <summary>
        /// Tên khách hàng
        /// </summary>
        public string CustomerName { get; set; }

        /// <summary>
        /// Mã thẻ thành viên
        /// </summary>
        public string MemberCardNo { get; set; }
        /// <summary>
        /// Nhóm khách hàng
        /// </summary>
        public string CustomerGroup { get; set; }

        /// <summary>
        /// Số điện thoại khách hàng
        /// </summary>
        public string CustomerTel { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime Birthday { get; set; }

        /// <summary>
        /// Tên công ty
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// Mã số thuế
        /// </summary>
        public string CustomerTaxCode { get; set; }

        /// <summary>
        /// Email khách hàng
        /// </summary>
        public string CustomerEmail { get; set; }

        /// <summary>
        /// Địa chỉ khách hàng
        /// </summary>
        public string CustomerAddress { get; set; }

        /// <summary>
        /// Ghi chú
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// Là thành viên 5Food (true- là thành viên, false- không phải là thành viên)
        /// </summary>
        public bool Is5FoodMember { get; set; }
        #endregion

        #region Method - Function

        /// <summary>
        /// Lấy danh sách khách hàng
        /// </summary>
        /// <returns></returns>
        /// CreatedBy:NDHuy (29/07/2020)
        public List<Customer> GetCustomers()
        {
            return Customer.ListCustomer;
        }
        #endregion
    }
}
