/**
 * 安装数字证书
 */
define("project/scripts/account/digitalCertificate", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        global = require("gconfig").global,
        utils = require("utils"),
        _pageId = "#account_digitalCertificate",
        cert_type = "zd";// tw:天威 zd:中登
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        layerUtils.iLoading(false);  //证书下载页屏蔽系统等待层
        upload_cert();  //下载安装证书
    }

    function bindPageEvent() {
        appUtils.bindEvent(getEvent(".cert_down a"), function (e) {
            getEvent(".qa_list").slideDown("fast");
            e.stopPropagation();
        });

        appUtils.bindEvent($(_pageId), function (e) {
            getEvent(".qa_list").slideUp("fast");
            e.stopPropagation();
        });

        appUtils.bindEvent(getEvent(".icon_back"), function (e) {
            if (global.openChannel == "1") {
                utils.closeApp();
            } else {
                appUtils.pageInit("account/digitalCertificate", "account/phoneNumberVerify", {"backUrl": "account/digitalCertificate"});
            }
            e.stopPropagation();
        });
    }

    function destroy() {
        getEvent(".order_succes").show();
        getEvent(".cert_down").hide();
        getEvent("#next_btn a").html("请稍后...");
        getEvent("#next_btn").attr("class", "ce_btn");
        service.destroy();
    }

    /*下载证书并安装*/
    function upload_cert() {
        // 证书申请串，数据来源于壳子
        var createKeyParam = {
            "rodam": utils.randomKey(),
            "userId": appUtils.getSStorageInfo("userId"),
            "key": "stockDelegateTradeSys"
        };
        var returnData = "";
        if (utils.isAndroid()) {
            returnData = khmobile.createKey(JSON.stringify(createKeyParam));
            if (!returnData) {
                install_failed();
            } else {
                createKeyPluginCallback(returnData);
            }
        } else {
            require("shellPlugin").callShellMethod("createKeyPlugin", function (data) {
                console.log("createKeyPlugin:" + data.pkcs10);
                createKeyPluginCallback(data.pkcs10);
            }, install_failed, createKeyParam);
        }

        function createKeyPluginCallback(returnData) {
            // 中登证书
            var param = {
                "user_id": appUtils.getSStorageInfo("userId"),
                "pkcs10": returnData
            };
            // 新开调用中登证书
            service.queryCompyCart(param, function (data) {
                callcert(data, cert_type)
            }, true, false, handleTimeout);
        }
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            upload_cert();  // 再次下载证书
        });
    }

    /* 安装证书回调方法 */
    function callcert(data, cert_type) {
        var error_no = data.error_no;
        var error_info = data.error_info;
        if (error_no == "0" && data.results.length != 0) {
            var certParam = {
                // 获取证书的内容
                "content": data.results[0].p7cert,
                "userId": appUtils.getSStorageInfo("userId"),
                "type": cert_type
            };
            // 壳子读取证书，然后安装证书

            if (utils.isAndroid()) {
                var returnInitZs = khmobile.initZs(JSON.stringify(certParam));
                initZsPluginCallback(returnInitZs);
            } else {
                require("shellPlugin").callShellMethod("initZsPlugin", function (data) {
                    initZsPluginCallback(data);
                }, install_failed, certParam);
            }

            function initZsPluginCallback(returnData) {
                if (returnData == "OK") {
                    getEvent(".cert_down .cert_stat").html("安装完成");
                    getEvent(".order_succes").hide();
                    getEvent(".cert_down").show();
                    getEvent("#next_btn").attr("class", "ct_btn");
                    getEvent("#next_btn a").html("继续开户");  // 开户
                    // 为按钮绑定事件
                    appUtils.bindEvent(getEvent("#next_btn a"), function () {
                        appUtils.pageInit("account/digitalCertificate", "account/signProtocol", {});
                    });
                }
                else {
                    install_failed();
                }
            }
        }
        else {
            layerUtils.iLoading(false);
            layerUtils.iAlert(error_info, -1);
            install_failed();
        }
    }

    /*安装证书失败回调*/
    function install_failed() {
        getEvent("#next_btn").attr("class", "ct_btn");
        getEvent("#next_btn a").html("手动安装");
        getEvent(".cert_down .cert_stat").html("安装失败");
        getEvent(".order_succes").hide();
        getEvent(".cert_down").show();
        // 为按钮绑定事件
        appUtils.bindEvent(getEvent("#next_btn a"), function () {
            destroy();
            init();
        });
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});