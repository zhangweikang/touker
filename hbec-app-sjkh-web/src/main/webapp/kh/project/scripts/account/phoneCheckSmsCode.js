/**
 * Created by Administrator on 2016/12/16.
 */
define("project/scripts/account/phoneCheckSmsCode", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var $ = require('jquery');
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"), // 弹出层对象
        utils = require("utils"),
        source = require("gconfig").platform,
        validatorUtil = require("validatorUtil"),
        startCountDown = null,
        checkSmsPage = require("checkSmsPage"),
        backUrl = "",
        ip = "",
        mac = "",
        phoneNum = "",
        isToukerRegister = "true",
        _pageId = "#account_phoneCheckSmsCode";
    /* 私有业务模块的全局变量 end */
    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        getEvent("#inputPassword").val("");
        getEvent(".mobileCode").val("");  // 清除验证码
        isToukerRegister = appUtils.getSStorageInfo("isToukerRegister");
        if (isToukerRegister == "false") {
            getEvent("#password").show();
            getEvent("#protocol").show();
            getEvent(".fix_bot .top_title").show();
        } else {
            getEvent("#password").hide();
            getEvent("#protocol").hide();
            getEvent(".fix_bot .top_title").hide();
        }

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

        // 预绑定查看协议的事件
        appUtils.bindEvent(getEvent(".protocol"),function(){
            appUtils.pageInit("account/phoneToukerRegister","account/toukerSignProtocol",{});
        });


        /* 下一步(继续开户) */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            var smsCode = getEvent(".mobileCode").val();
            var reg = /^[0-9]{6}$/;
            if (!reg.test(smsCode)) {
                layerUtils.iMsg(-1, "请输入正确的验证码！");
                return;
            }

            if (isToukerRegister == "false") {
                var reg1 = /^.{6,20}$/;// 6-20
                var reg2 = /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))/;// 包含大小写字母、数字及标点符号至少包含两种
                var reg3 = /^[^\s]*$/;// 不能包含空格
                var password = getEvent("#inputPassword").val();
                if (!reg1.test(password)) {
                    layerUtils.iMsg(-1, "密码长度必须6-20位!");
                    return;
                }
                if (!reg2.test(password)) {
                    layerUtils.iMsg(-1, "密码包含大小写字母、数字及标点符号至少包含两种");
                    return;
                }
                if (!reg3.test(password)) {
                    layerUtils.iMsg(-1, "密码不能包含空格!");
                    return;
                }
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
        var khh = appUtils.getSStorageInfo("khh");
        var password = getEvent("#inputPassword").val();
        var paramCheck = {
            "mobileNo": phoneNum,
            "mobileCode": getEvent(".mobileCode").val(),
            "channel": "stock_app",
            "source": source,
            "khh": khh,
            "isToukerRegister": isToukerRegister,
            "password": password,
            "ip": appUtils.getSStorageInfo("ip"),
            "mac": appUtils.getSStorageInfo("mac")
        };

        checkSmsPage.valiDataCustomeInfo(paramCheck, "account/phoneCheckSmsCode");
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

        /*param = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));*/

        service.serviceAjax("/touker/sendSMSCode", param, function (data) {
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
        service.destroy();
    }

    //暴露接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});