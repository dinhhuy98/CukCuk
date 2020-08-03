$(document).ready(function () {
    //load dữ liệu
    customerJS = new CustomerJS();
})

/**
 * Object JS quản lý các sự kiện cho trang danh mục khách hàng
 * */
class CustomerJS {
    constructor() {
        try {
            this.initEvent();
            this.loadData();
            this.formValidateEvent();
        } catch (e) {
            console.log(e);
        }
    }
    /**
     * Load dữ liệu vào table customer
     * CreatedBy: NDHuy (28/07/2020)
     * */
    loadData() {
        try {
            $('table#tbListCustomer tbody').empty();
            //Gọi Ajax lấy dữ liệu về
            $.ajax({
                url: "/api/v1/customers",
                method: "GET",
                data: {},
                dataType: "json",
                contentType:"application/json",

            }).done(function (response) {
                //Đọc dữ liệu và render dữ liệu từng khách hàng
                $.each(response, function (index, item) {
                    var bg = index % 2 == 0 ? "bg-white " : "bg-ghostwhite ";
                    var firstSelected = index == 0 ? "row-selected" : "";
                    var customerInfoHTML = `<tr class="` + bg + firstSelected +`">
                                <td>`+ item['CustomerCode'] + `</td>
                                <td>`+ item['CustomerName'] + `</td>
                                <td>`+ item['CompanyName'] + `</td>
                                <td>`+ item['CustomerTaxCode'] + `</td>
                                <td>`+ item['CustomerAddress'] + `</td>
                                <td>`+ item['CustomerTel'] + `</td>
                                <td>`+ item['CustomerEmail']+ `</td>
                                <td>`+ commonJS.formatDate(new Date(item['Birthday'])) + `</td>
                            </tr>`;

                    //Tạo đối tượng tr tương ứng với chuỗi customerInfoHTML
                    var jQueryObject = $('<tr></tr>').html(customerInfoHTML).children();
                    //thêm data cho tr
                    jQueryObject.data("CustomerId", item['CustomerId']);
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
     * Thực hiện gán các sự kiện cho các thành phần trong trang
     * CreatedBy: NDHuy (28/07/2020)
     * */
    initEvent() {
        //Gán sự kiện click cho row tron table
        $("table").on("click", "tbody tr", this.rowOnCLick);

        //Gán sự kiện cho các button trong toolbar
        $('#btnAdd').on('click', { formMode: Enum.FormMode.Add }, this.toolbarItemOnClick.bind(this));
        $('#btnEdit').on('click', { formMode: Enum.FormMode.Edit }, this.toolbarItemOnClick.bind(this));
        $('#btnDelete').on('click', { formMode: Enum.FormMode.Delete }, this.toolbarItemOnClick.bind(this));
        $('#btnDuplicate').on('click', { formMode: Enum.FormMode.Duplicate }, this.toolbarItemOnClick.bind(this));
        $('#btnRefresh').on('click', { formMode: Enum.FormMode.Refresh }, this.toolbarItemOnClick.bind(this));

        //Gán sự kiện cho các button đóng của form
        $('#btnClose').click(this.btnCloseOnClick);
        $('#btnCloseHeader').click(this.btnCloseHeaderOnClick);

    }


    /**
     * Thực hiện gán các sự kiện cho các thành phần trong toolbar
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
                case Enum.FormMode.Duplicate:
                    var customer = this.getCustomerSelected();
                    this.showAddCustomerForm(customer);
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
     * Sự kiện khi click button hủy bỏ trong footer của dialog
     * CreatedBy: NDHuy (28/07/2020)
     * */
    btnCloseOnClick() {
        $('#frmDialogDetail').hide();
       
    }

    /**
     * Sự kiện khi click đóng trên tiêu đề của dialog
     * CreatedBy: NDHuy (28/07/2020)
     * */
    btnCloseHeaderOnClick() {
        $('#frmDialogDetail').hide();
        
    }

    /**
     * Sự kiệu khi click chọn 1 dòng trong table
     * CreateBy:NDHuy (28/07/2020)
     * */
    rowOnCLick() {
        this.classList.add("row-selected"); //thêm class row-selected vào row được chọn
        //xóa class row-selected khỏi các row còn lại
        $(this).siblings().removeClass("row-selected");
    }

    /**
     * Cất dữ liệu
     * CreatedBy:NDHuy (28/07/2020)
     * */
    saveData(sender) {
        //Lấy dữ liệu được nhập từ các ô input
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

        
        //debugger;
        //Kiểm tra kiểu form
        var me = this;
        if (sender.data.formMode == Enum.FormMode.Add || sender.data.formMode == Enum.FormMode.SaveAndAdd) {
            var json = JSON.stringify(customer);
            //gọi ajax gửi dữ liệu lên server
            
            try {
                $.ajax({
                    url: "/api/v1/customers",
                    method: "POST",
                   
                    data: json,
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
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
            customer["CustomerId"] = sender.data.customerId;
            var json = JSON.stringify(customer);

            try {
                $.ajax({
                    url: "/api/v1/customers/" + sender.data.customerId,
                    method: "PUT",

                    data: json,
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
                    //Hiển thị thông báo thành công/thất bại
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

    }

    /**
     * Hiển thị form thêm khách hàng
     * CreatedBy: NDHuy (28/07/2020)*/
    showAddCustomerForm(customer) {
        this.resetFormDialog();
        if (customer != undefined) {
            //$('#txtCustomerCode').val(customer['CustomerCode']),
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
        }
        this.setButtonEventDialog(Enum.FormMode.Add);
        $("#frmDialogDetail").show();
    }

    /**
     * Hiển thị form sửa thông tin khách hàng
     * CreatedBy: NDHuy (28/07/2020)
     * @param {any} data
     */
    showEditCustomerForm(customer) {
        
        //Đổ dữ liệu ra form
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

        //Hiển thị form
        this.setButtonEventDialog(Enum.FormMode.Edit, customer['CustomerId']);
        $("#frmDialogDetail").show();
    }

    /**
     * Xóa khách hàng
     * CreatedBy:NDHuy (28/07/2020)*/
    deleteCustomer(customer) {
        var confirmDelete = confirm("Bạn chắc chắn muốn xóa?");
        var me = this;
        if (confirmDelete) {
            try {
                $.ajax({
                    url: "/api/v1/customers/" + customer.CustomerId,
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
     * Cập nhật lại table
     * CreatedBy:NDHuy (28/07/2020)*/
    refreshTable() {
        this.loadData();
    }

    /**
     * Lấy vị trí row được chọn
     * CreatedBy:NDHuy (28/07/2020)
     * */
    getIndexOfRowSelected() {
        var index = $('table#tbListCustomer tbody tr.row-selected').index();
        return index;
    }

    /**
     * Thiết lập event của button trong footer của dialog theo chức năng tương ứng
     * @param {number} formMode
     * CreatedBy:NDHuy (28/07/2020)
     * */
    setButtonEventDialog(formMode, CustomerId) {
     
        //Xóa sự kiện khỏi button btnSave và btnSaveAndAdd
        $('#btnSaveAndAdd').unbind();
        $('#btnSave').unbind();

        //thêm sư kiện tùy theo chức năng
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
                $('#btnSave').on('click', { formMode: Enum.FormMode.Edit, customerId: CustomerId }, this.saveData.bind(this));
                break;
            default:
        }
    }

    /**
     * Đưa các ô input về giá trị rỗng
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
        var customerId = $('table#tbListCustomer tbody tr.row-selected').data()['CustomerId'];
        var customer = null;
        try {
            $.ajax({
                url: "/api/v1/customers/" + customerId,
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

    /**
     * Kiểm tra dữ liệu người dùng nhập vào form
     * CreatedBy:NDHuy (03/08/2020)
     * */
    formValidateEvent() {

        /*$("#txtCustomerCode").on("keyup", { status: this.checkCustomerCode }, function () {


        });
        $("#txtCustomerName").on("keyup", {}, this.checkCustomerName);

        $("#txtCustomerTel").on("keyup", {}, function () {
            var check = 0;
            if (validate.IsEmpty($(this).val())) {
                check = 1;
            }
            else if (!validate.isValidPhoneNumber($(this).val()))
                check = 2;

            if (check == 1 || check == 2) {
                $(this).addClass("input-invalid")
            }
            else $(this).removeClass("input-invalid")
        });

        $("#txtCustomerEmail").on("keyup", {}, function () {
            var check = 0;
            if (validate.IsEmpty($(this).val())) {
                check = 1;
            }
            else if (!validate.isValidEmail($(this).val()))
                check = 2;

            if (check == 2) {
                $(this).addClass("input-invalid")
            }
            else $(this).removeClass("input-invalid")
        });*/
    }


    /**
     * Kiểm tra mã khách hàng
     * CreatedBy:NDHuy (03/08/2020)
     * */
    checkCustomerCode() {
        var value = $("#txtCustomerCode").val();
        if (validate.isEmpty(value))
            return Enum.Invalid.Empty;
        return Enum.Valid;
    }

    /**
     * Kiểm tra tên khách hàng
     * CreatedBy: NDHuy (03/08/2020)
     * */
    checkCustomerName() {
        var value = $("#txtCustomerName").val();
        if (validate.isEmpty(value))
            return Enum.Invalid.Empty;
        return Enum.Valid;
    }

    /**
     * Kiểm tra Email khách hàng
     * CreatedBy: NDHuy (03/08/2020)
     * */
    checkCustomerEmail() {
        var value = $("#txtCustomerEmail").val();
        if (!validate.isValidEmail(value))
            return Enum.Invalid.Empty;
        return Enum.Valid;
    }


    /**
     * Kiểm tra số điện thoại khách hàng
     * CreatedBy:NDHuy (03/08/2020)
     * */
    checkCustomerTel() {
        var value = $("#txtCustomerTel").val();
        if (validate.isEmpty(value))
            return Enum.Invalid.Empty;
        else if (!validate.isValidPhoneNumber)
            return Enum.Invalid.WrongFormat;
        return Enum.Valid;
    }
}
