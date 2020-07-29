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
                                <td>`+ item['CustomerEmail'] + `</td>
                            </tr>`;
                    $('table#tbListCustomer tbody').append(customerInfoHTML);
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
        console.log(sender);
        try {
            var formMode = sender.data.formMode;
            switch (formMode) {
                case Enum.FormMode.Add:
                    this.showAddCustomerForm();
                    break;
                case Enum.FormMode.Edit:
                    var index = this.getIndexOfRowSelected();
                    this.showEditCustomerForm(index);
                    break;
                case Enum.FormMode.Delete:
                    var index = this.getIndexOfRowSelected();
                    this.deleteCustomer(index);
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
            "Is5FoodMember": $('#ckIs5FoodMember').attr("checked") ? true : false
        };

        var json = JSON.stringify(customer);
        
        //kiem tra kieu form
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
            var index = this.getIndexOfRowSelected();
            fakeData[index] = customer;
            //hien thi thong bao thanhcong/thatbai
            alert("Cập nhật thành công");
            $('#frmDialogDetail').hide();
        }

        //load lai du lieu
        this.loadData();
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
    showEditCustomerForm(index) {
        //Lay ra khach hang duoc chon
        var customer = fakeData[index];

        //Do du lieu ra form
        $('#txtCustomerCode').val(customer.CustomerCode);
        $('#txtCustomerName').val(customer.CustomerName);
        $('#dtBirthday').val(commonJS.formatDate(customer.Birthday));
        $('#txtMobile').val(customer.PhoneNumber);
        $('#txtDebitAmount').val(customer.DebitAmount);
        $('#ckIs5FoodMember').removeAttr("checked");
        if (customer.Is5FoodMember)
            $('#ckIs5FoodMember').attr("checked", true);

        //hien form
        this.setButtonEventDialog(Enum.FormMode.Edit);
        $("#frmDialogDetail").show();
    }

    /**
     * Xoa khach hang khoi database
     * CreatedBy:NDHuy (28/07/2020)*/
    deleteCustomer(index) {
        var confirmDelete = confirm("Bạn chắc chắn muốn xóa?");
        if (confirmDelete) {
            fakeData.splice(index, 1);
            this.loadData();
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
    setButtonEventDialog(formMode) {
     
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
                $('#btnSave').on('click', { formMode: Enum.FormMode.Edit }, this.saveData.bind(this));
                break;
            default:
        }
    }

    /**
     * Dua cac o input trong form ve gia tri rong
     * CreatedBy: NDHuy (28/07/2020)
     * */
    resetFormDialog() {
        $('#txtCustomerCode').val("");
        $('#txtCustomerName').val("");
        $('#dtBirthday').val("");
        $('#txtMobile').val("");
        $('#txtDebitAmount').val("");
        $('#ckIs5FoodMember').removeAttr("checked");
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