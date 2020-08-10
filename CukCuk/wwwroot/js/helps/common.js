var commonJS = {
    LanguageCode:"EN",
    /**
     * Tao chuoi HTML checkbox tuong ung voi true/false
     * @param {boolean} value true: checked
     * CreatedBy: NDHuy (28/07/2020)
     * */
    buildCheckBoxByValue(value) {
        var checkBoxHTML = $(`<input type="checkbox"/>`);
        if (value) {
            checkBoxHTML = checkBoxHTML.attr("checked", true);
        }
        return checkBoxHTML[0].outerHTML;
    },

    /**
     * Ham dinh dang ngay hien thi
     * @param {any} date
     * */
    formatDate(date, charseparator) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        month = (month < 10) ? "0" + month : month;
        day = (day < 10) ? "0" + day : day;
        //return day + "/" + month + "/" + year;
        return year + charseparator + month + charseparator + day;
    },


    /**
     * Ham dinh dang hien thi tien
     * @param{number} money
     * CreatedBy:NDHuy (28/07/2020)
     * */
    formatMoney(money) {
        return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
}