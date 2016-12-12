/**
 * 新开户(转户)须知
 */
define("project/scripts/account/openAccount", function (require, exports, module) {
    // 私有业务模块的全局变量 begin
    var appUtils = require("appUtils"),
        global = require("gconfig").global,
        utils = require("utils"),
        backUrl = "",
        _pageId = "#account_openAccount";
    // 私有业务模块的全局变量 end

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        //钱钱炒股App保留上方返回按钮
        if (appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app") {
            $(_pageId + " .icon_back").show();
        }

        //页面跳转URL
        backUrl = appUtils.getPageParam("backUrl");

        //检查是否是非开户时间
        checkIfTradeTime();
    }

    //检查是否是非开户时间
    function checkIfTradeTime() {
        $.ajax({
            type: 'post',
            url: global.serverToukerUrl + "/commons/getTradeDate",
            cache: false,
            success: function (data) {
                var code = data.status;
                //001035,非交易时间; 001036,交易时间
                if (code == "001035") {
                    getEvent(".sjkh-vacation").show();	//展示非交易时间弹框
                    getEvent(".fix_bot .ct_btn .next").html("下次再来");
                }
            },
            error: function () {
                getEvent(".fix_bot .ct_btn .next").html("下次再来"); 	//显示 我知道了  按钮
            }
        });
    }

    //绑定事件
    function bindPageEvent() {
        //为返回按钮绑定返回事件,钱钱炒股中,点击返回按钮,关闭手机APP,返回到钱钱
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            utils.closeApp();
        });


        //绑定下一步(我知道了)
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn .next"), function () {
            var text = getEvent(".fix_bot .ct_btn .next").html();
            if ("我知道了" == text) {
                if (appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app") {
                    //backUrl != null && backUrl != "" && backUrl != "undefined"
                    if (!backUrl) {
                        appUtils.pageInit("account/openAccount", backUrl);
                    } else {
                        appUtils.pageInit("account/openAccount", "account/selDepartment");
                    }
                } else {
                    appUtils.pageInit("account/openAccount", "account/phoneNumberVerify", {backUrl: backUrl});
                }
            } else {
                utils.closeApp();
            }
        });

        //非交易时间弹框关闭
        appUtils.bindEvent(getEvent(".close"), function () {
            //隐藏弹框
            getEvent(".sjkh-vacation").hide();
        });
    }

    function destroy() {
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