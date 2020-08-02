$(document).ready(function () {
    //load du lieu
    customerJS = new CustomerJS();
})

/**
 * Object JS quan ly cac su kien cho trang danh muc khach hang
 * */
class CustomerJS {
    constructor() {
        try {
            this.initEvent();
            this.loadData();
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * Load du lieu vao table customer
     * CreatedBy: NDHuy (28/07/2020)
     * */
    loadData() {
        try {
            $('table#tbListCustomer tbody').empty();
            //Lay du lieu ve
           
            $.ajax({
                url: "/api/v1/customers",
                method: "GET",
                data: {},
                dataType: "json",
                contentType:"application/json",

            }).done(function (response) {
                //Doc du lieu va ren du lieu tung khach hang voi HTML
                $.each(response, function (index, item) {
                    var customerInfoHTML = `<tr>
                                <td>`+ item['CustomerCode'] + `</td>
                                <td>`+ item['CustomerName'] + `</td>
                                <td>`+ item['CompanyName'] + `</td>
                                <td>`+ item['CustomerTaxCode'] + `</td>
                                <td>`+ item['CustomerAddress'] + `</td>
                                <td>`+ item['CustomerTel'] + `</td>
                                <td>`+ item['CustomerEmail']+ `</td>
                                <td>`+ commonJS.formatDate(new Date(item['Birthday'])) + `</td>
                            </tr>`;

                    //tạo đối tương tr tương ứng với chuỗi customerInfoHTML
                    var jQueryObject = $('<tr></tr>').html(customerInfoHTML).children();
                    //thêm data cho tr
                    jQueryObject.data("CustomerID", item['CustomerID']);
                    $('table#tbListCustomer tbody').append(jQueryObject);
                    //debugger;
                    //console.log(item);
                })
                console.log("load data successful");
            }).fail(function (response) {
                console.log("error");
            })
  
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Thuc hien gan cac su kien cho cac thanh phan trong trang
     * CreatedBy: NDHuy (28/07/2020)
     * */
    initEvent() {
        //gan su kien click cho row trong table
        $("table").on("click", "tbody tr", this.rowOnCLick);

        //gan su kien cho cac button trong toolbar
        $('#btnAdd').on('click', { formMode: Enum.FormMode.Add }, this.toolbarItemOnClick.bind(this));
        $('#btnEdit').on('click', { formMode: Enum.FormMode.Edit }, this.toolbarItemOnClick.bind(this));
        $('#btnDelete').on('click', { formMode: Enum.FormMode.Delete }, this.toolbarItemOnClick.bind(this));
        $('#btnRefresh').on('click', { formMode: Enum.FormMode.Refresh }, this.toolbarItemOnClick.bind(this));

        //gán sự kiện cho các button đóng của form
        $('#btnClose').click(this.btnCloseOnClick);
        $('#btnCloseHeader').click(this.btnCloseHeaderOnClick);

    }


    /**
     * Thuc hien gan cac su kien cho cac thanh phan trong toolbar
     * CreatedBy:NDHuy (28/07/2020)
     * */
    toolbarItemOnClick(sender) {
        
        try {
            var formMode = sender.data.formMode;
            switch (formMode) {
                case Enum.FormMode.Add:
                    this.showAddCustomerForm();
                    break;
                case Enum.FormMode.Edit:
                    //goi ajax lấy khách hàng đang được chọn
                    var customer = this.getCustomerSelected();
                    this.showEditCustomerForm(customer);
                    break;
                case Enum.FormMode.Delete:
                    var customer = this.getCustomerSelected();
                    this.deleteCustomer(customer);
                    break;
                case Enum.FormMode.Refresh:
                    this.refreshTable();
                    break;
                default:
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Su kien khi click button huy bo trong footer cua dialog
     * CreatedBy: NDHuy (28/07/2020)
     * */
    btnCloseOnClick() {
        $('#frmDialogDetail').hide();
       
    }

    /**
     * Su kien khi click dong tren tieu de cua dialog
     * CreatedBy: NDHuy (28/07/2020)
     * */
    btnCloseHeaderOnClick() {
        $('#frmDialogDetail').hide();
        
    }

    /**
     * Su kien click khi chon 1 dong trong table
     * CreateBy:NDHuy (28/07/2020)
     * */
    rowOnCLick() {
        this.classList.add("row-selected"); //them class row-selected vao row duoc chon
        //xoa row-selected khoi cac row con lai
        $(this).siblings().removeClass("row-selected");
    }

    /**
     * Cất du lieu
     * CreatedBy:NDHuy (28/07/2020)
     * */
    saveData(sender) {
        //lay du lieu duoc nhap tu cac input
        var customer = {
            "CustomerCode": $('#txtCustomerCode').val(),
            "CustomerName": $('#txtCustomerName').val(),
            "MemberCardNo": $('#txtMemberCardNo').val(),
            "CustomerGroup": $('#txtCustomerGroup').val(),
            "CustomerTel": $('#txtCustomerTel').val(),
            "Birthday": $('#dtBirthday').val(),
            "CompanyName": $('#txtCompanyName').val(),
            "CustomerTaxCode": $('#txtCustomerTaxCode').val(),
            "CustomerEmail": $('#txtCustomerEmail').val(),
            "CustomerAddress": $('#txtCustomerAddress').val(),
            "Note": $('#txtNote').val(),
            "Is5FoodMember": $('#ckIs5FoodMember').prop("checked") ? true : false
        };

        var json = JSON.stringify(customer);
        //debugger;
        //kiem tra kieu form
        var me = this;
        if (sender.data.formMode == Enum.FormMode.Add || sender.data.formMode == Enum.FormMode.SaveAndAdd) {
            //gọi ajax gửi dữ liệu lên server
            
            try {
                $.ajax({
                    url: "/api/v1/customers",
                    method: "POST",
                   
                    data: json,
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
                    //hien thi thong bao thanhcong/thatbai
                    alert("Cất thanh cong");
                    me.loadData();
                }).fail(function (response) {
                    console.log(response);
                });
            } catch (e) {
                console.log(e);
            }
            
            if (sender.data.formMode == Enum.FormMode.SaveAndAdd) {
                this.resetFormDialog();
            }
            else
                $('#frmDialogDetail').hide();
        }
        else if (sender.data.formMode == Enum.FormMode.Edit) {
            try {
                $.ajax({
                    url: "/api/v1/customers/" + sender.data.customerID,
                    method: "PUT",

                    data: json,
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
                    //hien thi thong bao thanhcong/thatbai
                    alert("Cập nhật thành công");
                    me.loadData();
                    $('#frmDialogDetail').hide();
                    
                }).fail(function (response) {
                    console.log(response);
                });
            } catch (e) {
                console.log(e);
            }
            
        }

        //load lai du lieu
        //this.loadData();
    }

    /**
     * Hien thi form them khach hang
     * CreatedBy: NDHuy (28/07/2020)*/
    showAddCustomerForm() {
        this.resetFormDialog()
        this.setButtonEventDialog(Enum.FormMode.Add);
        $("#frmDialogDetail").show();
    }

    /**
     * Hien thi form sua thong tin khach hang
     * CreatedBy: NDHuy (28/07/2020)
     * @param {any} data
     */
    showEditCustomerForm(customer) {
        //Do du lieu ra form
        $('#txtCustomerCode').val(customer['CustomerCode']),
            $('#txtCustomerName').val(customer['CustomerName']),
            $('#txtMemberCardNo').val(customer['MemberCardNo']),
            $('#txtCustomerGroup').val(customer['CustomerGroup']),
            $('#txtCustomerTel').val(customer['CustomerTel']),
            $('#dtBirthday').val(commonJS.formatDate(new Date(customer['Birthday']))),
            $('#txtCompanyName').val(customer['CompanyName']),
            $('#txtCustomerTaxCode').val(customer['CustomerTaxCode']),
            $('#txtCustomerEmail').val(customer['CustomerEmail']),
            $('#txtCustomerAddress').val(customer['CustomerAddress']),
            $('#txtNote').val(customer['Note']);
        if (customer["Is5FoodMember"])
             $('#ckIs5FoodMember').prop("checked", true);
        else
             $('#ckIs5FoodMember').prop("checked", false);

        //hien form
        this.setButtonEventDialog(Enum.FormMode.Edit, customer['CustomerID']);
        $("#frmDialogDetail").show();
    }

    /**
     * Xoa khach hang khoi database
     * CreatedBy:NDHuy (28/07/2020)*/
    deleteCustomer(customer) {
        var confirmDelete = confirm("Bạn chắc chắn muốn xóa?");
        var me = this;
        if (confirmDelete) {
            try {
                $.ajax({
                    url: "/api/v1/customers/" + customer.CustomerID,
                    method: "DELETE",
                    data: {},
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
                    //hien thi thong bao thanhcong/thatbai
                    alert("Xóa thành công");
                    me.loadData();
                }).fail(function (response) {
                    console.log(response);
                });
            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * Cap nhat lai table
     * CreatedBy:NDHuy (28/07/2020)*/
    refreshTable() {
        this.loadData();
    }

    /**
     * Lay vi tri row duoc chon
     * CreatedBy:NDHuy (28/07/2020)
     * */
    getIndexOfRowSelected() {
        var index = $('table#tbListCustomer tbody tr.row-selected').index();
        return index;
    }

    /**
     * thiet lap event cua button trong footer cua dialog theo chuc nang tuong ung
     * @param {number} formMode
     * CreatedBy:NDHuy (28/07/2020)
     * */
    setButtonEventDialog(formMode, CustomerID) {
     
        //xoa su kien khoi button btnSaveAndAdd
        $('#btnSaveAndAdd').unbind();
        $('#btnSave').unbind();

        //them su kien tuy theo chuc nang
        switch (formMode) {
            case Enum.FormMode.Add:
                $('#btnSave .btn-text').html("Cất")
                $('#btnSaveAndAdd').show()
                $('#btnSave').on('click', { formMode: Enum.FormMode.Add }, this.saveData.bind(this));
                $('#btnSaveAndAdd').on('click', { formMode: Enum.FormMode.SaveAndAdd }, this.saveData.bind(this));
                break;
            case Enum.FormMode.Edit:
                $('#btnSave .btn-text').html("Cập nhật")
                $('#btnSaveAndAdd').hide()
                $('#btnSave').on('click', { formMode: Enum.FormMode.Edit, customerID: CustomerID }, this.saveData.bind(this));
                break;
            default:
        }
    }

    /**
     * Dua cac o input trong form ve gia tri rong
     * CreatedBy: NDHuy (28/07/2020)
     * */
    resetFormDialog() {
        $('#frmDialogDetail input').val("");
        $('#frmDialogDetail textarea').val("");
        $('#frmDialogDetail input[type="checkbox"]').prop("checked", false);
    }

    /**
     * Lấy khách hàng đang được chọn trong table
     * CreatedBy:NDHuy (28/07/2020)
     * */
    getCustomerSelected() {
        var customerID = $('table#tbListCustomer tbody tr.row-selected').data()['CustomerID'];
        var customer = null;
        try {
            $.ajax({
                url: "/api/v1/customers/" + customerID,
                method: "GET",
                async: false,
                data: {},
                dataType: "json",
                contentType: "application/json",

            }).done(function (response) {
                customer = response;
            }).fail(function (response) {
                console.log("error");
            })
        } catch (e) {
            console.log("error");
        }
        return customer;
    }

}

var fakeData = [
    {
        CustomerCode: "KH0001",
        CustomerName: "Nguyen Dinh Huy",
        Birthday: new Date(1998, 31, 17),
        PhoneNumber: "892374923",
        DebitAmount: 1000000,
        Is5FoodMember: false
    },
    {
        CustomerCode: "KH0002",
        CustomerName: "Nguyen Van A",
        Birthday: new Date(1992, 9, 17),
        PhoneNumber: "89237243",
        DebitAmount: 10000000,
        Is5FoodMember: false
    },
    {
        CustomerCode: "KH0003",
        CustomerName: "Nguyen Thi C",
        Birthday: new Date(1998, 5, 1),
        PhoneNumber: "8923712321",
        DebitAmount: 5000000,
        Is5FoodMember: true
    },
    {
        CustomerCode: "KH0004",
        CustomerName: "Tran Van E",
        Birthday: new Date(1998, 1, 17),
        PhoneNumber: "892376767",
        DebitAmount: 1500000,
        Is5FoodMember: false
    },
    {
        CustomerCode: "KH0005",
        CustomerName: "Nguyen Duc V",
        Birthday: new Date(1991, 10, 1),
        PhoneNumber: "8923744455",
        DebitAmount: 2000000,
        Is5FoodMember: true
    }
]