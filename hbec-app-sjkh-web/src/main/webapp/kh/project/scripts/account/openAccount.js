/**
 * 新开户(转户)须知
 */
define("project/scripts/account/openAccount", function (require, exports, module) {
    // 私有业务模块的全局变量 begin
    var appUtils = require("appUtils"),
        global = require("gconfig").global,
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        utils = require("utils"),
        backUrl = "",
        phoneNum = "",
        source = require("gconfig").platform,
        layerUtils = require("layerUtils"), // 弹出层对象
        checkSmsPage = require("checkSmsPage"),
        _pageId = "#account_openAccount";
    // 私有业务模块的全局变量 end

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        //钱钱炒股App保留上方返回按钮
        if (global.openChannel == "1") {
            getEvent(".icon_back").show();
        }

        //页面跳转URL
        backUrl = appUtils.getPageParam("backUrl");

        //检查是否是非开户时间
        checkIfTradeTime();
    }

    //检查是否是非开户时间
    function checkIfTradeTime() {
        service.serviceAjax("/commons/getTradeDate", {},
            function (data) {
                var code = data.status;
                //001035,非交易时间; 001036,交易时间
                if (code == "001035") {
                    getEvent(".sjkh-vacation").show();	//展示非交易时间弹框
                    getEvent(".fix_bot .ct_btn .next").html("下次再来");
                }
            },
            function () {
                getEvent(".fix_bot .ct_btn .next").html("下次再来"); 	//显示 我知道了  按钮
            }
        );
    }

    //绑定事件
    function bindPageEvent() {
        //为返回按钮绑定返回事件,钱钱炒股中,点击返回按钮,关闭手机APP,返回到钱钱
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            if (global.openChannel == "1") {
                utils.closeApp();
            }
        });


        //绑定下一步(我知道了)
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn .next"), function () {
            var text = getEvent(".fix_bot .ct_btn .next").html();
            if ("我知道了" == text) {
                if (global.openChannel == "1") {
                    if (backUrl) {
                        appUtils.pageInit("account/openAccount", backUrl);
                    } else {
                        goProcess();
                    }
                } else {
                    appUtils.pageInit("account/openAccount", "account/phoneNumberVerify", {backUrl: backUrl});
                }
            } else {
                utils.closeApp();
            }
        });

        //非交易时间弹框关闭
        appUtils.bindEvent(getEvent(".close"), function () {
            //隐藏弹框
            getEvent(".sjkh-vacation").hide();
        });
    }

    function goProcess() {
        if (utils.isAndroid()) {
            var data = eval("(" + khmobile.getUserInfo() + ")");
            getUserInfo(data);
        } else {
            require("shellPlugin").callShellMethod("toukerServerPlugin", function (jsonresult) {
                getUserInfo(jsonresult);
            }, function (data) {
            }, {"command": "getUserInfo"});
        }
    }

    function getUserInfo(jsonresult) {
        // 获取移动端参数手机号、userId
        console.info("jsonresult>>>>" + JSON.stringify(jsonresult));
        if (jsonresult == null || jsonresult.phonenum == null || jsonresult.phonenum == "") {
            return;
        }

        utils.getIp();

        phoneNum = jsonresult.phonenum;
        //从钱钱炒股跳过来的一定是已注册投客用户，这里主要是获取该客户的客户号
        var param = {"mobileNo": phoneNum};

        param = utils.getParams(param);

        service.serviceAjax("/touker/isToukerUser", param, function (data) {
            appUtils.setSStorageInfo("mobileNo", phoneNum);
            var code = data.status;//001011, 未注册;001012,已注册
            if (code == "001012") {
                appUtils.setSStorageInfo("isToukerRegister", "true");
                var customerId = data.data.customerId;
                if (customerId) {
                    appUtils.setSStorageInfo("khh", customerId);//将客户号号加入到缓存中
                }
                var paramCheck = {
                    "mobileNo": phoneNum,
                    "mobileCode": getEvent(".mobileCode").val(),
                    "channel": "qianqian_app",
                    "source": source,
                    "khh": customerId,
                    "isToukerRegister": true,
                    "password": password,
                    "ip": appUtils.getSStorageInfo("ip"),
                    "mac": appUtils.getSStorageInfo("mac")
                };
                var paramCheckSms = {
                    "mobile_no": phoneNum,
                    "mobile_code": "111111",
                    "login_flag": "0"
                };
                service.checkSmsCode(paramCheckSms, function (data) {
                    var result = data.results;
                    // 将 clientinfo 保存到 session 中，用于解决壳子上传照片的权限问题
                    if (result[0].clientinfo) {
                        appUtils.setSStorageInfo("clientinfo", result[0].clientinfo);
                    }
                    // 将 jsessionid 保存到 session 中，用于解决壳子上传照片的权限问题
                    if (result[0].jsessionid) {
                        appUtils.setSStorageInfo("jsessionid", result[0].jsessionid);
                    }
                });

                checkSmsPage.valiDataCustomeInfo(paramCheck, "account/openAccount");
            } else {
                console.log("手机号" + jsonresult.phonenum + "未注册投客网");
                layerUtils.iMsg(-1, data.msg);
            }
        });
    }


    function destroy() {
        service.destroy();
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