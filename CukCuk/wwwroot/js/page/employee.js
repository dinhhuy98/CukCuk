$(document).ready(function () {
    employeeJS = new EmployeeJS();
    paginationEmployee = new Pagination(employeeJS);
})

/**
 * Object quản lý các sự kiện cho danh mục nhân viên
 * CreatedBy: NDHuy (08/08/2020)
 * */
class EmployeeJS {
    constructor() {
        this.controller = "employees";
        try {
            this.loadData(1);
            this.initEvent();
        } catch (e) {
            console(e);
        }
    }

    /**
     * Thực hiện gán các sự kiện cho các thành phần trong trang
     * CreatedBy: NDHuy (08/08/2020)
     * */
    initEvent() {
        //Gán sự kiện click cho row trong table
        $("#tbListEmployee").on("click", "tbody tr", this.rowOnClick)

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
     * Load dữ liệu vào table Nhân viên
     * CreatedBy: NDHuy (08/08/2020)
     * */
    loadData(page) {
        try {
            $("table#tbListEmployee tbody").empty();
            //Gọi Ajax lấy dữ liệu về
            $.ajax({
                url: "/api/v1/employees?page=" + page,
                method: "GET",
                data: {},
                dataType: "json",
                contentType: "application/json",
            }).done(function (response) {
                //console.log(response);
                //đọc dữ liệu và render dữ liệu từng nhân viên
                $.each(response, function (index, item) {
                    var bg = index % 2 == 0 ? "bg-white " : "bg-ghostwhite ";
                    var firstSelected = index == 0 ? "row-selected" : "";
                    var employeeInfoHTML = `<tr class="` + bg + firstSelected + `">
                                <td>`+ item['EmployeeCode'] + `</td>
                                <td>`+ item['EmployeeName'] + `</td>
                                <td>`+ (item['Gender']==true? "Nữ":"Nam") + `</td>
                                <td>`+ commonJS.formatDate(new Date(item['Birthday']),"/") + `</td>
                                <td>`+ item['PhoneNumber'] + `</td>
                                <td>`+ item['Email'] + `</td>
                                <td>`+ item['Position'] + `</td>
                                     
                            </tr>`;
                    /*<td>`+ item['Department'] + `</td>
                        <td>`+ commonJS.formatMoney(item['Salary']) + `</td>
                        <td>`+ item['StatusJob'] + `</td> */

                    //Tạo đối tượng tr tương ứng với chuỗi customerInfoHTML
                    var jQueryObject = $('<tr></tr>').html(employeeInfoHTML).children();
                    //thêm data cho tr
                    jQueryObject.data("EmployeeId", item['CustomerId']);
                    $('table#tbListEmployee tbody').append(jQueryObject);
                    //debugger;
                    //console.log(item);
                })

                console.log("load data successful");
            }).fail(function (response) {
                console.log(response);
            })
    } catch(e) {
        console.log(e);
        }
    }

    /**
     * Thực hiện gán các sự kiên cho các thành phần trong toolbar
     * @param {any} sender
     * CreatedBy: NDHuy (09/08/2020)
     */
    toolbarItemOnClick(sender) {
        try {
            var formMode = sender.data.formMode;
            switch (formMode) {
                case Enum.FormMode.Add:
                    this.showAddEmployeeForm();
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
                    this.showAddEmployeeForm(employee);
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
    * Gọi ajax lấy thông tin nhân viên đang được chọn trong table
    * CreatedBy:NDHuy (09/08/2020)
    * */
    getCustomerSelected() {
        var employeeId = $('table#tbListEmployee tbody tr.row-selected').data()['EmployeeId'];
        var employee = null;
        try {
            $.ajax({
                url: "/api/v1/employee/" + employeeId,
                method: "GET",
                async: false,
                data: {},
                dataType: "json",
                contentType: "application/json",

            }).done(function (response) {
                employee = response;
            }).fail(function (response) {
                console.log("error");
            })
        } catch (e) {
            console.log("error");
        }
        return employee;
    }

    /**
    * Hiển thị form thêm nhân viên
    * CreatedBy: NDHuy (09/08/2020)*/
    showAddEmployeeForm(employee) {
        this.resetFormDialog();

        //Thực hiện khi chức năng duplicate được sử dụng
        if (employee != undefined) {
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
    * Thiết lập event của button trong footer của dialog theo chức năng tương ứng
    * @param {number} formMode
    * CreatedBy:NDHuy (09/08/2020)
    * */
    setButtonEventDialog(formMode, EmployeeId) {

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
                $('#btnSave').on('click', { formMode: Enum.FormMode.Edit, employeeId: EmployeeId }, this.saveData.bind(this));
                break;
            default:
        }
    }

    /**
     * Cất dữ liệu
     * CreatedBy:NDHuy (09/08/2020)
     * */
    saveData(sender) {
        //Lấy dữ liệu được nhập từ các ô input
        var customer = {
            "EmployeeId": "1c17f8a1-5347-6f6c-080c-87ae14180c33",
            "EmployeeCode": "NV00999",
            "Birthday": "2019-03-14T00:00:00",
            "Gender": false,
            "Email": "Bobo@nowhere.com",
            "PhoneNumber": "037042482",
            "IdentificationCard": "0566890159",
            "DateOfIssue": "1998-03-29T00:00:00",
            "PlaceOfIssue": "Port Pirie",
            "Position": "Chánh văn phòng",
            "Department": "Văn Phòng Hà Nội",
            "EmployeeTaxCode": "1447339834",
            "Salary": 13556291.0000,
            "JoinDate": "1970-01-06T00:00:00",
            "StatusJob": "Đang thử việc",
            "CustomerAvatar": "employee/avatardefault.jpg",
            "CreatedDate": "2020-08-11T00:53:05",
            "ModifiedDate": "2020-08-10T00:00:06",
            "EmployeeName": "Phan Lan Phương"
        };
        debugger;
        //var fromData = this.createDataImage();


        //return formData;



        //Kiểm tra kiểu form
        var me = this;
        if (sender.data.formMode == Enum.FormMode.Add || sender.data.formMode == Enum.FormMode.SaveAndAdd) {
            //var data = [customer, formData];


            //var json = ;
            //gọi ajax gửi dữ liệu lên server


            try {
                $.ajax({
                    url: "/api/v1/customers/",
                    method: "POST",

                    data: JSON.stringify(customer),
                    dataType: "text",
                    contentType: "application/json;charset=utf-8",
                }).done(function (response) {
                    me.uploadImage(customer["CustomerCode"]);
                    alert("Thêm mới thành công");
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
                    if ($("#fileImage").get(0).files[0] != undefined) {
                        me.uploadImage(customer.CustomerCode);
                    }
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
     * Đưa các ô input về giá trị rỗng
     * CreatedBy: NDHuy (28/07/2020)
     * */
    resetFormDialog() {
        $('#frmDialogDetail input').val("");
       
        $('#frmDialogDetail input').removeClass("input-invalid");
    }

    /**
     * Sự kiện khi click chọn 1 dòng trong table
     * CreatedBy: NDHuy (09/08/2020)
     * */
    rowOnClick() {
        //Thêm class row-selected cho row được chọn
        this.classList.add("row-selected");
        //Xóa class row-selected khỏi các row còn lại
        $(this).siblings().removeClass("row-selected");
    }

    /**
     * Sự kiện khi click button hủy bỏ trong footer của dialog
     * CreatedBy: NDHuy (09/08/2020)
     * */
    btnCloseOnClick() {
        $('#frmDialogDetail').hide();

    }

    /**
     * Sự kiện khi click đóng trên tiêu đề của dialog
     * CreatedBy: NDHuy (09/08/2020)
     * */
    btnCloseHeaderOnClick() {
        $('#frmDialogDetail').hide();

    }
}