/**
 * 获取三方存管可绑卡银行卡列表
 * Created by zhangweikang on 2016/7/21.
 */
define("project/scripts/account/bankList", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var $ = jQuery = require('jquery');
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        _pageId = "#account_bankList",
        banklist = getEvent(".bank-list"),
        backUrl = "";

    //初始加载方法
    function init() {
        //清空列表元素
        banklist.html("");
        backUrl = appUtils.getPageParam("backUrl");
        //获取银行列表
        getBankList();
    }

    //事件绑定
    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".top-info .i-back"), function () {
            appUtils.pageInit("account/bankList", backUrl, {});
        });
    }

    //页面销毁调用方法
    function destroy() {
        service.destroy();
    }

    /* 获取存管银行列表 */
    function getBankList() {
        var queryParam = {"bindtype": "", "ispwd": ""};
        service.queryBankList(queryParam, function (data) {
            var errorNo = data.error_no;
            var errorInfo = data.error_info;
            if (errorNo == 0 && data.results.length != 0) {
                var results = data.results;
                var length = results.length;
                for (var i = 0; i < length; i++) {
                    var item = results[i],
                        bankcode = item.bankcode,// 银行代码
                        bankname = item.bankname,// 银行名称
                        isCard = item.iscard;//是否需要输入银行卡号

                    var div_bank_item = $("<div class='bank-item no-recommend'  id='" + bankcode + "' isCard='" + isCard + "' openFlag='" + item.open_flag + "'></div>");
                    var div_bank_image = $("<div class='i-bank " + bankcode + "'></div>");
                    var div_bank_type = $("<div class='type'></div>");
                    var div_bank_name = $("<div class='name'>" + bankname + "</div>")
                    var div_bank_info = $("<div class='info'>需要前往银行营业厅办理<span>（不推荐）</span></div>");

                    div_bank_type.append(div_bank_name);
                    if (isCard == "0" && "1" != item.open_flag) {
                        div_bank_type.append(div_bank_info);
                    }
                    div_bank_item.append(div_bank_image).append(div_bank_type);
                    if (isCard == "0") {
                        banklist.append(div_bank_item);
                    } else {
                        banklist.prepend(div_bank_item);
                    }
                }
                // 选择银行添加银行事件
                appUtils.bindEvent(getEvent(".bank-item"), function () {
                    var $target = $(this);
                    getEvent(".bank-item").removeClass('selected');
                    $target.addClass('selected');
                    appUtils.setSStorageInfo("bankCode", $target.attr("id"));
                    var storageIsCard = $target.attr("isCard");
                    if ("1" == $target.attr("openFlag")) storageIsCard = "";
                    appUtils.setSStorageInfo($target.attr("id") + "isCard", storageIsCard);

                    appUtils.pageInit("account/bankList", backUrl, {});
                });
            }
            else {
                layerUtils.iAlert(errorInfo, -1);
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            getBankList();  // 再次获取银行列表
        });
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    //暴露接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});