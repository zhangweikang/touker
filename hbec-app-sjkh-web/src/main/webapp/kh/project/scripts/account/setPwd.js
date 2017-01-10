/**
 * 设置密码
 */
define("project/scripts/account/setPwd", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        validatorUtil = require("validatorUtil"),
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        protocol = null,  //保存协议
        keyTelPanel = require("keyTelPanel"),
        cert_type = "zd",
        backPwd = "",
        _pageId = "#account_setPwd";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45 - 54).css({overflow: "auto"});
        initPage();  // 初始化页面
        utils.chechCertificate(getAgreement, null, true);//检测证书是否存在
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            if (backPwd) {
                appUtils.pageInit("account/setPwd", "account/accountSuccess",{backUrl:"account/setPwd"});
            } else {
                appUtils.pageInit("account/setPwd", "account/signProtocol");
            }
        });

        /* 是否设置资金密码与交易密码一致（隐藏显示）*/
        appUtils.bindEvent(getEvent(".mt15 .icon_check:eq(0)"), function () {
            getEvent(".user_form .circular:eq(1)").toggle();
            getEvent(".user_form .mt10").toggle();
            getEvent("#checkprotocol").toggle();
            getEvent(".l_link").toggle();
            $(this).toggleClass("checked");
            if (!($(this).hasClass("checked"))) {
                getEvent("#m_title").show();
                getEvent("#input_text_pass3").attr("data-password", "");
                getEvent("#input_text_pass4").attr("data-password", "");
                getEvent("#input_text_pass3_keyboard").find("em").css({color: "#e3e3e3"}).html("请输入6位数字资金密码");
                getEvent("#input_text_pass4_keyboard").find("em").css({color: "#e3e3e3"}).html("请再次输入资金密码");
            } else {
                getEvent("#m_title").hide();
            }
        });

        /* 勾选协议按钮 */
        appUtils.bindEvent(getEvent("#checkprotocol .icon_check:eq(0)"), function () {
            $(this).toggleClass("checked");
        });

        /* 查看协议内容的事件 */
        appUtils.bindEvent(getEvent("#protocolName"), function () {
            appUtils.pageInit("account/setPwd", "account/showProtocol", {"protocol_id": $(this).attr("protocolId")});
        });

        appUtils.bindEvent(getEvent(".input_custom"), function () {
            $(this).addClass("active")
        });

        /* 点击页面关闭键盘 */
        appUtils.bindEvent($(_pageId), function (e) {
            getEvent(".input_custom").removeClass("active");   // 移除输入框的焦点
            keyTelPanel.closeKeyPanel();  // 关闭 js 键盘
            e.stopPropagation();
        });

        /* 点击密码框统一调用密码键盘   ------交易密码*/
        appUtils.bindEvent(getEvent("#input_text_pass1"), function (e) {
            var input_pass1_keyboard = $(this);
            input_pass1_keyboard.find("em").html("");  // 清空密码
            input_pass1_keyboard.attr("data-password", "");  // 清空密码值
            getEvent(".input_custom").removeClass("active");    // 移除输入框的焦点
            getEvent("#input_text_pass1 .input_custom").addClass("active");
            input_pass1_keyboard.find("em").css({color: "#9F9F9F"});  // 添加输入框的焦点
            keyTelPanel.init_keyPanel(function (value) {
                var curEchoText = input_pass1_keyboard.find("em").html();  // 密码回显文本
                var input_pass1_curPwd = input_pass1_keyboard.attr("data-password") || "";  // 密码值
                if (value == "del") {
                    input_pass1_keyboard.find("em").html(curEchoText.slice(0, -1));
                    input_pass1_keyboard.attr("data-password", input_pass1_curPwd.slice(0, -1));
                }
                else {
                    if (input_pass1_curPwd.length < 6) {
                        input_pass1_keyboard.attr("data-password", input_pass1_curPwd + value);  // 设置密码值
                        input_pass1_keyboard.find("em").html(curEchoText + "*");
                    }
                    else {
                        layerUtils.iAlert("交易密码最多6位!", -1);
                    }
                }
                validatePassword(getEvent("#input_text_pass1"));
            }, input_pass1_keyboard);
            e.stopPropagation();
        });

        /* 点击密码框统一调用密码键盘   ------再次输入交易密码*/
        appUtils.bindEvent(getEvent("#input_text_pass2"), function (e) {
            var input_pass2_keyboard = $(this);
            input_pass2_keyboard.find("em").html("");  // 清空密码
            input_pass2_keyboard.attr("data-password", "");  // 清空密码值
            getEvent(".input_custom").removeClass("active");    // 移除输入框的焦点
            getEvent("#input_text_pass2 .input_custom").addClass("active");
            input_pass2_keyboard.find("em").css({color: "#9F9F9F"});  // 添加输入框的焦点
            keyTelPanel.init_keyPanel(function (value) {
                var curEchoText = input_pass2_keyboard.find("em").html();  // 密码回显文本
                var input_pass2_curPwd = input_pass2_keyboard.attr("data-password") || "";  // 密码值
                if (value == "del") {
                    input_pass2_keyboard.find("em").html(curEchoText.slice(0, -1));
                    input_pass2_keyboard.attr("data-password", input_pass2_curPwd.slice(0, -1));
                }
                else {
                    if (input_pass2_curPwd.length < 6) {
                        input_pass2_keyboard.attr("data-password", input_pass2_curPwd + value);  // 设置密码值
                        input_pass2_keyboard.find("em").html(curEchoText + "*");
                    }
                    else {
                        layerUtils.iAlert("再次输入交易密码最多6位!", -1);
                    }
                }
                validatePassword(getEvent("#input_text_pass2"));
            }, input_pass2_keyboard);
            e.stopPropagation();
        });

        /* 点击密码框统一调用密码键盘   ------资金密码*/
        appUtils.bindEvent(getEvent("#input_text_pass3"), function (e) {

            var input_pass3_keyboard = $(this);
            input_pass3_keyboard.find("em").html("");  // 清空密码
            input_pass3_keyboard.attr("data-password", "");  // 清空密码值
            getEvent(".input_custom").removeClass("active");    // 移除输入框的焦点
            getEvent("#input_text_pass3 .input_custom").addClass("active");
            input_pass3_keyboard.find("em").css({color: "#9F9F9F"});  // 添加输入框的焦点
            keyTelPanel.init_keyPanel(function (value) {
                var curEchoText = input_pass3_keyboard.find("em").html();  // 密码回显文本
                var input_pass3_curPwd = input_pass3_keyboard.attr("data-password") || "";  // 密码值
                if (value == "del") {
                    input_pass3_keyboard.find("em").html(curEchoText.slice(0, -1));
                    input_pass3_keyboard.attr("data-password", input_pass3_curPwd.slice(0, -1));
                }
                else {
                    if (input_pass3_curPwd.length < 6) {
                        input_pass3_keyboard.attr("data-password", input_pass3_curPwd + value);  // 设置密码值
                        input_pass3_keyboard.find("em").html(curEchoText + "*");
                    }
                    else {
                        layerUtils.iAlert("资金密码最多6位!", -1);
                    }
                }
                validatePassword(getEvent("#input_text_pass3"));
            }, input_pass3_keyboard);
            e.stopPropagation();
        });

        /* 点击密码框统一调用密码键盘   ------再次资金密码*/
        appUtils.bindEvent(getEvent("#input_text_pass4"), function (e) {

            var input_pass4_keyboard = $(this);
            input_pass4_keyboard.find("em").html("");  // 清空密码
            input_pass4_keyboard.attr("data-password", "");  // 清空密码值
            getEvent(".input_custom").removeClass("active");    // 移除输入框的焦点
            getEvent("#input_text_pass4 .input_custom").addClass("active");
            input_pass4_keyboard.find("em").css({color: "#9F9F9F"});  // 添加输入框的焦点
            keyTelPanel.init_keyPanel(function (value) {
                var curEchoText = input_pass4_keyboard.find("em").html();  // 密码回显文本
                var input_pass4_curPwd = input_pass4_keyboard.attr("data-password") || "";  // 密码值
                if (value == "del") {
                    input_pass4_keyboard.find("em").html(curEchoText.slice(0, -1));
                    input_pass4_keyboard.attr("data-password", input_pass4_curPwd.slice(0, -1));
                }
                else {
                    if (input_pass4_curPwd.length < 6) {
                        input_pass4_keyboard.attr("data-password", input_pass4_curPwd + value);  // 设置密码值
                        input_pass4_keyboard.find("em").html(curEchoText + "*");
                    }
                    else {
                        layerUtils.iAlert("再次输入资金密码最多6位!", -1);
                    }
                }
                validatePassword(getEvent("#input_text_pass4"));
            }, input_pass4_keyboard);
            e.stopPropagation();
        });

        /* 继续开户 */
        appUtils.bindEvent(getEvent(".ct_btn"), function () {
            if (validatePost()) {
                appUtils.setSStorageInfo("backSetPwd", "againSetpwd");//回显后在到三方存管
                if (getEvent(".mt15 .icon_check:eq(0)").hasClass("checked")) {
                    signProtocol(); // 交易密码和资金密码相同，签署密码协议
                } else {
                    postPassword();  // 不需要签署协议，直接提交密码
                }
            }
        });
    }

    function destroy() {
        service.destroy();
    }

    /* 页面初始化 */
    function initPage() {
        layerUtils.iLoading(true);  // 开启等待层。。。
        getEvent(".input_form:eq(1)").hide();
        getEvent(".user_form .mt10").show();
        getEvent(".mt15 .icon_check:eq(0)").addClass("checked"); //默认选中

        backPwd = appUtils.getSStorageInfo("backPwd",backPwd);
        if (backPwd) {
            getEvent(".error_notice").show();
            getEvent(".step_box.top_step").hide();
            getEvent(".top_title02").hide();
        } else {
            getEvent(".error_notice").hide();
            getEvent(".step_box.top_step").show();
            getEvent(".top_title02").show();
        }

        for (var i = 1; i <= 4; i++) {
            getEvent("#input_text_pass" + i + "_keyboard").find("em").html("");  // 清空密码
            getEvent("#input_text_pass" + i + "").attr("data-password", "");  // 清空密码值
        }
    }

    /* 密码提交时校验 */
    function validatePost() {
        var pass1 = "", pass2 = "", pass3 = "", pass4 = "";
        if (getEvent("#input_text_pass1").attr("data-password") != undefined) {
            pass1 = getEvent("#input_text_pass1").attr("data-password");
            pass1 = pass1.toString();
        }
        if (getEvent("#input_text_pass2").attr("data-password") != undefined) {
            pass2 = getEvent("#input_text_pass2").attr("data-password");
            pass2 = pass2.toString();
        }
        if (getEvent("#input_text_pass3").attr("data-password") != undefined) {
            pass3 = getEvent("#input_text_pass3").attr("data-password");
            pass3 = pass3.toString();
        }
        if (getEvent("#input_text_pass4").attr("data-password") != undefined) {
            pass4 = getEvent("#input_text_pass4").attr("data-password");
            pass4 = pass4.toString();
        }

        if (getEvent(".mt15 .icon_check:eq(0)").hasClass("checked")) {
            if (validatorUtil.isEmpty(pass1) || validatorUtil.isEmpty(pass2)) {
                layerUtils.iMsg(-1, "请完成密码设置!");
                return false;
            }
        }
        else {
            if ((validatorUtil.isEmpty(pass1) || validatorUtil.isEmpty(pass2)) && (validatorUtil.isEmpty(pass3) || validatorUtil.isEmpty(pass4))) {
                layerUtils.iMsg(-1, "请完成密码设置!");
                return false;
            }
            else if (validatorUtil.isEmpty(pass1) || validatorUtil.isEmpty(pass2)) {
                layerUtils.iMsg(-1, "请完成交易密码设置!");
                return false;
            }
            else if (validatorUtil.isEmpty(pass3) || validatorUtil.isEmpty(pass4)) {
                layerUtils.iMsg(-1, "请完成资金密码设置!");
                return false;
            }
        }
        if (pass1.length != "6") {
            layerUtils.iMsg(-1, "请输入6位数字交易密码，请重新输入!");
            return false;
        }
        else if (pass1 != pass2) {
            layerUtils.iMsg(-1, "交易密码与第一次不符，请重新输入!");
            getEvent("#input_text_pass2_keyboard").find("em").html("");  // 清空密码
            getEvent("#input_text_pass2").attr("data-password", "");  // 清空密码值
            return false;
        }
        if (!getEvent(".mt15 .icon_check:eq(0)").hasClass("checked")) {
            if (pass3.length != "6") {
                layerUtils.iMsg(-1, "请输入6位数字资金密码，请重新输入!");
                return false;
            }
            else if (pass3 != pass4) {
                layerUtils.iMsg(-1, "资金密码与第一次不符，请重新输入!");
                getEvent("#input_text_pass4_keyboard").find("em").html("");  // 清空密码
                getEvent("#input_text_pass4").attr("data-password", "");  // 清空密码值
                return false;
            }
        }
        else {
            getEvent("#input_text_pass3").attr("data-password", getEvent("#input_text_pass1").attr("data-password"));  // 赋值密码值
            getEvent("#input_text_pass4").attr("data-password", getEvent("#input_text_pass1").attr("data-password"));  // 赋值密码值
        }
        return true;
    }

    /* 验证密码 6位数字 */
    function validatePassword(obj) {

        var password = obj.attr("data-password");
        password = password.toString();
        if (password.length == 6) {
            /**
             * 增加弱密校验
             * 1、出生日期的一部分
             * 2、证件号码的一部分
             * 3、某一字符出现的概率不能占总长度的一半以上
             * 4、顺序递增或者递减
             * 5、弱密表的控制值
             * 6、移动电话的一部分
             * 7、固定电话的一部分
             */
            var idCardNo = appUtils.getSStorageInfo("idCardNo") ? appUtils.getSStorageInfo("idCardNo") : "",
                mobileNo = appUtils.getSStorageInfo("mobileNo") ? appUtils.getSStorageInfo("mobileNo") : "";
            // 判断是不是出生日期的一部分
            if (password == idCardNo.substring(6, 12) || password == idCardNo.substring(8, 14)) {
                layerUtils.iAlert("密码不能是出生日期的一部分！", -1);
                // 将密码清除
                obj.find("em").html("");
                obj.attr("data-password", "");
                return false;
            }
            // 判断是不是证件号码的一部分
            if (idCardNo.indexOf(password) != -1) {
                layerUtils.iAlert("密码不能是证件号码的一部分！", -1);
                // 将密码清除
                obj.find("em").html("");
                obj.attr("data-password", "");
                return false;
            }
            // 判断某一字符出现的次数
            for (var i = 0; i < password.length; i++) {
                var oneChar = password.charAt(i),
                    count = 0;
                for (var j = 0; j < password.length; j++) {
                    if (oneChar == password.charAt(j)) {
                        count++;
                    }
                }
                if (count >= 3) {
                    layerUtils.iAlert("密码中&nbsp;" + oneChar + "&nbsp;出现的次数超过了三次！", -1);
                    // 将密码清除
                    obj.find("em").html("");
                    obj.attr("data-password", "");
                    return false;
                }

            }
            // 判断顺序递增或者递减
            var orderArray = ['012345', '123456', '234567', '345678', '456789', '987654', '876543', '765432', '654321', '543210'];
            if (orderArray.indexOf(password) != -1) {
                layerUtils.iAlert("密码不能是顺序递增或者递减！", -1);
                // 将密码清除
                obj.find("em").html("");
                obj.attr("data-password", "");
                return false;
            }
            //判断弱密码库
            var weakpwdArr = ['111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999', '101010', '202020', '303030',
                '404040', '505050', '606060', '707070', '808080', '909090', '101010', '121212', '131313', '141414', '151515', '161616',
                '171717', '181818', '191919', '202020', '212121', '232323', '242424', '252525', '262626', '272727', '282828', '292929',
                '303030', '313131', '323232', '343434', '353535', '363636', '373737', '383838', '393939', '404040', '414141', '424242',
                '434343', '454545', '464646', '474747', '484848', '494949', '505050', '515151', '525252', '535353', '545454', '565656',
                '575757', '585858', '595959', '606060', '616161', '626262', '636363', '646464', '656565', '676767', '686868', '696969',
                '707070', '717171', '727272', '737373', '747474', '757575', '767676', '787878', '797979', '808080', '818181', '828282',
                '838383', '848484', '858585', '868686', '878787', '898989', '909090', '919191', '929292', '939393', '949494', '959595',
                '969696', '979797', '989898', '123412', '234523', '345634', '456745', '567856', '678967', '123012', '123123', '234234',
                '345345', '456456', '567567', '678678', '789789', '112233', '111222', '123412', '123443', '234567', '123456', '876543',
                '111122', '222233', '333344', '444455', '555566', '666677', '777788', '888899', '999900', '111111', '111122', '111133',
                '111144', '111155', '111166', '111177', '111188', '111199', '111100'];
            if (weakpwdArr.indexOf(password) != -1) {
                layerUtils.iAlert("请勿输入简单组合的密码！", -1);
                // 将密码清除
                obj.find("em").html("");
                obj.attr("data-password", "");
                return false;
            }
            // 判断是否是移动电话的一部分
            if (mobileNo.indexOf(password) != -1) {
                layerUtils.iAlert("密码不能是移动电话的一部分！", -1);
                // 将密码清除
                obj.find("em").html("");
                obj.attr("data-password", "");
                return false;
            }
        }
    }

    /* 获取协议 */
    function getAgreement() {
        //调用service查询协议
        service.queryProtocolList({"category_englishname": "pwdprotcl"}, function (data) {
            if (data.error_no == 0 && data.results.length != 0) {
                protocol = data.results[0];
                getEvent("#protocolName").html("《" + protocol.econtract_name + "》");
                getEvent("#protocolName").attr("protocolId", protocol.econtract_no);
            } else {
                layerUtils.iAlert(data.error_info);
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            getAgreement();  // 再次获取密码协议
        });
    }

    /* 签署协议 */
    function signProtocol() {
        var protocolArray = new Array(),  //协议数组
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
        // 开启等待层。。。
        layerUtils.iLoading(true);
        // 获取协议的数字签名值
        if (utils.isAndroid()) {
            var returnData = khmobile.sign(JSON.stringify(signParam));
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
            // 数字签名值
            var protocol = {
                "protocol_id": protocolid,
                "protocol_dcsign": data,
                "summary": summary
            };
            protocolArray.push(protocol);
            // 签署协议
            var signProtocolParam = {
                "user_id": userid,
                "jsondata": JSON.stringify(protocolArray),
                "ipaddr": ipaddr,
                "macaddr": macaddr
            };
            // 新开中登验签
            service.queryOpenCheckSign(signProtocolParam, postPassword, false);
        }
    }


    /**
     * 提交交易密码，资金密码 两次单独请求
     * 第一次提交设置交易密码 若失败 直接返回；若成功则锁定交易密码设置
     * 第二次提交设置资金密码 若失败 程序停止，交易密码设置锁定；
     * pwd_type 1:资金密码 2:交易密码
     */
    function postPassword() {
        service.getRSAKey({}, function (data) {
            if (data.error_no == 0)	//请求获取rsa公钥成功
            {
                //密码采用rsa加密
                var results = data.results[0];
                var modulus = results.modulus;
                var publicExponent = results.publicExponent;
                var endecryptUtils = require("endecryptUtils");

                var tpassword = endecryptUtils.rsaEncrypt(modulus, publicExponent, getEvent("#input_text_pass1").attr("data-password"));  //交易密码
                var fpassword = endecryptUtils.rsaEncrypt(modulus, publicExponent, getEvent("#input_text_pass3").attr("data-password"));  //资金密码
                var userid = appUtils.getSStorageInfo("userId");
                var is_same = getEvent(".mt15 .icon_check:eq(0)").hasClass("checked") ? 1 : 0;  // 判断资金密码和交易密码是否一致
                var tradePasswordParam = {
                    "user_id": userid,
                    "acct_clientid": "",
                    "password": tpassword,
                    "pwd_type": "2",
                    "is_same": is_same
                };
                var fundPasswordParam = {
                    "user_id": userid,
                    "acct_clientid": "",
                    "password": fpassword,
                    "pwd_type": "1",
                    "is_same": is_same
                };
                service.setAccountPwd(tradePasswordParam, function (data) {
                    var errorNo = data.error_no;
                    var errorInfo = data.error_info;
                    if (errorNo == 0)	//交易密码设置成功，锁定交易密码设置框
                    {
                        //第二次调用接口，提交资金密码
                        service.setAccountPwd(fundPasswordParam, function (data) {
                            if (data.error_no == 0)	//交易密码设置成功，锁定交易密码设置框
                            {
                                if (backPwd) {
                                    appUtils.clearSStorage("backPwd");
                                    var url = utils.getRedirectUrl();
                                    appUtils.pageInit("account/signProtocol", url);
                                } else {
                                    appUtils.pageInit("account/setPwd", "account/thirdDepository", {});
                                }
                            } else {
                                layerUtils.iLoading(false);
                                layerUtils.iAlert(data.error_info);
                            }
                        }, false);
                    }
                    else {
                        layerUtils.iLoading(false);
                        layerUtils.iAlert(errorInfo);
                        return false;
                    }
                }, false);
            }
            else {
                layerUtils.iLoading(false);
                layerUtils.iAlert(data.error_info);
            }
        }, false);
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