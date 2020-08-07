
class PaginationCustomer {

    constructor(customerJS) {
        this.customerJS = customerJS;
        this.pageFirst = 1;
        this.pageCurrent = 1;
        this.numberRowOnPage = 40;
        this.totalPage = this.getTotalPage();
        this.initEvent();
        this.updatePanigationBar();
    }

    /**
     * Gán sự kiện cho các button trong menu phân trang
     * CreatedBy:NDHuy (07/08/2020)
     * */
    initEvent() {
        var me = this;
        this.pageFirst = 1;

        //Sự kiện khi click button trở về trang đầu tiên
        $("#pageFirst").on("click", function () {
            me.pageCurrent = 1;
            me.customerJS.loadData(me.pageFirst);
            me.updatePanigationBar();

        });

        //Sự kiện khi click button trang tiếp theo
        $("#pageNext").on("click", function () {
            var pageNext = me.pageCurrent + 1;
            if (pageNext <= me.totalPage) {
                me.pageCurrent = pageNext;
                me.customerJS.loadData(me.pageCurrent);
                me.updatePanigationBar();
            }
        })

        //Sự kiện khi click button trang cuối cùng
        $("#pageLast").on("click", function () {
            debugger
            if (me.pageCurrent < me.totalPage) {
                me.pageCurrent = me.totalPage;
                me.customerJS.loadData(me.pageCurrent);
            }
            me.updatePanigationBar();
            
        });

        //Sự kiện khi click button về lại trang trước
        $("#pagePrev").on("click", function () {
            var pagePrev = me.pageCurrent - 1;
            if (pagePrev < 1) {
                me.pageCurrent = 1;
            }
            else {
                me.pageCurrent = pagePrev;
                me.customerJS.loadData(me.pageCurrent);
            }
            me.updatePanigationBar();
        });

        //Sự kiên khi nhấn enter sau khi sửa input txtPageCurrent
        $('#txtPageCurrent').bind("enterKey", function (e) {
            var page = $("#txtPageCurrent").val();
            if (page != me.pageCurrent && page >= 1 && page <= me.totalPage) {
                me.pageCurrent = page;
                me.customerJS.loadData(me.pageCurrent);
                me.updatePanigationBar();
            }
        });

        $('#txtPageCurrent').keyup(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });

        //Sự kiện khi nhấn refresh
        $("#pageRefresh").on("click", function () {
            me.customerJS.loadData(me.pageCurrent);
            me.updatePanigationBar();
        })
    };

    /**
     * Goi ajax lấy về tổng số bản ghi và tính số trang
     * CreatedBy: NDHuy (07/08/2020)
     * */
    getTotalPage() {
        var me = this;
        var totalPage=0;
        try {
            $.ajax({
                url: "/api/v1/customers/totalrow",
                method: "GET",
                async: false,
                data: {},
                dataType: "json",
                contentType: "application/json",

            }).done(function (response) {
                me.totalRow = response;
                totalPage = Math.ceil(parseInt(response) / me.numberRowOnPage);
              
            }).fail(function (response) {
                console.log(response);
            })
        } catch (e) {
            console.log(e);
        }
       
        return totalPage;
    }

    /**
     * Cập nhật lại thông tin trên tab phân trang
     * */
    updatePanigationBar() {
        $("#txtPageCurrent").val(this.pageCurrent);
        $(".page-total").html(this.totalPage);
        var rowFirst = (this.pageCurrent - 1) * this.numberRowOnPage + 1;
        var rowLast = this.totalRow;
        if (rowFirst + this.numberRowOnPage - 1 < this.totalRow)
            rowLast = rowFirst + this.numberRowOnPage - 1;
        debugger;
        $(".page-info").html("Hiển thị từ " + rowFirst + "-" + rowLast + " trên " + this.totalRow+" kết quả")
    }
}