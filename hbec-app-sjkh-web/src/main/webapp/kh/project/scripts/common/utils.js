/**
 * 通用工具类，将项目中的公用方法抽出来
 */
define(function (require, exports, module) {
    var appUtils = require("appUtils"),
        validatorUtil = require("validatorUtil"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        Map = require("map"),
        gconfig = require("gconfig"),
        cert_type = "zd";

    /**
     * 下载证书
     * @param successCallBack 成功回调
     * @param errorCallBack 失败回调
     * @param isLoading 是否开启等待层
     */
    function installCertificate (successCallBack,errorCallBack,isLoading){
        var createKeyParam = {
                "rodam": randomKey(),
                "userId": appUtils.getSStorageInfo("userId"),
                "key": "stockDelegateTradeSys"
            };
        // 调用壳子的方法生成证书申请串
        var createKeyParam = khmobile.createKey(JSON.stringify(createKeyParam));

        createKeyParam ? createKeyPluginCallback(createKeyParam) : handleTimeout(successCallBack,errorCallBack);

        function createKeyPluginCallback(data) {
            var param = {
                "user_id": appUtils.getSStorageInfo("userId"),
                "pkcs10": data
            };
            // 新开调用中登证书
            service.queryCompyCart(param, function (data) {
                callcert(data, successCallBack,errorCallBack)
            }, false, isLoading, function () {
                handleTimeout(successCallBack,errorCallBack)
            });
        }
    }

    /**
     * 证书下载成功后执行方法
     * @param data
     * @param successCallBack
     * @param errorCallBack
     */
    function callcert(data, successCallBack,errorCallBack) {
        layerUtils.iLoading(false);
        var error_no = data.error_no;
        var error_info = data.error_info;
        if (error_no == "0") {
            // 获取证书的内容
            var certParam = {
                "content": data.results[0].p7cert,
                "userId": appUtils.getSStorageInfo("userId"),
                "type": cert_type
            };
            // 壳子读取证书，然后安装证书
            var data = khmobile.initZs(JSON.stringify(certParam));
            if (data == "OK") {
                successCallBack();
            } else {
                if (!errorCallBack){
                    errorCallBack();
                }
            }
        }
        else {
            layerUtils.iAlert(error_info, -1);
        }
    }

    /**
     * 证书下载请求超时方法
     * @param successCallBack
     * @param errorCallBack
     */
    function handleTimeout(successCallBack,errorCallBack) {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            installCertificate(successCallBack,errorCallBack);  // 再次下载证书
        });
    }

    /**
     * 检验证书是否存在
     * @param successCallBack 证书存在回调
     * @param errorCallBack 证书不存在回调
     * @param isLoading 是否开始等待层
     */
    function chechCertificate(successCallBack,errorCallBack,isLoading){
        var param = {
            "userId": appUtils.getSStorageInfo("userId"),
            "mediaid": "certificate",
            "type": cert_type
        };

        var returnData = khmobile.fileIsExists(JSON.stringify(param));
        layerUtils.iLoading(false);  // 关闭等待层。。。
        // 如果未检测到本地有证书，就安装证书
        returnData ? successCallBack() : installCertificate(successCallBack,errorCallBack?errorCallBack:null,isLoading?isLoading:true);
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
        var returnData = khmobile.getPhoneNo();
        var phoneReg = /^[1-9]\d{10}$/;
        // 返回的数据是 +86手机号时，截取
        if (returnData == 14) {
            returnData = returnData.substring(3);
        } else if (!phoneReg.test(returnData)) {
            $(elements).val("");
            return;
        }
        $(elements).val(returnData);
        // 将光标移到输入框末尾
        setCursorPosition(elements);
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
        if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent) && '1'==global.openChannel) {
            window.location.href = "backClientSide";
        }
    }

    /**
     * 获取用户访问IP,MAC,放到sessionStorage
     */
    function getIp() {
        var stateTime = new Date().getTime();
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

    /**
     * 获取题目集合Map
     * @param results 后端查询结果集
     * @returns {*} map
     */
    function getTitle(results){
        var fristMap = new Map();
        // 先遍历结果集
        for (var i = 0; i < results.length; i++) {
            var oneEle = results[i];
            var queid = oneEle.que_id;  // que_id	题目编号
            var type = oneEle.type;  // type	问题类型（0：单选，1：多选）
            var qname = oneEle.q_name;  // q_name	题目描述
            var str = type + "-" + queid + "-" + qname;
            var secondMap = null;
            if (!fristMap.containsKey(str)) {
                // 若map中没有对应的问题号，则存入问题号
                secondMap = new Map();
                secondMap.put(oneEle.ans_id, oneEle);
                fristMap.put(str, secondMap);	  // fristMap每一个Key对应一个问题
            } else {
                fristMap.get(str).put(oneEle.ans_id, oneEle);
            }
        }

        return fristMap;
    }

    /**
     * 优化图片数据,返回正确base64
     * @param imgState
     * @return
     */
    function fmtImgData(imgState) {
        imgState.replaceAll("\\n", "");
        imgState.replaceAll("\\u003d", "==");
        return imgState;
    }

    /**
     * 驳回跳转
     * @param boHuiCode 驳回步骤
     * @param codePage 当前页面
     * @param sessionKey session中的Key
     */
    function boHuiRedirect(boHuiCode,codePage,sessionKey){

        var notifyParam = {
            "userid": appUtils.getSStorageInfo("userId"),
            "fieldname": boHuiCode  // 通知图片已补全
        };
        service.rejectStep(notifyParam, function (data) {
            if (data.error_no == 0) {
                if (sessionKey) {
                    appUtils.clearSStorage(sessionKey);
                }
                var url = getRedirectUrl();
                appUtils.pageInit(codePage, url);
            }
        });
    }

    function getRedirectUrl(){
        var backVideo = appUtils.getSStorageInfo("backVideo");
        var backAccount = appUtils.getSStorageInfo("backAccount");
        var backPwd = appUtils.getSStorageInfo("backPwd");
        var backThird = appUtils.getSStorageInfo("backThird");

        //视频见证驳回跳转
        if (backVideo){
            return "account/videoNotice";
        }

        //交易密码驳回跳转
        if (backPwd) {
            return "account/setPwd";
        }

        //选择开户驳回跳转
        if (backAccount) {
            return "account/signProtocol";
        }


        //三方存管驳回跳转
        if (backThird) {
            return "account/thirdDepository";
        }

        return "account/accountSuccess";
    }

    function backpage(backUrl) {
        //当前页面id
        var curPageCode = appUtils.getSStorageInfo("_curPageCode");
        //前一个页面的id
        var prePageCode = appUtils.getSStorageInfo("_prePageCode");

        appUtils.pageInit(curPageCode,prePageCode,{backUrl:backUrl});
    }

    module.exports = {
        "installCertificate": installCertificate,
        "chechCertificate": chechCertificate,
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
        "randomKey": randomKey,
        "getTitle": getTitle,
        "fmtImgData":fmtImgData,
        "boHuiRedirect": boHuiRedirect,
        "getRedirectUrl": getRedirectUrl,
        "backPage": backpage
    };
});