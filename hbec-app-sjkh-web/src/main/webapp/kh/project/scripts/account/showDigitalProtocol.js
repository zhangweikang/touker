/**
 * 查看数字证书的协议
 */
define("project/scripts/account/showDigitalProtocol", function (require, exports, module) {
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        utils = require("utils"),
        layerUtils = require("layerUtils"),
        _pageId = "#account_showDigitalProtocol";

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        // 设置协议标题
        getEvent(".top_title h3").text("");
        // 清空协议内容
        getEvent(".upload_main #contenttxt").text("");
        //查看协议内容
        queryProtocolText();
    }

    function bindPageEvent() {
        /* 绑定返回 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            utils.backPage();
        });

        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            utils.backPage();
        });
    }

    function destroy() {
        // 将协议内容置空
        getEvent("#contenttxt").text("");
        service.destroy();
    }

    /*获取协议内容*/
    function queryProtocolText() {
        // 查询证书内容
        var param = {
            "econtract_no": appUtils.getPageParam("protocolId"),
            "econtract_version": ""
        };
        service.getProtocolInfo(param, function (data) {
            var error_no = data.error_no;
            var error_info = data.error_info;
            if (error_no == "0") {
                // 设置协议标题
                getEvent(".top_title h3").text(data.results[0].econtract_name);
                getEvent(".upload_main #contenttxt").append(data.results[0].econtract_content);
            }
            else {
                layerUtils.iAlert(error_info, -1);
            }
        })
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    // 暴露对外的接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});