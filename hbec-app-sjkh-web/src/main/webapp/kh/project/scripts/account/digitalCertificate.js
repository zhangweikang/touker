/**
 * 安装数字证书
 */
define("project/scripts/account/digitalCertificate", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        global = require("gconfig").global,
        utils = require("utils"),
        _pageId = "#account_digitalCertificate",
        _pageLocation = "account/digitalCertificate";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        utils.installCertificate(successCallBack,errorCallBack,false);
    }

    function bindPageEvent() {
        appUtils.bindEvent(getEvent(".cert_down a"), function (e) {
            getEvent(".qa_list").slideDown("fast");
            e.stopPropagation();
        });

        appUtils.bindEvent($(_pageId), function (e) {
            getEvent(".qa_list").slideUp("fast");
            e.stopPropagation();
        });

        appUtils.bindEvent(getEvent(".icon_back"), function (e) {
            if (global.openChannel == "1") {
                appUtils.pageInit(_pageLocation, "account/openAccount", {"backUrl": _pageLocation});
            } else {
                appUtils.pageInit(_pageLocation, "account/phoneNumberVerify", {"backUrl": _pageLocation});
            }
            e.stopPropagation();
        });
    }

    function destroy() {
        getEvent(".order_succes").show();
        getEvent(".cert_down").hide();
        getEvent("#next_btn a").html("请稍后...");
        getEvent("#next_btn").attr("class", "ce_btn");
        service.destroy();
    }

    /**
     * 下载证书失败后回调
     */
    function errorCallBack(){
        getEvent("#next_btn").attr("class", "ct_btn");
        getEvent("#next_btn a").html("手动安装");
        getEvent(".cert_down .cert_stat").html("安装失败");
        getEvent(".order_succes").hide();
        getEvent(".cert_down").show();
        // 为按钮绑定事件
        appUtils.bindEvent(getEvent("#next_btn a"), function () {
            destroy();
            init();
        });
    }

    /**
     * 下载证书成功后回调
     */
    function successCallBack(){
        getEvent(".cert_down .cert_stat").html("安装完成");
        getEvent(".order_succes").hide();
        getEvent(".cert_down").show();
        getEvent("#next_btn").attr("class", "ct_btn");
        getEvent("#next_btn a").html("继续开户");  // 开户
        // 为按钮绑定事件
        appUtils.bindEvent(getEvent("#next_btn a"), function () {
            appUtils.pageInit(_pageLocation, "account/signProtocol");
        });
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});