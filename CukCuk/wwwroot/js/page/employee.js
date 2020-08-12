$(document).ready(function () {
    employeeJS = new EmployeeJS();
    
})

/**
 * Object quản lý các sự kiện cho danh mục nhân viên
 * CreatedBy: NDHuy (08/08/2020)
 * */
class EmployeeJS {
    constructor() {
        this.controller = "employees";
        try {
            this.listRowSelected = []; //Mảng chứa EmployeeId của các row được chọn
            this.loadData(1);
            this.paginationEmployee = new Pagination(this);
            this.popup = new PopupJS();
            this.popup.hidePopup();
            this.initEvent();
            this.formValidateEvent();

            
            
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Thực hiện gán các sự kiện cho các thành phần trong trang
     * CreatedBy: NDHuy (08/08/2020)
     * */
    initEvent() {
        
       // $("#tbListEmployee").on("click", "tbody tr", this.rowOnClick)

        //Gán sự kiện cho các button trong toolbar
        $('#btnAdd').on('click', { formMode: Enum.FormMode.Add }, this.toolbarItemOnClick.bind(this));
        $('#btnEdit').on('click', { formMode: Enum.FormMode.Edit }, this.toolbarItemOnClick.bind(this));
        $('#btnDelete').on('click', { formMode: Enum.FormMode.Delete }, this.toolbarItemOnClick.bind(this));
        $('#btnDuplicate').on('click', { formMode: Enum.FormMode.Duplicate }, this.toolbarItemOnClick.bind(this));
        $('#btnRefresh').on('click', { formMode: Enum.FormMode.Refresh }, this.toolbarItemOnClick.bind(this));

        //Gán sự kiện cho các button đóng của form
        $('#btnClose').click(this.btnCloseOnClick);
        $('#btnCloseHeader').click(this.btnCloseHeaderOnClick);

        //Hiển thị ảnh xem trước khi người dùng upload ảnh
        this.changeImage = false; //biến sử dụng để kiểm tra người dùng chọn ảnh chưa
        $("#fileUpload").on('change', this.showImagePreview.bind(this));
        $(".delete-avatar").on("click", {}, this.deleteAvatar.bind(this));

        $("#txtSalary").on("keyup", this.formatSalary);

        //Gán sự kiện click cho row trong table
        $("#tbListEmployee").on("click", "tbody tr", {me:this}, this.rowOnClick)
    }


    /**
     * Sự kiện click chọn 1 bản ghi trên table hoặc giữ ctrl chọn nhiều bản ghi
     * @param {any} sender
     * CreatedBy: NDHuy (12/08/2020)
     */
    rowOnClick(sender) {
        //Kiểm tra người dùng có đang nhấn phím ctrl
        if (event.ctrlKey) {
            if ($(this).hasClass("row-selected")) {
                sender.data.me.listRowSelected =
                    sender.data.me.listRowSelected.filter(item => item != $(this).data()['EmployeeId']);
                $(this).removeClass("row-selected")
            }
            else {
                this.classList.add("row-selected");
                sender.data.me.listRowSelected.push($(this).data()['EmployeeId']);
            }
        }
        else {
            this.classList.add("row-selected");
            $(this).siblings().removeClass("row-selected");
            sender.data.me.listRowSelected.splice(0, sender.data.me.listRowSelected.length);//xóa tất cả các phần tử của mảng
            sender.data.me.listRowSelected.push($(this).data()['EmployeeId']);
        }

        //Nếu chọn nhiều thì disable button edit và duplicate
        if (sender.data.me.listRowSelected.length != 1) {
            $('#btnEdit').attr("disabled", true);
            $('#btnDuplicate').attr("disabled", true);
        }
        else {
            $('#btnEdit').attr("disabled", false);
            $('#btnDuplicate').attr("disabled", false);
        }

        //Nếu mảng rỗng thì disable button delete
        if (sender.data.me.listRowSelected.length == 0) {
            $('#btnDelete').attr("disabled", true);
        }
        else
            $('#btnDelete').attr("disabled", false);

        console.log(sender.data.me.listRowSelected);
    }

    /**
     * Load dữ liệu vào table Nhân viên
     * CreatedBy: NDHuy (08/08/2020)
     * */
    loadData(page) {
        var me = this;
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
                    var firstSelected = "";
                    //Mặc định bản ghi đầu tiên được chọn
                    if (index == 0) {
                        me.listRowSelected.push(item['EmployeeId']);
                        firstSelected = "row-selected";
                    }
                    var employeeInfoHTML = `<tr class="` + bg + firstSelected + `">
                                <td>`+ item['EmployeeCode'] + `</td>
                                <td>`+ item['EmployeeName'] + `</td>
                                <td>`+ (item['Gender']==true? "Nữ":"Nam") + `</td>
                                <td style="text-align:center">`+ commonJS.formatDate(new Date(item['Birthday']),"/",1) + `</td>
                                <td style="text-align:center">`+ item['PhoneNumber'] + `</td>
                                <td>`+ item['Email'] + `</td>
                                <td>`+ item['Position'] + `</td>
                                <td>`+ item['Department'] + `</td>
                                <td style="text-align:right">`+ commonJS.formatMoney(item['Salary']) + `</td>
                                <td>`+ item['StatusJob'] + `</td>
                                     
                            </tr>`;
                    /* */

                    //Tạo đối tượng tr tương ứng với chuỗi customerInfoHTML
                    var jQueryObject = $('<tr></tr>').html(employeeInfoHTML).children();
                    //thêm data cho tr
                    jQueryObject.data("EmployeeId", item['EmployeeId']);
                    $('table#tbListEmployee tbody').append(jQueryObject);
                    //debugger;
                    //console.log(item);
                })
                $('#btnEdit').attr("disabled", false);
                $('#btnDuplicate').attr("disabled", false);
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
                    var employee = this.getEmployeeSelected();
                    this.showEditEmployeeForm(employee);
                    break;
                case Enum.FormMode.Delete:
                    this.confirmDeleteEmployee();
                    break;
                case Enum.FormMode.Duplicate:
                    var employee = this.getEmployeeSelected();
                    this.showAddEmployeeForm(employee);
                    break;
                case Enum.FormMode.Refresh:
                    this.loadData(1);
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
    getEmployeeSelected() {
        var employeeId = $('table#tbListEmployee tbody tr.row-selected').data()['EmployeeId'];
        var employee = null;
        try {
            $.ajax({
                url: "/api/v1/employees/" + employeeId,
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
            //Đổ dữ liệu ra form
                $("#dtBirthday").val(commonJS.formatDate(new Date(employee["Birthday"]), "-", 0)),
                $("#selectGender").val(employee["Gender"] == false ? "false" : "true"),
                $("#txtEmail").val(employee["Email"]),
                $("#txtPhoneNumber").val(employee["PhoneNumber"]),
                $("#txtIdentificationCard").val(employee["IdentificationCard"]),
                $("#dtDateOfIssue").val(commonJS.formatDate(new Date(employee["DateOfIssue"]), "-", 0)),
                $("#txtPlaceOfIssue").val(employee["PlaceOfIssue"]),
                $("#selectPosition").val(employee["Position"]),
                $("#selectDepartment").val(employee["Department"]),
                $("#txtEmployeeTaxCode").val(employee["EmployeeTaxCode"]),
                $("#txtSalary").val(commonJS.formatMoney(employee["Salary"])),
                $("#dtJoinDate").val(commonJS.formatDate(new Date(employee["JoinDate"]), "-", 0)),
                $("#selectStatusJob").val(employee["StatusJob"]),
                $("#txtEmployeeName").val(employee["EmployeeName"])
/*                $(".avatar-upload").css('background-image', 'url(/upload/' + employee["EmployeeAvatar"] + ')');*/

        }
        //Tự động hiển thị mã nhân viên theo tiêu chí "NV"+Mã nhân viên lớn nhất trong hệ thống
        var maxEmployeeCode = this.getMaxEmployeeCode();
        $("#txtEmployeeCode").val(this.addOneToEmployeeCode(maxEmployeeCode));
        this.setButtonEventDialog(Enum.FormMode.Add,employee);
        $("#frmDialogDetail").show();
        $("#txtEmployeeCode").focus();
    }

    /**
     * Hiển thị form sửa thông tin nhân viên
     * CreatedBy: NDHuy (28/07/2020)
     * @param {any} data
     */
    showEditEmployeeForm(employee) {

        //Đổ dữ liệu ra form
        $("#txtEmployeeCode").val(employee["EmployeeCode"]),
        $("#dtBirthday").val(commonJS.formatDate(new Date(employee["Birthday"]),"-",0)),
        $("#selectGender").val(employee["Gender"]==false? "false":"true"),
        $("#txtEmail").val(employee["Email"]),
        $("#txtPhoneNumber").val(employee["PhoneNumber"]),
        $("#txtIdentificationCard").val(employee["IdentificationCard"]),
        $("#dtDateOfIssue").val(commonJS.formatDate(new Date(employee["DateOfIssue"]), "-", 0)),
        $("#txtPlaceOfIssue").val(employee["PlaceOfIssue"]),
        $("#selectPosition").val(employee["Position"]),
        $("#selectDepartment").val(employee["Department"]),
            $("#txtEmployeeTaxCode").val(employee["EmployeeTaxCode"]),
            $("#txtSalary").val(commonJS.formatMoney(employee["Salary"])),
        $("#dtJoinDate").val(commonJS.formatDate(new Date(employee["JoinDate"]),"-",0)),
        $("#selectStatusJob").val(employee["StatusJob"]),
        $("#txtEmployeeName").val(employee["EmployeeName"]),
        $(".avatar-upload").css('background-image', 'url(/upload/' + employee["EmployeeAvatar"] + ')');

        //Hiển thị form
        this.setButtonEventDialog(Enum.FormMode.Edit, employee);
       
        $("#frmDialogDetail").show();
        $("#txtEmployeeCode").focus();
    }

    /**
     * Hiển thị popup xác nhận xóa nhân viên
     * @param {any} employee
     * CreatedBy: NDHuy (11/08/2020)
     */
    confirmDeleteEmployee() {
        //Kiểm tra người dùng có chọn xóa nhiều nhân viên hay không
        if (this.listRowSelected.length == 1) {
            var employee = this.getEmployeeById(this.listRowSelected[0]);
            var message = "Bạn có chắc chắn muốn xóa nhân viên " + employee["EmployeeCode"] + " - " + employee["EmployeeName"] + "?";
        }
        else {
            var message = "Bạn có chắc chắn muốn xóa những bản ghi vừa chọn?";
        }
        //Hiển thị popup và gán sự kiện cho button "Có" và "Không"
        this.popup.showPopup(Enum.Popup.Confirm, message);
        this.popup.btnNo.on("click", this.popup.hidePopup);
        this.popup.btnYes.on("click", { },this.deleteEmployee.bind(this));
    }

    /**
     * Xóa nhân viên
     * CreatedBy:NDHuy (28/07/2020)
     * */
    deleteEmployee() {
        debugger
        var me = this;
        var listEmployeeId = JSON.stringify(me.listRowSelected);
            try {
                $.ajax({
                    url: "/api/v1/employees/",
                    method: "DELETE",
                    data: listEmployeeId,
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
                    me.popup.hidePopup();
                    me.loadData(1);
                    me.listRowSelected.splice(0, me.listRowSelected.length);//Xóa hết các phần tử của mảng listRowSelected
                    me.paginationEmployee.updatePageCurrent(1);
                    me.paginationEmployee.updatePanigationBar();
                }).fail(function (response) {
                    console.log(response);
                });
            } catch (e) {
                console.log(e);
            }
    }


    /**
    * Thiết lập event của button trong footer của dialog theo chức năng tương ứng
    * @param {number} formMode
    * CreatedBy:NDHuy (09/08/2020)
    * */
    setButtonEventDialog(formMode, employee) {

        //Xóa sự kiện khỏi button btnSave và btnSaveAndAdd
        $('#btnSaveAndAdd').unbind();
        $('#btnSave').unbind();

        //thêm sư kiện tùy theo chức năng
        switch (formMode) {
            case Enum.FormMode.Add:
                $('#btnSave .btn-text').html("Cất")
                $('#btnSaveAndAdd').show()
                $('#btnSave').on('click', { formMode: Enum.FormMode.Add }, this.saveData.bind(this));
                $('#btnSaveAndAdd').on('click', { formMode: Enum.FormMode.SaveAndAdd, employee }, this.saveData.bind(this));
                break;
            case Enum.FormMode.Edit:
                $('#btnSave .btn-text').html("Cập nhật")
                $('#btnSaveAndAdd').hide()
                $('#btnSave').on('click', { formMode: Enum.FormMode.Edit, employee }, this.saveData.bind(this));
                break;
            default:
        }
    }

    /**
     * Cất dữ liệu
     * CreatedBy:NDHuy (09/08/2020)
     * */
    saveData(sender) {
        var fileName = this.createFileName($("#txtEmployeeCode").val());
        //Lấy dữ liệu được nhập từ các ô input
        var employee = {
            "EmployeeCode": $("#txtEmployeeCode").val(),
            "Birthday": commonJS.formatDate(new Date($("#dtBirthday").val()),"-",0),
            "Gender": $("#selectGender").val(),
            "Email": $("#txtEmail").val(),
            "PhoneNumber": $("#txtPhoneNumber").val(),
            "IdentificationCard": $("#txtIdentificationCard").val(),
            "DateOfIssue": commonJS.formatDate(new Date($("#dtDateOfIssue").val()), "-", 0),
            "PlaceOfIssue": $("#txtPlaceOfIssue").val(),
            "Position": $("#selectPosition").val(),
            "Department": $("#selectDepartment").val(),
            "EmployeeTaxCode": $("#txtEmployeeTaxCode").val(),
            "Salary": parseInt(commonJS.removeDot($("#txtSalary").val())),
            "JoinDate": commonJS.formatDate(new Date($("#dtJoinDate").val()), "-", 0),
            "StatusJob": $("#selectStatusJob").val(),
            "EmployeeAvatar": "employee/"+fileName ,
            "CreatedDate": commonJS.formatDate(new Date(),"-",0),
            "EmployeeName": $("#txtEmployeeName").val()

        };

        if (this.checkValidateInput() == false)
            return;

        //Kiểm tra trùng EmployeeCode
        var checkEmployeeCode = this.checkEmployeeCodeExist(employee["EmployeeCode"]);
        if (checkEmployeeCode == true && employee["EmployeeCode"] != sender.data.employee.EmployeeCode) {
            this.popup.showPopup(Enum.Popup.Warning, "Mã nhân viên đã tồn tại, vui lòng nhập lại!");
            $("#txtEmployeeCode").addClass("input-invalid");
            return;
        }
        $("#txtEmployeeCode").removeClass("input-invalid");
        //Kiểm tra kiểu form
        debugger
        var me = this;
        if (sender.data.formMode == Enum.FormMode.Add || sender.data.formMode == Enum.FormMode.SaveAndAdd) {

            //gọi ajax gửi dữ liệu lên server


            try {
                $.ajax({
                    url: "/api/v1/employees/",
                    method: "POST",
                   
                    data: JSON.stringify(employee),
                    dataType: "text",
                    contentType: "application/json;charset=utf-8",
                }).done(function (response) {

                    me.uploadImage(fileName);
                    me.popup.showPopup(Enum.Popup.Info, "Thêm mới thành công!");
                    me.loadData(1);
                    me.paginationEmployee.updatePageCurrent(1);
                    me.paginationEmployee.updatePanigationBar();
                    if (sender.data.formMode == Enum.FormMode.SaveAndAdd) {
                        me.resetFormDialog();
                    }
                    else
                        $('#frmDialogDetail').hide();
                }).fail(function (response) {
                    console.log(response);
                });
            } catch (e) {
                console.log(e);
            }

            
        }
        else if (sender.data.formMode == Enum.FormMode.Edit) {
            if (this.changeImage == false) {
                employee["EmployeeAvatar"] = sender.data.employee["EmployeeAvatar"]
            }
            employee["EmployeeId"] = sender.data.employee["EmployeeId"];
            employee["CreatedDate"] = sender.data.employee["CreatedDate"];
            employee["ModifiedDate"] = commonJS.formatDate(new Date(), "-", 0);
            var json = JSON.stringify(employee);
            debugger;
            try {
                $.ajax({
                    url: "/api/v1/employees/" + sender.data.employee["EmployeeId"],
                    method: "PUT",

                    data: json,
                    dataType: "text",
                    contentType: "application/json; charset=utf-8",
                }).done(function (response) {
                    if ($("#fileUpload").get(0).files[0] != undefined) {
                        me.uploadImage(fileName);
                    }
                    //Hiển thị thông báo thành công/thất bại
                    me.popup.showPopup(Enum.Popup.Info, "Cập nhật thành công!");
                    me.loadData(1);
                    me.paginationEmployee.updatePageCurrent(1);
                    me.paginationEmployee.updatePanigationBar();
                    
                    
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
     * CreatedBy: NDHuy (08/08/2020)
     * */
    resetFormDialog() {
        $('#frmDialogDetail input').val("");
        $('#frmDialogDetail input').removeClass("input-invalid");
        $('#frmDialogDetail select option:first-child').attr('selected', true);
        $(".avatar-upload").css('background-image', 'url("/content/images/avatardefault.png")');
        $('.image-info').html("Chỉ được upload tệp<br/> .jpg .jpeg .png .gif")
    }

    /**
     * Kiểm tra xem người dùng có thay đổi ảnh avatar
     * CreatedBy: NDHuy (09/08/2020)
     * */
    checkChangeAvatar() {
        if ($(".avatar-upload").css("background-image") != 'url("https://localhost:44339/upload/employee/avatardefault.jpg")') {
            return true;
        }
        return false;
    }

    /**
     * Hiển thị ảnh xem trước khi upload ảnh
     * CreatedBy:NDHuy (10/08/2020)
     * */
    showImagePreview() {
        if (!validate.isValidImage($("#fileUpload")[0].files[0].name)) {
            this.popup.showPopup(Enum.Popup.Warning, "Không hỗ trợ định dạng ảnh này");
            return;
        }
        this.changeImage = true;
        var file = $("#fileUpload")[0].files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            var imageUrl = event.target.result;
            $(".avatar-upload").css('background-image', 'url(' + imageUrl + ')');
           // $("#img-info").html(file.name);
        };
        fileReader.readAsDataURL(file);
        $('.image-info').html(file.name)
    }

    /**
     * Xóa ảnh đã chọn để upload
     * CreatedBy:NDHuy (10/08/2020)
     * */
    deleteAvatar() {
        this.changeImage = true;
        $(".avatar-upload").css('background-image', 'url("/content/images/avatardefault.png")');
        $('#fileUpload').val("");
        $('.image-info').html("Chỉ được upload tệp<br/> .jpg .jpeg .png .gif")
    }

    /**
     * Tạo tên file dựa trên mã nhân viên
     * @param {any} employeeName: Tên nhân viên
     * CreatedBy: NDHuy(10/08/2020)
     */
    createFileName(employeeName) {
        if ($("#fileUpload").val() == "" || !validate.isValidImage($("#fileUpload")[0].files[0].name))
            return "avatardefault.jpg";
        var arrString = $("#fileUpload").val().split(".");
        var typeFile = arrString[arrString.length - 1];
        return employeeName + "." + typeFile;
    }

    /**
    * Đưa ảnh lên server
    * CreatedBy:NDHuy (10/08/2020)
    * */
    uploadImage(imgName) {
        if (imgName == null)
            imgName = "avatardefault.png";
        var image = $("#fileUpload").get(0).files;

        var formData = new FormData();
        formData.append('image', image[0]);
        debugger
        $.ajax({
            url: '/api/v1/employees/uploadimg/' + imgName,
            type: 'POST',
            data: formData,
            sync: false,
            processData: false,
            contentType: false,

        }).done(function (response) {
            console.log(response);
        }).fail(function (response) {
            console.log(response);
        });
    }

    /**
     * Sự kiện khi click chọn 1 dòng trong table
     * CreatedBy: NDHuy (09/08/2020)
     * *//*
    rowOnClick() {
        //Thêm class row-selected cho row được chọn
        this.classList.add("row-selected");
        //Xóa class row-selected khỏi các row còn lại
        $(this).siblings().removeClass("row-selected");
    }*/

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

    /**
    * Sự kiện kiểm tra dữ liệu người dùng nhập vào form
    * CreatedBy:NDHuy (03/08/2020)
    * */
    formValidateEvent() {
        $("#txtEmployeeCode").on("keyup", {}, this.checkEmployeeCode);
        $("#txtEmployeeCode").on("blur", {}, this.checkEmployeeCode);

        $("#txtEmployeeName").on("keyup", {}, this.checkEmployeeName);
        $("#txtEmployeeName").on("blur", {}, this.checkEmployeeName);

        $("#txtEmail").on("keyup", {}, this.checkEmployeeEmail);
        $("#txtEmail").on("blur", {}, this.checkEmployeeEmail);

        $("#txtPhoneNumber").on("keyup", {}, this.checkPhoneNumber);
        $("#txtPhoneNumber").on("blur", {}, this.checkPhoneNumber);
    }

    /**
     * Kiểm tra dữ liệu người dùng nhập vào form
     * CreatedBy: NDHuy(10/08/2020)
     * */
    checkValidateInput() {
        var checkEmployeeCode = this.checkEmployeeCode();
        var checkEmployeeName = this.checkEmployeeName();
        var checkEmployeeEmail = this.checkEmployeeEmail();
        var checkPhoneNumber = this.checkPhoneNumber();
        switch (checkEmployeeCode) {
            case Enum.Invalid.Empty:
                this.popup.showPopup(Enum.Popup.Warning,"Mã nhân viên không được trống!");
                return false;
        }

        switch (checkEmployeeName) {
            case Enum.Invalid.Empty:
                this.popup.showPopup(Enum.Popup.Warning, "Tên nhân viên không được trống!");
                return false;
        }

        switch (checkEmployeeEmail) {
            case Enum.Invalid.Empty:
                this.popup.showPopup(Enum.Popup.Warning, "Email không được trống!");
                return false;
            case Enum.Invalid.WrongFormat:
                this.popup.showPopup(Enum.Popup.Warning, "Sai định dạng Email!");
                return false;
        }

        switch (checkPhoneNumber) {
            case Enum.Invalid.Empty:
                this.popup.showPopup(Enum.Popup.Warning, "Số điện thoại không được trống!");
                return false;
            case Enum.Invalid.WrongFormat:
                this.popup.showPopup(Enum.Popup.Warning, "Sai định dạng số điện thoại!");
                return false;
        }

        return true;

    }

    /**
     * Kiểm tra mã nhân viên có tồn tại trong database?
     * @param {any} employeeCode
     * CreatedBy: NDHuy (11/08/2020)
     */
    checkEmployeeCodeExist(employeeCode) {
        //Gọi Ajax lấy dữ liệu về
        try {
            var check = null;
            $.ajax({
                async: false,
                url: "/api/v1/employees/findemployeebycode?employeeCode=" + employeeCode,
                method: "GET",
                data: {},
                dataType: "text",
                contentType: "application/json",
            }).done(function (response) {
                check = response=="false"? false:true;
            }).fail(function (response) {
                console.log(response);
            });
            debugger;
            return Boolean(check);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Kiểm tra mã nhân viên
     * CreatedBy:NDHuy (10/08/2020)
     * */
    checkEmployeeCode() {
        var value = $("#txtEmployeeCode").val();
        if (validate.isEmpty(value)) {
            $("#txtEmployeeCode").addClass("input-invalid");
            return Enum.Invalid.Empty;
        }
        $("#txtEmployeeCode").removeClass("input-invalid");
        return Enum.Valid;
    }

    /**
     * Kiểm tra tên nhân viên
     * CreatedBy: NDHuy (10/08/2020)
     * */
    checkEmployeeName() {
        var value = $("#txtEmployeeName").val();
        if (validate.isEmpty(value)) {
            $("#txtEmployeeName").addClass("input-invalid");
            return Enum.Invalid.Empty;
        }
        $("#txtEmployeeName").removeClass("input-invalid");
        return Enum.Valid;
    }

    /**
     * Kiểm tra Email nhân viên
     * CreatedBy: NDHuy (10/08/2020)
     * */
    checkEmployeeEmail() {
        var value = $("#txtEmail").val();
        if (validate.isEmpty(value)) {
            $("#txtEmail").addClass("input-invalid");
            return Enum.Invalid.Empty;
        }
        else if (!validate.isValidEmail(value)) {

            $("#txtEmail").addClass("input-invalid");
            return Enum.Invalid.WrongFormat;
        }
        $("#txtEmail").removeClass("input-invalid");
        return Enum.Valid;
    }


    /**
     * Kiểm tra số điện thoại nhân viên
     * CreatedBy:NDHuy (10/08/2020)
     * */
    checkPhoneNumber() {
        var value = $("#txtPhoneNumber").val();
        if (validate.isEmpty(value)) {
            $("#txtPhoneNumber").addClass("input-invalid");
            return Enum.Invalid.Empty;
        }
        else if (!validate.isValidPhoneNumber(value)) {
            $("#txtPhoneNumber").addClass("input-invalid");
            return Enum.Invalid.WrongFormat;
        }
        $("#txtPhoneNumber").removeClass("input-invalid");
        return Enum.Valid;
    }

    /**
     * Gọi Ajax trả về mã nhân viên lớn nhất
     * */
    getMaxEmployeeCode() {
        var result = null;
        try {
            $.ajax({
                async: false,
                url: "/api/v1/employees/maxemployeecode",
                method: "GET",
                data: {},
                dataType: "text",
                contentType: "application/json",
            }).done(function (response) {
                result = response;
            }).fail(function (response) {
                console.log(response);
            });
        } catch (e) {
            console.log(e);
        }
        return result;
    }

    /**
     * Lấy ra nhân viên dựa trên id
     * @param {any} employeeId
     */
    getEmployeeById(employeeId) {
        var employee = null;
        try {
            $.ajax({
                url: "/api/v1/employees/" + employeeId,
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
     * Tạo mã nhân viên mới lớn hơn 1 từ mã nhân viên truyền vào
     * @param {any} employeeCode
     * CreatedBy: NDHuy(11/08/2020)
     */
    addOneToEmployeeCode(employeeCode) {
        var code = employeeCode.substr(2, employeeCode.length - 2);
        var arr = code.split("");
        var k = 1;
        for (var i = arr.length - 1; i >= 0; i--) {
            var n = parseInt(arr[i])+k;
            if (n >= 10) {
                k = 1;
                n = 0;
            }
            else
                k = 0;
            arr[i] = n;
        }
        return "NV"+arr.join("");
    }

    /**
     * Tự động format mức lương khi nhập
     * */
    formatSalary() {
        var formatValue = commonJS.formatMoney(commonJS.removeDot($(this).val()));
        $(this).val(formatValue);
    }
    
}