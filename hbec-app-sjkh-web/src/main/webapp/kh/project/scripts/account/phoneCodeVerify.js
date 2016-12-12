/**
 * 短信验证码验证
 */
define("project/scripts/account/phoneCodeVerify", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var $ = require('jquery');
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"), // 弹出层对象
        utils = require("utils"),
        validatorUtil = require("validatorUtil"),
        startCountDown = null,
        checkSmsPage = require("checkSmsPage"),
        backUrl = "",
        ip = "",
        mac = "",
        phoneNum = "",
        _pageId = "#account_phoneCodeVerify";
    /* 私有业务模块的全局变量 end */
    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        phoneNum = appUtils.getSStorageInfo("mobileNo");
        backUrl = appUtils.getPageParam("backUrl");
        ip = appUtils.getSStorageInfo("ip");
        mac = appUtils.getSStorageInfo("mac");
        console.log("backUrl=" + backUrl);

        //短信发送时间
        var sendTime = appUtils.getSStorageInfo(phoneNum + "_start");
        //剩余发送时间
        var remainingTime = parseInt((122 * 1000 - (new Date().getTime() - sendTime)) / 1000);
        console.log("sendTime>>>>>:" + sendTime + ";remainingTime>>>" + remainingTime);
        if (sendTime == null || remainingTime <= 0) {
            sendSmsCode(); // 进入页面就开始发送验证码
        } else {
            getEvent(".sendPhoneTip").html("短信已发送至 " + phoneNum);
            console.log("剩余发送时间>>>>>:" + remainingTime);
            startHandleCount(remainingTime);
        }
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            appUtils.pageInit("account/phoneCodeVerify", "account/phoneNumberVerify");
        });

        /* 绑定获取短信验证码事件 */
        appUtils.bindEvent(getEvent(".getmsg"), function () {
            sendSmsCode();
        });


        /* 下一步(继续开户) */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            if (getEvent(".mobileCode").val().length == 0) {
                layerUtils.iMsg(-1, "请输入验证码！");
                return;
            }
            if (isNaN(getEvent(".mobileCode").val())) {
                layerUtils.iMsg(-1, "请输入正确的验证码！");
                return;
            }
            //验证码校验
            checkSmsCode();
        });
    }

    function sendSmsCode() {
        // 首先验证手机号
        if (validatorUtil.isMobile(phoneNum)) {
            sendmsg(phoneNum, mac, ip); // 发送验证码
        } else {
            // 手机号没通过前端校验，弹出提示，并终止发送验证码的过程
            var times = phoneNum.length - 11;
            if (phoneNum.length > 11) {
                layerUtils.iMsg(-1, "您多输入&nbsp;" + times + "&nbsp;位电话号码，请重新输入！");
            } else if (phoneNum.length < 11) {
                layerUtils.iMsg(-1, "您少输入&nbsp;" + Math.abs(times) + "&nbsp;位电话号码，请重新输入！");
            }
        }
    }

    /* 提交验证码校验 */
    function checkSmsCode() {
        console.log("进入 checkSmsCode");

        appUtils.setSStorageInfo("mobileNo", phoneNum);
        var paramCheck = {
            "mobileNo": phoneNum,
            "mobileCode": getEvent(".mobileCode").val()
        };

        var khh = appUtils.getSStorageInfo("khh");
        console.log("mobile_no=" + phoneNum + " khh=" + khh);
        //思迪校验
        service.checkSmsCode(paramCheck, function (data) {
            console.log("入参:" + JSON.stringify(paramCheck) + "出参:" + JSON.stringify(data));
            var error_no = data.error_no;
            var result = data.results;
            if (error_no == "0" && result.length != 0) {
                appUtils.setSStorageInfo("smsCodeVail", "true");
                console.log("思迪调用完成");
                checkSmsPage.setSessionStorage(result[0]);
                //华宝客户信息校验、关联
                var param = {
                    "step": "validateCustInfo",
                    "channel": "stock_app",
                    "mobileNo": phoneNum,
                    "khh": khh
                };

                checkSmsPage.valiDataCustomeInfo(result[0], param, "account/phoneCodeVerify");
            } else {
                layerUtils.iMsg(-1, "请输入正确的短信验证码！");
            }
        });
    }


    /* 发送验证码 */
    function sendmsg(phoneNum, mac, ip) {
        var param = {
            "step": "getSmsCode",
            "mobileNo": phoneNum,
            "op_way": iBrowser.pc ? 0 : 3,// 访问接口来源标识，访问来源(默认PC) 0：pc， 2：pad， 3：手机
            "ip": ip,
            "mac": mac
        };

        /*var returnData = "";
         if (utils.isAndroid()) {
         returnData = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));
         toukerServerPluginCallback(returnData);
         } else {
         require("shellPlugin").callShellMethod("toukerServerPlugin", function (rtnparam) {
         toukerServerPluginCallback(rtnparam);
         }, function (data) {
         }, {"command": "requestUrlParamsEncoding", "params": utils.jsonToParams(param)});
         }*/
        toukerServerPluginCallback(param);
        function toukerServerPluginCallback(returnData) {
            service.serviceAjax("/touker/sendSMSCode", returnData, function (data) {
                getEvent(".sendPhoneTip").html("短信已发送至 " + phoneNum);

                var code = data.status;

                if ("000000" == code) {
                    appUtils.setSStorageInfo(phoneNum + "_start", new Date().getTime());
                    startHandleCount(120);
                } else {
                    layerUtils.iMsg(-1, data.msg);
                }
            });
        }
    }

    /**
     * 通过计时器来处理验证码倒计时
     * @param sumTime 计时器
     */
    function startHandleCount(sumTime) {
        if (startCountDown != null) {
            window.clearInterval(startCountDown);
        }
        var temp_sumTime = sumTime;
        var handleCount = function () {
            getEvent(".getmsg").hide();
            getEvent(".time").show();
            getEvent(".time").text(sumTime-- + "秒后重发");
            appUtils.setSStorageInfo(phoneNum, sumTime);
            if (sumTime <= 0) {
                getEvent(".getmsg").show();
                getEvent(".time").hide();
                getEvent(".time").text(temp_sumTime);
                window.clearInterval(startCountDown);
            }
        };
        handleCount();
        startCountDown = window.setInterval(function () {
            handleCount();
        }, 1000);
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    function destroy() {
        if (startCountDown != null) {
            window.clearInterval(startCountDown);
        }
        if (backUrl == "account/phoneCodeVerify") {
            getEvent(" .getmsg").show();  // 显示按钮
            getEvent(" .time").hide();  // 隐藏倒计时
            getEvent(" .mobileCode").val("请输入验证码").css({color: "#E3E3E3"});  // 清除验证码
        }
        service.destroy();
    }

    //暴露接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});