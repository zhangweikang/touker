/**
 * 查看协议
 */
define("project/scripts/account/showProtocol", function (require, exports, module) {
    var appUtils = require("appUtils"),
        utils = require("utils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        _pageId = "#account_showProtocol";

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        // 清除原有数据
        getEvent("#contenttxt").text("");
        getEvent(".top_title p:eq(0)").text("");
        //设置按钮显示提示文字
        getEvent(".fix_bot .ct_btn a").html("继续开户 >");
        var protocol_id = appUtils.getPageParam("protocol_id");
        var param = {
            "econtract_no": protocol_id,
            "econtract_version": ""
        }
        //查询协议内容
        service.getProtocolInfo(param, function (data) {
            if (error_no = data.error_no) {
                getEvent(".top_title p:eq(0)").text(data.results[0].econtract_name);
                getEvent("#contenttxt").append(data.results[0].econtract_content);
            }
            else {
                layerUtils.iMsg(-1, data.error_info);
            }
        });
    }

    function bindPageEvent() {
        // 绑定返回
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            utils.backPage();
        });

        // 绑定继续开户
        appUtils.bindEvent(getEvent(".ct_btn a"), function () {
            utils.backPage();
        });
    }

    function destroy() {
        // 将协议内容置空
        getEvent("#contenttxt").text("");
        getEvent(".top_title p:eq(0)").text("");
        service.destroy();
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