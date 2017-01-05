/**
 * 风险测评结果
 */
define("project/scripts/account/riskAssessmentResult", function (require, exports, module) {
    var appUtils = require("appUtils"),
        global = require("gconfig").global,
        utils = require("utils"),
        _pageId = "#account_riskAssessmentResult";

    function init() {
        //加载样式
        $(_pageId).height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        //设置按钮显示提示文字
        getEvent(".fix_bot .ct_btn a").html("下一步");  // 新开户
        // 只有从 riskAssessment 跳转过来时，才设置页面的填充数据
        if (appUtils.getSStorageInfo("_prePageCode") == "account/riskAssessment") {
            var remark = appUtils.getPageParam("remark");  //风险等级
            var riskdesc = appUtils.getPageParam("riskdesc"); //风险等级描述
            var showStr = riskdesc;
            // 清空原有内容
            getEvent("div[class='test_level']").text("");
            getEvent("div[class='test_level']").append(showStr);
        }
    }

    function bindPageEvent() {
        //绑定返回事件
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            appUtils.pageInit("account/riskAssessmentResult", "account/riskAssessment", {});
        });

        // 重新测评绑定事件
        appUtils.bindEvent(getEvent(".ct_btn02"), function () {
            appUtils.pageInit("account/riskAssessmentResult", "account/riskAssessment", {});
        });

        /**
         * 9.1
         * 风险测评结果页面进入问卷回访页面
         */
        appUtils.bindEvent(getEvent(".ct_btn"), function () {
            if (global.needConfirm) {
                appUtils.pageInit("account/riskAssessmentResult", "account/openConfirm", {});
            } else {
                appUtils.pageInit("account/riskAssessmentResult", "account/accountSuccess", {});
            }
        });
    }

    function destroy() {
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