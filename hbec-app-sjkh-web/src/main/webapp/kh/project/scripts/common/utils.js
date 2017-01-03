/**
 * 通用工具类，将项目中的公用方法抽出来
 */
define(function (require, exports, module) {
    var appUtils = require("appUtils"),
        validatorUtil = require("validatorUtil"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        gconfig = require("gconfig");

    /**
     * 下载证书
     * @param callback 证书下载安装之后回调处理
     */
    function installCertificate(callback) {
        // 下载证书，创建10位随机数
        var createKeyRandom = "1";
        for (var i = 0; i < 9; i++) {
            createKeyRandom += parseInt(Math.random() * 10) + "";
        }
        // 证书申请串，数据来源于壳子
        var pkcs10 = "",
            createKeyParam = {
                "rodam": createKeyRandom,
                "userId": appUtils.getSStorageInfo("user_id"),
                "key": "stockDelegateTradeSys"
            };

        // 调用壳子的方法生成证书申请串
        if (isAndroid()) {
            var data = khmobile.createKey(JSON.stringify(createKeyParam));
            if ("" == data)
                handleTimeout(callback);
            else
                createKeyPluginCallback(data);
        } else {
            require("shellPlugin").callShellMethod("createKeyPlugin", function (data) {
                createKeyPluginCallback(data.pkcs10);
            }, function () {
                handleTimeout(callback);
            }, createKeyParam);
        }
        function createKeyPluginCallback(data) {
            pkcs10 = data;
            var param = {
                "user_id": appUtils.getSStorageInfo("user_id"),
                "pkcs10": pkcs10
            };
            // 新开调用中登证书
            var cert_type = "zd";
            service.queryCompyCart(param, function (data) {
                callcert(data, cert_type, callback)
            }, false, true, function () {
                handleTimeout(callback)
            });
        }
    }


    /* 处理请求超时 */
    function handleTimeout(callback) {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            installCertificate(callback);  // 再次下载证书
        });
    }

    /**
     * 安装证书回调方法
     * @param callback 证书下载安装之后回调处理
     * @param data
     * @param cert_type
     */
    function callcert(data, cert_type, callback) {
        var error_no = data.error_no;
        var error_info = data.error_info;
        if (error_no == "0") {
            // 获取证书的内容
            var certParam = {
                "content": data.results[0].p7cert,
                "userId": appUtils.getSStorageInfo("user_id"),
                "type": cert_type
            };
            // 壳子读取证书，然后安装证书
            if (isAndroid()) {
                var data = khmobile.initZs(JSON.stringify(certParam));
                if (data == "OK") {
                    callback();
                }
            } else {
                require("shellPlugin").callShellMethod("initZsPlugin", function (data) {
                    if (data == "OK") {
                        try {
                            callback();
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                }, null, certParam);
            }
        }
        else {
            layerUtils.iLoading(false);
            layerUtils.iAlert(error_info, -1);
        }
    }

    /**
     * 自定义确认框
     * @param layerMsg 确认框的内容
     * @param oneText 第一个按钮按钮的文本内容
     * @param twoText 第二个按钮的文本内容
     * @param funcOne 第一个按钮的回调函数
     * @param funcTwo 第二个按钮的回调函数
     */
    function layerTwoButton(layerMsg, oneText, twoText, funcOne, funcTwo) {
        var viewContent = '<div class="pop_tip notice" id="utils_confirm"><span class="icon"></span><p>' + layerMsg + '</p><div class="btn"><a href="javascript:void(0);" id="utils_confirm_one">' + oneText + '</a><a href="javascript:void(0);" id="utils_confirm_two">' + twoText + '</a></div></div>';
        var iConfirm = layerUtils.layerCustom(viewContent);
        appUtils.preBindEvent($("#utils_confirm"), " #utils_confirm_one", function () {
            if (funcOne) {
                funcOne();
            }
            layerUtils.iCustomClose();
        });
        appUtils.preBindEvent($("#utils_confirm"), " #utils_confirm_two", function () {
            if (funcTwo) {
                funcTwo();
            }
            layerUtils.iCustomClose();
        });
    }

    /**
     * 通过壳子调用系统日期控件
     * @param obj dom 对象，一般传 this 即可
     */
    function selectDate(obj) {
        var currentDateStr = $(obj).val(),
            yearParam = "",
            monthParam = "",
            dayParam = "";
        currentDateStr = currentDateStr.replace(/-/g, "/");
        // 如果是有效的日期串，解析年、月、日
        if (validatorUtil.isDate(currentDateStr))    // 如果是有效的日期串，解析年、月、日
        {
            var tempDate = new Date(currentDateStr);
            yearParam = tempDate.getFullYear() + "";
            // 0~11 的值
            monthParam = (tempDate.getMonth() + 1 + "").length == 1 ? "0" + (tempDate.getMonth() + 1) : (tempDate.getMonth() + 1) + "";
            // 1~31 的值
            dayParam = (tempDate.getDate() + "").length == 1 ? "0" + tempDate.getDate() : tempDate.getDate() + "";
        }
        var calendarParam = {
            "selector": $(obj).attr("id"),
            "year": yearParam,
            "month": monthParam,
            "day": dayParam
        };
        if (yearParam == "NaN")   // 解析失败
        {
            calendarParam.year = "";
            calendarParam.month = "";
            calendarParam.day = "";
        }
        require("shellPlugin").callShellMethod("calendarPlugin", null, null, calendarParam);
    }

    /**
     * 以 放大镜 的形式显示数字，如：电话号码、银行卡号
     * @param obj 要处理的 dom 对象，一般传 this
     * @param type 1 手机号码，2 银行卡
     * @param color 颜色值
     */
    function showBigNo(obj, type, color) {
        var showStr = $(obj).find("em").html();
        var originalStr = showStr.replace(/\s+/g, "");
        var styleStr = "background-color:#FFFFFF; color:#000000; border:1px solid " + color + ";line-height:35px;" +
            "font-size:20px;padding:0px 5px;font-weight:bold;";
        if (type == 1) {
            if (originalStr.length > 3 && originalStr.length <= 7) {
                showStr = originalStr.substring(0, 3) + " " + originalStr.substring(3, 7);
            }
            else if (originalStr.length > 7 && originalStr.length <= 11) {
                showStr = originalStr.substring(0, 3) + " " + originalStr.substring(3, 7) + " " + originalStr.substring(7, 11);
            }
            if (gconfig.platform == 0)  // 浏览器
            {
                styleStr += "width:145px;";
            }
            else if (gconfig.platform == 1)  // android
            {
                styleStr += "width:133px;";
            }
            else   // ios
            {
                styleStr += "width:143px;";
            }
        }
        else if (type == 2) {
            if (originalStr.length > 4 && originalStr.length <= 8) {
                showStr = originalStr.substring(0, 4) + " " + originalStr.substring(4, 8);
            }
            else if (originalStr.length > 8 && originalStr.length <= 12) {
                showStr = originalStr.substring(0, 4) + " " + originalStr.substring(4, 8) + " " + originalStr.substring(8, 12);
            }
            else if (originalStr.length > 12 && originalStr.length <= 16) {
                showStr = originalStr.substring(0, 4) + " " + originalStr.substring(4, 8) + " " + originalStr.substring(8, 12) +
                    " " + originalStr.substring(12, 16);
            }
            else if (originalStr.length > 16 && originalStr.length <= 19) {
                showStr = originalStr.substring(0, 4) + " " + originalStr.substring(4, 8) + " " + originalStr.substring(8, 12) +
                    " " + originalStr.substring(12, 16) + " " + originalStr.substring(16);
            }
            else if (originalStr.length > 19 && originalStr.length <= 21) {
                showStr = originalStr.substring(0, 4) + " " + originalStr.substring(4, 8) + " " + originalStr.substring(8, 12) +
                    " " + originalStr.substring(12, 16) + " " + originalStr.substring(16, 20) + " " + originalStr.substring(20);
            }
            if (originalStr.length <= 16) {
                if (gconfig.platform == 0)  // 浏览器
                {
                    styleStr += "width:212px;";
                }
                else if (gconfig.platform == 1)  // 安卓手机
                {
                    styleStr += "width:188px;";
                }
                else   // ios
                {
                    styleStr += "width:198px;";
                }
            }
            else {
                if (gconfig.platform == 0)  // 浏览器
                {
                    styleStr += "width:253px;";
                }
                else if (gconfig.platform == 1)  // 安卓手机
                {
                    styleStr += "width:225px;";
                }
                else   // ios
                {
                    styleStr += "width:235px;";
                }
            }
        }
        var tipsIndex = $.layer({
            type: 4,
            closeBtn: false,
            shade: false,
            shadeClose: false,
            fix: true,
            title: false,
            area: ['auto', 'auto'],
            border: [10, 0.3, '#000', true],
            zIndex: 19930902,
            tips: {
                msg: showStr,
                follow: obj,
                guide: 0,
                isGuide: true,
                style: [styleStr, '#D83005']
            }
        });
        var widthDifference = ($(".xubox_tips").offset().left + $(".xubox_tips").width()) - $(window).width();
        if (widthDifference > 0) {
            $(".xubox_tips").css("margin-left", "-" + (widthDifference + 10) + "px");
            $(".xubox_tips").find("i").css("margin-left", (widthDifference + 10) + "px");
        }
        if (originalStr == "" && tipsIndex) {
            layer.close(tipsIndex);
        }
        appUtils.bindEvent($(obj), function () {
            if (tipsIndex) {
                layer.close(tipsIndex);
            }
        }, "blur");
    }

    /**
     * 处理 iPhone 的兼容性
     * @param obj 待处理的 input dom 对象，一般传 this
     * @param maxLength 最大长度
     */
    function dealIPhoneMaxLength(obj, maxLength) {
        var currentStr = $(obj).val();
        if (currentStr.length > maxLength) {
            $(obj).val(currentStr.substring(0, maxLength));
        }
    }

    /**
     * 超时处理
     * @param func 超时处理函数
     * @param isSuccess 请求是否成功
     * gconfig.ajaxTimeout 是配置文件中配置的超时时间
     */
    var catchTimeout = null;

    function listenTimeout(func, isSuccess) {
        if (!isSuccess) {
            if (catchTimeout != null) {
                window.clearInterval(catchTimeout);
                catchTimeout = null;
            }
            catchTimeout = window.setInterval(function () {
                // 关闭加载层
                layerUtils.iLoading(false);
                func();
            }, gconfig.ajaxTimeout * 1000);
        }
        else {
            window.clearTimeout(catchTimeout);
            catchTimeout = null;
        }
    }

    /**
     * 获取手机号并填充
     * elements 输入框名称
     */
    function getPhoneNo(elements) {
        if (isAndroid()) {
            var returnData = khmobile.getPhoneNo();
            getPhoneNoPluginCallback(returnData);
        } else {
            require("shellPlugin").callShellMethod("getPhoneNoPlugin", function (data) {
                getPhoneNoPluginCallback(data);
            }, null, {});
        }
        function getPhoneNoPluginCallback(returnData) {
            var phoneReg = /^[1-9]\d{10}$/;
            // 返回的数据是 +86手机号时，截取
            if (returnData == 14) {
                returnData = returnData.substring(3);
            }
            else if (!phoneReg.test(returnData)) {
                $(elements).val("");
                return;
            }
            $(elements).val(returnData);
            // 将光标移到输入框末尾
            setCursorPosition(elements);
        }
    }


    /**
     * 设置输入框光标的位置
     * obj 需要设置光标位置的 input dom 对象
     * position 光标的位置，默认是输入框的末尾
     */
    function setCursorPosition(obj, position) {
        var text = obj.createTextRange();
        text.collapse(true);
        text.moveStart("character", position ? position : obj.value.length);
        text.select();
    }

    /**
     * 通过壳子调用密码控件
     * @param data 密码值
     * @param ele 元素id
     */
    function getInput(data, ele) {
        $(ele).val(data);  // 填充密码框
    }

    /**
     * 通过壳子关闭密码控件
     */
    function onFinish() {
        $("body").css("padding-bottom", "0").scrollTop(0);
    }

    /**
     * 关闭放大镜
     */
    function closeBigNoTips() {
        var $tips = $("body>div[type='tips']");
        if ($tips.length > 0) {
            $tips.remove();
        }
    }

    function isAndroid() {
        if (navigator.userAgent.indexOf("Android") > 0)
            return true;
        else
            return false;
    }

    /**
     * 把json对象格式转换成urlParams
     */
    function jsonToParams(json) {
        var urlParams = "";
        $.each(json, function (name, value) {
            urlParams += name + "=" + value + "&";
        });
        urlParams = urlParams.substring(0, urlParams.length - 1);
        console.log("urlParams：" + urlParams);
        return urlParams;
    }

    /**
     * 关闭手机开户APP
     */
    function closeApp() {
        //Android
        if (navigator.userAgent.indexOf("Android") > 0) {
            khmobile.closeApp();
        }
        //ios
        if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
            window.location.href = "backClientSide";
        }
    }

    /**
     * 获取用户访问IP,MAC,放到sessionStorage
     */
    function getIp() {
        var stateTime = new Date().getTime();
        /*var param = { "step": "getIp" };
         param = getParams(param);
         */
        service.serviceAjax("/commons/getIp", null, function (data) {
            var endTime = new Date().getTime();
            console.log("获取IP,Mac耗时:" + (endTime - stateTime) + "毫秒");
            var code = data.status;
            //默认值
            var ip = "192.168.1.109";
            var mac = "02:00:5E:00:00:14";

            if (code == "000000") {
                ip = data.data.ip;
                mac = data.data.mac
            }

            appUtils.setSStorageInfo("ip", ip); // 将 ip 保存到 sessionStorage 里面
            appUtils.setSStorageInfo("mac", mac); // 将 mac 保存到 sessionStorage 里面
        });
    }

    /**
     * 安卓IOS参数加密分别处理
     * @param paramCert
     * @returns {*}
     */
    function getParams(paramCert) {
        var params;
        if (isAndroid()) {
            params = khmobile.requestUrlParamsEncoding(jsonToParams(paramCert));
        } else {
            require("shellPlugin").callShellMethod("toukerServerPlugin", function (paramCert) {
                params = paramCert;
            }, function (data) {
            }, {"command": "requestUrlParamsEncoding", "params": jsonToParams(paramCert)});
        }
        return params;
    }

    /**
     * 创建一个随机生成的10位数
     * @returns {string}
     */
    function randomKey(){
        var randomKey = "1";
        for (var i = 0; i < 9; i++) {
            randomKey += parseInt(Math.random() * 10) + "";
        }
        return randomKey;
    }

    module.exports = {
        "installCertificate": installCertificate,
        "layerTwoButton": layerTwoButton,
        "selectDate": selectDate,
        "showBigNo": showBigNo,
        "dealIPhoneMaxLength": dealIPhoneMaxLength,
        "setCursorPosition": setCursorPosition,
        "getPhoneNo": getPhoneNo,
        "getInput": getInput,
        "onFinish": onFinish,
        "closeBigNoTips": closeBigNoTips,
        "jsonToParams": jsonToParams,
        "isAndroid": isAndroid,
        "closeApp": closeApp,
        "getIp": getIp,
        "getParams": getParams,
        "randomKey": randomKey
    };
});