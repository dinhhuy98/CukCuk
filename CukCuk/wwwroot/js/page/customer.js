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
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Thuc hien gan cac su kien cho cac thanh phan trong trang
     * CreatedBy: NDHuy (28/07/2020)
     * */
    initEvent() {
        $('#btnClose').click(this.btnCloseOnClick);
        debugger
        $('#btnCloseHeader').click(this.btnCloseHeaderOnClick);
        debugger
        $('#btnSave').click(function () {
            alert('kkkk');
        });
    }

    /**
     * Su kien khi click button dong duoi footer cua dialog
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
}