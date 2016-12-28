/**
 * 手机号码验证
 */
define("project/scripts/account/phoneNumberVerify", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var $ = require('jquery');
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"), // 弹出层对象
        utils = require("utils"),
        validatorUtil = require("validatorUtil"),
        _pageId = "#account_phoneNumberVerify",
        backUrl = "";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        if (appUtils.getSStorageInfo("mobileNo") == "") {
            getEvent(".phoneNum").val("");
        } else {
            getEvent(".phoneNum").val(appUtils.getSStorageInfo("mobileNo"));
        }

        console.log("sumTimeRegistered" + appUtils.getSStorageInfo("mobileNo") + "sumTime_unregistered_key get:" + appUtils.getSStorageInfo("sumTimeRegistered" + appUtils.getSStorageInfo("mobileNo")));
        backUrl = appUtils.getPageParam("backUrl");
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent($(_pageId + " .header .icon_back"), function () {
            appUtils.pageInit("account/phoneNumberVerify", "account/openAccount", {backUrl: backUrl});
        });

        /* 限制手机号在IOS上的长度 */
        appUtils.bindEvent($(_pageId + " .phoneNum"), function () {
            utils.dealIPhoneMaxLength(this, 11); //处理iphone兼容
        }, "input");


        /* 下一步(继续开户) */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            var mobileNo = getEvent(".phoneNum").val();
            var telReg = /^(1\d{10})$/;
            //如果手机号码不能通过验证
            if (!telReg.test(mobileNo)) {
                layerUtils.iMsg(-1, "请输入正确格式的手机号！");
                return;
            }

            //如果用户回退到输入手机号页面,用户未修改手机号码,并且短信验证通过,直接进入
            if (appUtils.getSStorageInfo("smsCodeVail") == "true" && mobileNo == appUtils.getSStorageInfo("mobileNo")) {
                if (backUrl != null && backUrl != "" && backUrl != "undefined") {
                    appUtils.pageInit("account/phoneNumberVerify", backUrl);
                    return;
                }
                appUtils.pageInit("account/phoneNumberVerify", "account/selDepartment");
                return;
            } else {
                //用户更换手机则清除缓存
                appUtils.clearSStorage();
                //设置新开户标示
                appUtils.setSStorageInfo("openChannel", "new");
            }

            //获取用户当前网络请求,ip,mac
            utils.getIp();
            appUtils.setSStorageInfo("mobileNo",mobileNo);

            var param = {
                "mobileNo": mobileNo
            };

            /*param = utils.getParams(param);*/
            toukerServerPluginCallback(param);
            function toukerServerPluginCallback(returnData) {
                service.serviceAjax("/touker/isToukerUser",returnData,function(data){
                    var code = data.status;//001011, 未注册;001012,已注册
                    if (code == "001011") {
                        appUtils.setSStorageInfo("isToukerRegister","false");
                        //appUtils.pageInit("account/phoneNumberVerify", "account/phoneToukerRegister");
                        appUtils.pageInit("account/phoneNumberVerify", "account/phoneCheckSmsCode");
                    } else if (code == "001012") {
                        appUtils.setSStorageInfo("isToukerRegister","true");
                        var customerId = data.data.customerId;
                        if (customerId) {
                            appUtils.setSStorageInfo("khh", customerId);//将客户号号加入到缓存中
                        }
                        //appUtils.pageInit("account/phoneNumberVerify", "account/phoneCodeVerify");
                        appUtils.pageInit("account/phoneNumberVerify", "account/phoneCheckSmsCode");
                    } else {
                        layerUtils.iMsg(-1, data.msg);
                    }
                });
            }
        });
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    function destroy() {
        service.destroy();
    }

    //暴露接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});