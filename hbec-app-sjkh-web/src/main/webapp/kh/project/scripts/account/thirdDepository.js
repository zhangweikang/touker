/**
 * 三方存管
 */
define("project/scripts/account/thirdDepository", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        gconfig = require("gconfig"),
        global = gconfig.global,
        openChannel = global.openChannel,
        service = require("serviceImp").getInstance(),  // 业务层接口，请求数据
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        validatorUtil = require("validatorUtil"),
        zzispwd = 1,// zzispwd	密码方式，1 需要,"" 不需要
        iscard = "",// iscard	是否需要银行卡，0 不需要,"" 需要
        keyTelPanel = require("keyTelPanel"),
        protocol = null,  // 协议保存
        cert_type = "zd",
        open_flag = "",
        _pageId = "#account_thirdDepository";
    /* 私有业务模块的全局变量 end */

    function init() {
        layerUtils.iLoading(true);  // 开启等待层。。。
        //修改钱钱炒股或者证券开户部分提示信息内容样式
        if (openChannel == "1") {
            getEvent(".user_form p").css("color", "#4883F6");
            getEvent(".l_link").css("color", "#4883F6");
        }

        //加载样式
        getEvent(".input_custom").click(function () {
            $(this).addClass("active");
        });
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        clearCssStyle();//初始化页面样式
        utils.chechCertificate(bankInfo, null, true);
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            appUtils.setSStorageInfo("backThirdDepository", 3);
            var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
            if (tpbankFlg == "1" || tpbankFlg == "2") {
                appUtils.pageInit("account/thirdDepository", "account/signProtocol", {});
            } else {
                appUtils.pageInit("account/thirdDepository", "account/setPwd", {});
            }
        });

        /* 签署银行相关协议  */
        appUtils.bindEvent(getEvent(".rule_check01 a"), function () {
            $(this).toggleClass("checked");
        });

        /* 选择银行绑定下拉框按钮事件  */
        appUtils.bindEvent(getEvent("#selectBank"), function () {
            //跳转银行卡列表页面
            appUtils.pageInit("account/thirdDepository", "account/bankList", {backUrl:"account/thirdDepository"});
        });

        /* 点击页面关闭键盘 */
        appUtils.bindEvent($(_pageId), function (e) {
            //监听整个界面
            keyTelPanel.closeKeyPanel();
            $(".input_custom").removeClass("active"); // 移除输入框的焦点
            utils.closeBigNoTips();
            e.stopPropagation();
        });

        /*银行卡号输入*/
        appUtils.bindEvent(getEvent("#input_text_bankcard"), function (e) {
            validateSelectBank(); // 验证是否选择银行卡
            keyTelPanel.closeKeyPanel();//监听整个界面

            var loginPassword_keyboard = $(this);
            if (loginPassword_keyboard.find("em").text() == "请输入银行卡号") {
                loginPassword_keyboard.find("em").html("");//清空
            }

            getEvent(".input_custom").removeClass("active"); // 移除输入框的焦点
            getEvent("#input_text_bankcard .input_custom").addClass("active");
            loginPassword_keyboard.find("em").css({color: "#9F9F9F"});  // 添加输入框的焦点
            keyTelPanel.init_keyPanel(function (value) {
                var curValue = loginPassword_keyboard.find("em").html();  // 账号的值
                if (value == "del") {
                    loginPassword_keyboard.find("em").html(curValue.slice(0, -1));
                }
                else {
                    if (curValue.length < 19) {
                        loginPassword_keyboard.find("em").html(curValue + value);
                    }
                    else {
                        layerUtils.iMsg(-1, "银行卡号最多 19 位!");
                    }
                }
                utils.dealIPhoneMaxLength(getEvent("#input_text_bankcard"), 19); // 处理iphone兼容
                var color = "#C50436";	//证券开户
                if (openChannel == "1") {	//钱钱炒股
                    color = "#4883F6";
                }

                utils.showBigNo(getEvent("#input_text_bankcard_keyboard"), 2, color);  // 调用放大镜插件
            }, loginPassword_keyboard);
            e.stopPropagation();
        });

        /* 银行密码输入框 */
        appUtils.bindEvent(getEvent("#input_text_bankcardPwd"), function (e) {
            validateSelectBank();  // 验证是否选择银行卡
            utils.dealIPhoneMaxLength(this, 6); // 处理iphone兼容
            var loginPassword_keyboard = $(this);
            loginPassword_keyboard.find("em").html("");  // 清空密码
            loginPassword_keyboard.attr("data-password", "");  // 清空密码值
            getEvent(".input_custom").removeClass("active");    // 移除输入框的焦点
            getEvent("#input_text_bankcardPwd .input_custom").addClass("active");
            loginPassword_keyboard.find("em").css({color: "#9F9F9F"});  // 添加输入框的焦点
            keyTelPanel.init_keyPanel(function (value) {
                var curEchoText = loginPassword_keyboard.find("em").html();  // 密码回显文本
                var curPwd = loginPassword_keyboard.attr("data-password") || "";  // 密码值
                if (value == "del") {
                    loginPassword_keyboard.find("em").html(curEchoText.slice(0, -1));
                    loginPassword_keyboard.attr("data-password", curPwd.slice(0, -1));
                }
                else {
                    if (curPwd.length < 6) {
                        loginPassword_keyboard.attr("data-password", curPwd + value);  // 设置密码值
                        loginPassword_keyboard.find("em").html(curEchoText + "*");
                    }
                    else {
                        layerUtils.iMsg(-1, "交易密码最多6位!");
                    }
                }
            }, loginPassword_keyboard);
            e.stopPropagation();  // 阻止冒泡
        });

        /* 开通三方存管按钮绑定事件 */
        appUtils.bindEvent(getEvent(".ct_btn"), function () {
            signProtocol();  // 提交验签，并且提交三方存管信息
        });
    }

    function destroy() {
        service.destroy();
    }

    function bankInfo() {
        //获取sessionStorage中的银行Code
        var bankCode = appUtils.getSStorageInfo("bankCode");
        var queryParam = {"bindtype": "", "ispwd": "", "step": "bankInfo", "bankCode": bankCode};
        if (bankCode == null) {
            return;
        }
        console.log("进入获取银行信息-----bankCode=" + bankCode);
        service.queryBankList(queryParam, function (data) {
            var errorNo = data.error_no;
            var errorInfo = data.error_info;
            if (errorNo == 0 && data.results.length != 0) {
                var bankInfo = data.results[0],
                    banckName = bankInfo.bankname,
                    bankCode = bankInfo.bankcode,
                    signInfo = bankInfo.sign_info,  // 提示信息
                    zzbindtype = bankInfo.zzbindtype;  // 绑定方式
                zzispwd = bankInfo.zzispwd;  // 密码方式
                iscard = bankInfo.iscard;  // 是否需要银行卡号
                open_flag = bankInfo.open_flag;//一步式绑定开关 1:打开
                getEvent("#selectBank").text(banckName);
                getEvent(".protocolshow").show();
                addBankItem(banckName, bankCode, zzbindtype, signInfo, open_flag);
            }
            else {
                layerUtils.iAlert(errorInfo, -1);
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            bankInfo();  // 再次获取银行列表
        });
    }

    /* 为选择银行列表添加选中银行数据 */
    function addBankItem(banckName, id, zzbindtype, signInfo, open_flag) {
        // 显示银行的签约信息
        if (signInfo) {
            getEvent("#signInfo").html("温馨提示: " + signInfo);
        } else {
            getEvent("#signInfo").html("");
        }
        getEvent("#selectBank").html(banckName);  // 赋值银行卡名称
        getEvent("#selectBank").attr("bankcode", id);
        getEvent("#selectBank").attr("zzbindtype", zzbindtype);
        getDepositoryAgreement(id);  // 获取银行协议内容
        if (zzbindtype == 1 || "1" == open_flag)   // 判断一步式
        {
            if (!zzispwd) {
                // 不需要输入密码
                getEvent("#input_text_bankcardPwd").parent().hide();  // 隐藏银行密码输入框
            } else {
                // 需要输入密码
                getEvent("#input_text_bankcardPwd").parent().show();  // 显示银行密码输入框
            }
            getEvent(".user_form .input_form:eq(1)").show();  // 显示银行卡、密码输入框
            getEvent("#bindInfo").hide();  // 隐藏预指定提示信息
        } else if (zzbindtype == 2)  // 判断预指定(二步式)
        {
            if (!iscard) {
                // 需要银行卡
                getEvent(".user_form .input_form:eq(1)").show();  // 显示银行卡
                getEvent(".user_form .input_form:eq(1) .input_text:eq(1)").hide();  // 隐藏密码
            } else {
                // 不需要银行卡
                getEvent(".user_form .input_form:eq(1)").hide();  // 隐藏银行卡、密码输入框
                getEvent("#input_text_bankcard_keyboard").find("em").html("");  // 清空银行卡号值
            }
            getEvent("#bindInfo").show();  // 显示预指定提示信息
        }
        switch (id) {
            case "NYYH":
                getEvent(".l_link").hide();
                getEvent(".l_link.none").show();
                break;
            case "SHYH":
                getEvent(".l_link").hide();
                getEvent(".l_link.none").show();
                break;
            case "GDYH":
                getEvent(".l_link").hide();
                getEvent(".l_link.none").show();
                break;
            case "PFYH":
                getEvent("#tips0").hide();
                getEvent("#tips1").hide();
                getEvent("#tips2").show();
                getEvent("#tips3").hide();
                getEvent("#tips4").hide();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "XYYH":
                getEvent(".l_link").hide();
                getEvent(".l_link.none").show();
                break;
            case "ZXYH":
                getEvent("#tips0").show();
                getEvent("#tips1").show();
                getEvent("#tips2").hide();
                getEvent("#tips3").hide();
                getEvent("#tips4").hide();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "GSYH":
                if ("1" == open_flag)
                    getEvent("#tips0").hide();
                else
                    getEvent("#tips0").show();
                getEvent("#tips1").hide();
                getEvent("#tips2").hide();
                if ("1" == open_flag)
                    getEvent("#tips3").hide();
                else
                    getEvent("#tips3").show();
                getEvent("#tips4").hide();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "GFYH":
                getEvent("#tips0").show();
                getEvent("#tips1").hide();
                getEvent("#tips2").hide();
                getEvent("#tips3").show();
                getEvent("#tips4").hide();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "JSYH":
                getEvent(".l_link").hide();
                getEvent(".l_link.none").show();
                break;
            case "ZSYH":
                getEvent("#tips0").show();
                getEvent("#tips1").hide();
                getEvent("#tips2").hide();
                getEvent("#tips3").hide();
                getEvent("#tips4").hide();
                getEvent("#tips5").show();
                getEvent("#bindInfo").hide();
                break;
            case "JTYH":
                getEvent("#tips0").show();
                getEvent("#tips1").hide();
                getEvent("#tips2").hide();
                getEvent("#tips3").hide();
                getEvent("#tips4").show();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "ZGYH":
                getEvent("#tips0").show();
                getEvent("#tips1").hide();
                getEvent("#tips2").hide();
                getEvent("#tips3").show();
                getEvent("#tips4").hide();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "PAYH":
                getEvent("#tips0").show();
                getEvent("#tips1").hide();
                getEvent("#tips2").hide();
                getEvent("#tips3").hide();
                getEvent("#tips4").show();
                getEvent("#tips5").hide();
                getEvent("#bindInfo").hide();
                break;
            case "YCYH":
                getEvent(".l_link").hide();
                getEvent(".l_link.none").show();
                break;
        }
    }

    /* 签署协议 */
    function signProtocol() {
        // 验证是否选择银行
        if (!validateSelectBank()){
            return false;
        }

        //需要输入银行卡
        if (!iscard && !validateBankCorrect()){
            return false;
        }

        //需要输入密码
        if (zzispwd == "1" && !validateBankPwd()){
            return false;
        }
        // 验证是否勾选协议
        if (!validateDepositProtocolSelect()){
            return false;
        }
        // 进行协议签署
        var protocolArray = new Array(),  // 协议数组
            userid = appUtils.getSStorageInfo("userId"),
            ipaddr = appUtils.getSStorageInfo("ip"),
            macaddr = appUtils.getSStorageInfo("mac"),
            protocolid = protocol.econtract_no,
            summary = protocol.econtract_md5,  // 协议内容MD5,签名摘要信息
            signParam = {
                "medid": protocolid,
                "content": summary,
                "userId": userid,
                "type": cert_type
            };
        layerUtils.iLoading(true);  // 开启等待层......
        // 获取协议的数字签名值

        var returnData = "";
        if (utils.isAndroid()) {
            returnData = khmobile.sign(JSON.stringify(signParam));
            if (!returnData)
                layerUtils.iLoading(false);
            else
                signPluginCallback(returnData);
        } else {
            require("shellPlugin").callShellMethod("signPlugin", function (data) {
                signPluginCallback(data.ciphertext);
            }, function () {
                layerUtils.iLoading(false);
            }, signParam);
        }
        function signPluginCallback(data) {
            var protocolParam = {
                "protocol_id": protocolid,
                "protocol_dcsign": data,
                "summary": summary
            };
            protocolArray.push(protocolParam);   // 添加值到数组中
            // 签署协议
            var signProtocolParam = {
                "user_id": userid,
                "jsondata": JSON.stringify(protocolArray),
                "ipaddr": ipaddr,
                "macaddr": macaddr
            };
            // 新开中登验签
            service.queryOpenCheckSign(signProtocolParam, callSign, false);
        }
    }


    /* 验签回调函数*/
    function callSign(data) {
        // 如果有一个协议签署失败，就将签署结果设为 false
        if (data.error_no == 0) {
            postThirdDepositoryData();	//开立账户系统客户号和资金账户
        }
        else {
            layerUtils.iLoading(false);  // 关闭等待层。。。
            layerUtils.iAlert(data.error_info, -1);
        }
    }

    /* 提交三方存管银行数据 */
    function postThirdDepositoryData() {
        service.getRSAKey({}, function (data) {
            if (data.error_no == 0)	//请求获取rsa公钥成功
            {
                //密码采用rsa加密
                var results = data.results[0];
                var modulus = results.modulus;
                var publicExponent = results.publicExponent;
                var endecryptUtils = require("endecryptUtils");

                var bankpwd = endecryptUtils.rsaEncrypt(modulus, publicExponent, getEvent("#input_text_bankcardPwd").attr("data-password"));
                var userid = appUtils.getSStorageInfo("userId");
                var bankcode = getEvent("#selectBank").attr("bankcode");
                var bankaccount = "";//银行卡号
                if (getEvent("#input_text_bankcard").find("em").text() == "请输入银行卡号") {
                    bankaccount = "";
                } else {
                    bankaccount = getEvent("#input_text_bankcard").find("em").text();//银行卡号
                }
                var op_type = getEvent("#selectBank").attr("zzbindtype");
                if ("1" == open_flag) {
                    op_type = "1";
                }
                var thirdDepositParam = {
                    "user_id": userid,
                    "acct_clientid": "",
                    "acct_fndacct": "",
                    "bank_code": bankcode,
                    "bank_account": bankaccount,
                    "bank_pwd": bankpwd,
                    "op_type": op_type
                };
                // 调用service绑定存管银行
                service.bindBank(thirdDepositParam, function (data) {
                    //alert("银行入参:"+JSON.stringify(thirdDepositParam)+",出参:"+JSON.stringfiy(data));
                    var errorNo = data.error_no;
                    var errorInfo = data.error_info;
                    if (errorNo == 0)	 // 调用成功,跳转到风险测评页面
                    {
                        appUtils.pageInit("account/thirdDepository", "account/riskAssessment", {});
                    }
                    else {
                        layerUtils.iLoading(false);
                        layerUtils.iAlert(errorInfo, -1);
                    }
                }, true);
            }
            else {
                layerUtils.iLoading(false);
                layerUtils.iAlert(data.error_info);
            }
        }, false);
    }

    /* 验证是否选择银行  */
    function validateSelectBank() {
        var obj = getEvent("#selectBank");
        var value = obj.html();
        if (validatorUtil.isEmpty(value) || value == "请选择银行") {
            layerUtils.iMsg(-1, "请选择银行");
            return false;
        }
        return true;
    }

    /* 检验银行卡填写是否正确 */
    function validateBankCorrect() {
        var bankcard = getEvent("#input_text_bankcard").find("em").html();
        if (!bankcard)  // 验证通过的情况
        {
            layerUtils.iMsg(-1, "银行卡号不能为空！");
            return false;
        }
        if (!validatorUtil.isBankCode(bankcard)) {
            layerUtils.iMsg(-1, "银行卡号格式有误，请重新输入！");
            return false;
        }
        return true;
    }

    /* 验证银行密码 */
    function validateBankPwd() {
        // 验证不通过
        var cardPwd = getEvent("#input_text_bankcardPwd").attr("data-password");
        if (cardPwd.length == 0) {
            layerUtils.iMsg(-1, "您输入的银行密码为空，请重新输入!");
            return false;
        }
        if (cardPwd.length != 6) {
            layerUtils.iMsg(-1, "请输入6位银行密码，请重新输入!");
            return false;
        }
        if (!validatorUtil.isNumeric(cardPwd)) {
            layerUtils.iMsg(-1, "您输入银行密码有误，请重新输入！");
            return false;
        }
        return true;
    }

    /* 检测勾选阅读协议 */
    function validateDepositProtocolSelect() {
        if (!getEvent(".icon_check").hasClass("checked")) {
            layerUtils.iMsg(-1, "请阅读并勾选三方存管协议!");
            return false;
        }
        return true;
    }

    /* 获取存管银行签约电子协议列表 */
    function getDepositoryAgreement(bankcode) {
        // 调用service查询存管银行协议
        var param = {"econtract_no": bankcode};
        service.queryProtocolList(param, function (data) {
            if (data.error_no == 0) {
                if (data.results && data.results.length >= 1) {
                    protocol = data.results[0];
                    getEvent("#protocolName").html("《" + protocol.econtract_name + "》");
                    getEvent("#protocolName").attr("protocolId", protocol.econtract_no);
                    getEvent("#protocolName").attr("protocolMd5", protocol.econtract_md5);
                    // 预绑定查看银行协议内容的事件
                    appUtils.preBindEvent(getEvent("#protocolName").parent(), "#protocolName", function () {
                        appUtils.setSStorageInfo("pagebackthird", "3");
                        appUtils.pageInit("account/thirdDepository", "account/showProtocol", {"protocol_id": getEvent("#protocolName").attr("protocolId")});
                    });
                }
            }
            else {
                layerUtils.iAlert(data.error_info, -1);
            }
        });
    }

    function clearCssStyle() {
        getEvent("#input_text_bankcard_keyboard").find("em").html("");  // 清空银行卡号值
        getEvent("#input_text_bankcardPwd_keyboard").find("em").html("");  // 清空银行卡密码值
        getEvent("#input_text_bankcardPwd").attr("data-password", "");  // 清空密码值
        getEvent("#selectBank").attr("bankcode", "");
        getEvent("#selectBank").attr("zzbindtype", "");
        getEvent("#selectBank").text("请选择银行");  // 选择银行,还原
        getEvent("#protocolName").html("");  // 清空协议
        getEvent(".l_link").hide();
        getEvent(".protocolshow").hide();

        getEvent(".user_form .input_form:eq(1)").show();
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