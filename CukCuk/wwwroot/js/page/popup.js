
class PopupJS {
    constructor() {
        this.btnYes = $("#btnYes");
        this.btnNo = $("#btnNo");
        $("#btnAccept").on("click", this.btnAcceptOnClick.bind(this));
    }

    /**
     * Hiển thị Popup
     * CreatedBy: NDHuy (11/08/2020)
     * */
    showPopup(type, message) {
        $("#txtMessage").html(message);
        this.setIconPopup(type);
        switch (type) {
            case Enum.Popup.Info:
            case Enum.Popup.Warning:
                $("#btnAccept").show();
                break;
            case Enum.Popup.Confirm:
                $("#btnYes").show();
                $("#btnNo").show();
                break;
        }
        $("#popup").show();
       
    }

    /**
     * Ẩn Popup
     * CreatedBy: NDHuy (11/08/2020)
     * */
    hidePopup() {
        $("#popup").hide();
        $("#btnAccept").hide();
        $("#btnYes").hide();
        $("#btnNo").hide();
        $('#btnYes').unbind();
        $('#btnNo').unbind();
    }


    /**
     * Sự kiện khi click buton đồng ý trong popup
     * CreatedBy: NDHuy (11/08/2020)
     * */
    btnAcceptOnClick() {
        this.hidePopup();
    }

    /**
     * Thay đổi icon hiển thị theo dạng popup tương ứng
     * @param {any} type
     * CreatedBy: NDHuy (11/08/2020)
     */
    setIconPopup(type) {
        switch (type) {
            case Enum.Popup.Confirm:
                $(".icon-popup").css('background-image', 'url("/content/images/question.png")');
                break;
            case Enum.Popup.Info:
                $(".icon-popup").css('background-image', 'url("/content/images/info.png")');
                break;
            case Enum.Popup.Warning:
                $(".icon-popup").css('background-image', 'url("/content/images/warning.png")');
                break;
        }
    }

}