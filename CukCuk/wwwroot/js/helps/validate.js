var validate = {

    /**
     * Kiểm tra dữ liêu rỗng
     * @param {any} value
     * return: true - Dữ liệu rỗng, false - Dữ liệu không rỗng
     * CreatedBy:NDHuy (03/08/2020)
     */
    isEmpty(value){
        return value == "" ? true : false;
    },

    /**
     * Kiểm tra định dạng số điện thoại
     * @param {any} value
     * return: true - đúng định dạng số điện thoại, false - sai định dạng số điện thoại
     * CreatedBy:NDHuy (03/08/2020)
     */
    isValidPhoneNumber(value) {
        var reg = /^\d{8,13}$/;
        return reg.test(value);
    },

    /**
     * Kiểm tra định dạng email
     * @param {any} value
     * return: true - đúng định dạng email, false - không đúng định dạng email
     * CreatedBy: NDHuy (03/08/2020)
     */
    isValidEmail(value) {
        var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/gm;
        return reg.test(value);
    },

    /**
     * Kiểm tra định dạng số
     * @param {any} value
     * return: true - đúng định dạng số, false - không đúng định dạng số
     * CreatedBy: NDHuy (03/08/2020)
     */
    isNumber(value) {
        var reg = /^\d+$/;
        return reg.test(value);
    }







}