/**
 * 视频见证注意事项
 */
define("project/scripts/account/videoNotice",
    function (require, exports, module) {
        /* 私有业务模块的全局变量 begin */
        var appUtils = require("appUtils"),
            service = require("serviceImp").getInstance(),// 业务层接口，请求数据
            gconfig = require("gconfig"),
            utils = require("utils"),
            layerUtils = require("layerUtils"),
            needVideo = "",
            _pageId = "#account_videoNotice",
            _pageLocation = "account/videoNotice";
        /* 私有业务模块的全局变量 end */

        function init() {
            //加载样式
            getEvent(".page").height($(window).height());
            getEvent(".over_scroll").height($(window).height() - 45).css({
                overflow: "auto"
            });
            window.videoSuccess = videoSuccess; // 见证成功
            window.videoFail = videoFail; // 见证中断
            window.videoReject = videoReject; // 见证驳回
            initPage(); // 初始化页面
            getVedioport(); // 获取营业部视频端口
        }

        function bindPageEvent() {
            /* 绑定返回 */
            appUtils.bindEvent(getEvent(".header .icon_back"), function () {
                pageBack();
            });

            /* 重新上传照片 */
            appUtils.bindEvent(getEvent(".photo_again"),
                function () {
                    var param = {
                        user_id: appUtils.getSStorageInfo("userId"),
                        lastcomplete_step: "department",
                        opacctkind_flag: ""
                    };
                    service.queryChangeState(param,
                        function (data) {
                            var error_no = data.error_no;
                            var error_info = data.error_info;
                            if (error_no == 0) {
                                appUtils.setSStorageInfo("idInfo", "exist");
                                appUtils.pageInit(_pageLocation, "account/uploadPhoto", {});
                            } else {
                                layerUtils.iLoading(false);
                                layerUtils.iMsg(-1, error_info);
                            }
                        });
                });

            /* 重新提交资料 */
            appUtils.bindEvent(getEvent(".info_again"),
                function () {
                    var currentStep = appUtils.getSStorageInfo("currentStep");
                    var Flag = !!(currentStep == "uploadimg" || currentStep == null);
                    var param = {
                        user_id: appUtils.getSStorageInfo("userId"),
                        lastcomplete_step: "uploadimg",
                        opacctkind_flag: ""
                    };
                    service.queryChangeState(param,
                        function (data) {
                            var error_no = data.error_no;
                            var error_info = data.error_info;
                            if (error_no == 0) {
                                //pageBack();
                                //返回至用户信息确认页面
                                appUtils.pageInit(_pageLocation, "account/personInfo");
                            } else {
                                layerUtils.iLoading(false);
                                layerUtils.iMsg(-1, error_info);
                            }
                        },
                        Flag);
                });

            /* 在线视频视频见证 */
            appUtils.bindEvent(getEvent(".ct_btn:eq(0)"), function () {
                // 判断URL是否为空
                var param = {
                    "url": gconfig.global.serverPath + "?",
                    "user_id": appUtils.getSStorageInfo("userId"),
                    "user_name": appUtils.getSStorageInfo("custName"),
                    "org_id": appUtils.getSStorageInfo("branchCode"),
                    "jsessionid": appUtils.getSStorageInfo("jsessionid")
                };

                khmobile.videoWitness(JSON.stringify(param));

            });

            /* 继续开户 */
            appUtils.bindEvent(getEvent(".ct_btn:eq(1)"),
                function () {
                    queryQQOfflineState(); // 查询视频通过状态
                });
        }

        function destroy() {
            // 页面初始化样式重置
            getEvent(".header h3:eq(0)").show();
            getEvent(".header h3:eq(1)").hide();
            getEvent(".error_notice:eq(0)").hide();
            getEvent(".error_notice:eq(1)").hide();
            getEvent(".camera_notice:eq(0)").show();
            getEvent(".camera_notice:eq(1)").hide();
            getEvent(".photo_again").hide();
            getEvent(".info_again").hide();
            getEvent(".c_link").show();
            getEvent(".fix_bot").show();
            getEvent(".fix_bot .ct_btn:eq(0)").show();
            getEvent(".fix_bot .ct_btn:eq(1)").hide();
            service.destroy();
        }

        /* 处理返回按钮 */
        function pageBack() {

            var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
            var currentStep = appUtils.getSStorageInfo("currentStep");
            var _prePageCode = appUtils.getSStorageInfo("_prePageCode");
            console.log("videoNotices currentStep=" + currentStep + " tpbankFlg=" + tpbankFlg);
            // 从短信登陆进入(当前完成步骤为：已校验设置交易密码)，处理返回按钮
            if ((_prePageCode == "account/pwdVerify") || ((tpbankFlg == '001017' || tpbankFlg == '001015') && currentStep == "setpwd")) {
                appUtils.setSStorageInfo("personInfo", "exist"); // 标记完成资料填写步骤
                appUtils.pageInit(_pageLocation, "account/pwdVerify");
                return;
            }

            //返回至用户信息确认页面
            appUtils.pageInit(_pageLocation, "account/personInfo");
        }

        /* 初始化页面 */
        function initPage() {
            needVideo = appUtils.getPageParam("need_video");
            if (needVideo == 1) {
                getEvent(".main .step_box").hide();
                getEvent(".main .error_notice:eq(0)").show();
            }
        }

        /* 获取营业部视频端口 */
        function getVedioport() {
            // 获取营业部视频端口
            var param = {
                "branchno": appUtils.getSStorageInfo("branchCode"),
                "userid": appUtils.getSStorageInfo("userId")
            };
            service.queryVideoAddress(param,
                function (data) {
                    if (data.error_no == "0" && data.results.length != 0) {
                        appUtils.setSStorageInfo("branch_id", data.results[0].branch_id);
                        appUtils.setSStorageInfo("branch_url", data.results[0].url);
                    } else {
                        layerUtils.iMsg(-1, "获取视频服务器IP端口异常"); // 提示错误信息
                    }
                },
                true, true, handleTimeout);
        }

        /* 处理请求超时 */
        function handleTimeout() {
            layerUtils.iConfirm("请求超时，是否重新加载？",
                function () {
                    getVedioport(); // 再次获取视频端口
                });
        }

        /* 查询离线视频通过状态 */
        function queryQQOfflineState() {
            var lookVedioStateParam = {
                "user_id": appUtils.getSStorageInfo("userId")
            };
            service.queryQQOfflineState(lookVedioStateParam,
                function (data) {
                    var error_no = data.error_no;
                    var error_info = data.error_info;
                    if (error_no == 0 && data.results.length != 0) {
                        // 视频通过状态，0：未见证、2：已预约离线见证未完成见证、1：视频见证完成、3：见证失败
                        // 未见证不需要做处理
                        var witnessFlag = data.results[0].witness_flag;
                        if (witnessFlag == 1) {
                            layerUtils.iAlert("您的视频审核已通过，接下来即将为您安装数字证书...", 0,
                                function () {
                                    appUtils.pageInit(_pageLocation, "account/digitalCertificate", {});
                                });
                        } else if (witnessFlag == 2) {
                            layerUtils.iAlert("您的预约信息已经提交，我们的客服将尽快联系您！", 0);
                        } else if (witnessFlag == 3) {
                            getEvent(".c_link").show();
                            getEvent(".fix_bot .ct_btn:eq(0)").show();
                            getEvent(".fix_bot .ct_btn:eq(1)").hide();
                            layerUtils.iAlert("视频见证失败，请重新申请见证！");
                        } else if (witnessFlag == 4) {
                            layerUtils.iAlert("资料审核中，工作人员会尽快给您回复，请耐心等候！");
                        }
                    } else {
                        layerUtils.iAlert(error_info);
                    }
                });
        }

        /* 见证通过 */
        function videoSuccess() {
            getEvent(".fix_bot .ct_btn:eq(0)").hide();
            getEvent(".fix_bot .ct_btn:eq(1)").show();
            getEvent(".c_link").hide();
            queryQQOfflineState(); // 查询视频通过状态
        }

        /* 见证不通过 */
        function videoFail() {
        }

        /* 见证被驳回 */
        function videoReject() {
            getEvent(".header h3:eq(0)").hide();
            getEvent(".header h3:eq(1)").show();
            getEvent(".error_notice:eq(0)").hide();
            getEvent(".error_notice:eq(1)").show();
            getEvent(".camera_notice:eq(0)").hide();
            getEvent(".camera_notice:eq(1)").show();
            getEvent(".photo_again").show();
            getEvent(".info_again").show();
            getEvent(".c_link").hide();
            getEvent(".fix_bot").hide();
        }

        //获取当前页面属性对象
        function getEvent(event) {
            return $(_pageId + " " + event);
        }

        // 暴露对外的接口
        module.exports = {
            "init": init,
            "bindPageEvent": bindPageEvent,
            "pageBack": pageBack,
            "destroy": destroy
        };
    });