define("project/scripts/account/pwdVerify", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),
        gconfig = require("gconfig"),
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        _pageId = "#account_pwdVerify";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        //清空数据
        getEvent(".password").val("");
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            pageBack();
        });

        /* 绑定退出按钮*/
        appUtils.bindEvent(getEvent(".header .icon_close"), function () {
            utils.layerTwoButton("退出系统？", "确认", "取消", function () {
                    utils.closeApp();
                },
                function () {
                    return false;
                });
        });

        /* 下一步(继续开户) */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            var password = getEvent(".password").val();
            if (password.length == 0) {
                layerUtils.iMsg(-1, "请输入交易密码！");
                return;
            }
            if (password.length < 6) {
                layerUtils.iMsg(-1, "请您输入6位的交易密码！");
                return;
            }

            var khh = appUtils.getSStorageInfo("khh");
            var ip = appUtils.getSStorageInfo("ip");
            var param = {
                "step": "validatePwd",
                "ip": ip,
                "khh": khh,
                "password": password
            };
            //验证交易密码是否正确

            var returnData = "";
            if (utils.isAndroid()) {
                returnData = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));
                toukerServerPluginCallback(returnData);
            } else {
                require("shellPlugin").callShellMethod("toukerServerPlugin", function (param) {
                    toukerServerPluginCallback(param);
                }, function (data) {
                }, {"command": "requestUrlParamsEncoding", "params": utils.jsonToParams(param)});
            }
            function toukerServerPluginCallback(returnData) {
                service.hbAjax(returnData, function (data) {
                    if (data.errorNo == 0) {
                        //将密码存入思迪数据库
                        postPassword();
                    } else {
                        layerUtils.iMsg(-1, "交易密码错误！");
                        getEvent(".password").val("");  //清空密码控件
                    }
                });
            }
        });
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

                var tpassword = endecryptUtils.rsaEncrypt(modulus, publicExponent, getEvent(" .password").val());  //交易密码
                var fpassword = endecryptUtils.rsaEncrypt(modulus, publicExponent, getEvent(" .password").val());  //资金密码
                var userid = appUtils.getSStorageInfo("user_id");

                //var is_same = $(_pageId+" .mt15 .icon_check:eq(0)").hasClass("checked") ? 1 : 0;  // 判断资金密码和交易密码是否一致
                var tradePasswordParam = {
                    "user_id": userid,
                    "acct_clientid": "",
                    "password": tpassword,
                    "pwd_type": "2",
                    "is_same": 1
                };
                var fundPasswordParam = {
                    "user_id": userid,
                    "acct_clientid": "",
                    "password": fpassword,
                    "pwd_type": "1",
                    "is_same": 1
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
                                appUtils.pageInit("account/pwdVerify", "account/videoNotice", {});
                            }
                            else {
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


    function destroy() {
        service.destroy();
    }

    /* 处理返回按钮 */
    function pageBack() {
        var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
        var currentStep = appUtils.getSStorageInfo("currentStep");
        console.log("pwdVerrify currentStep=" + currentStep + " tpbankFlg=" + tpbankFlg);
        // 从短信登陆进入(当前完成步骤为：已提交资料)，处理返回按钮
        console.log("pwdVerify currentStep=" + currentStep);
        appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
        appUtils.pageInit("account/pwdVerify", "account/personInfo", {});
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId +" " + event);
    }

    // 暴露对外的接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "pageBack": pageBack,
        "destroy": destroy
    };
});