$(document).ready(function () {
    employeeJS = new EmployeeJS();
})

/**
 * Object quản lý các sự kiện cho danh mục nhân viên
 * CreatedBy: NDHuy (08/08/2020)
 * */
class EmployeeJS {
    constructor() {
        try {
            this.loadData();
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

    }

    /**
     * Load dữ liệu vào table Nhân viên
     * CreatedBy: NDHuy (08/08/2020)
     * */
    loadData() {
        try {
            $("table#tbListEmployee").empty();
            //Gọi Ajax lấy dữ liệu về
        } catch (e) {
            console(e);
        }
    }
}