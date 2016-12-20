/**
 * 开户成功页面
 * Created by Administrator on 2016/7/26.
 */
define("project/scripts/account/accountSuccess", function (require, exports, module) {
        /* 私有业务模块的全局变量 begin */
        var $ = jQuery = require('jquery');
        var appUtils = require("appUtils"),
            service = require("serviceImp").getInstance(),  //业务层接口，请求数据
            layerUtils = require("layerUtils"),
            openChannel = require("gconfig").global.openChannel,
            _pageId = "#account_accountSuccess",
            utils = require("utils"),
            bankCode = "",
            isCard = "";

        //初始加载方法
        function init() {

			bankCode = appUtils.getSStorageInfo("bankCode");
			isCard = appUtils.getSStorageInfo(bankCode+"isCard");

        	getEvent(".main-pic").attr("class","main-pic");
        	getEvent(".step.step1").attr("class","step step1");
        	getEvent(".step.step2").attr("class","step step2");
        	getEvent(".step.step3").attr("class","step step3");
        	getEvent(".step.step1 .date").text("");
        	getEvent(".step.step2 .date").text("");
        	getEvent(".step.step3 .date").text("");
            if (openChannel == "0") {
                //显示证券开户样式
                getEvent(".sjkh.kh-tips").addClass("hb");
                getEvent(".download-tip").attr("style", "display: block");
                getEvent(".top-info a").attr("style","text-align: right;position: absolute;right: 15px;top: 0px;color:#c50436;");

            } else if (openChannel == "1") {
                //钱钱炒股开户样式
                getEvent(".sjkh.kh-tips").addClass("qq");
                getEvent(".top-info a").attr("style","text-align: right;position: absolute;right: 15px;top: 0px;color:#fff;");
            }

            queryAccount();
        }

        //事件绑定
        function bindPageEvent() {
            /* 绑定完成返事件 */
            appUtils.bindEvent(getEvent(".top-info a"), function () {
                if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面
                    utils.closeApp();
                } else {
                    appUtils.pageInit("account/accountSuccess", "account/openAccount", {backUrl:"account/accountSuccess"});
                }
            });

            //下载按钮绑定
            appUtils.bindEvent(getEvent(".download-btn"), function () {
                if (navigator.userAgent.indexOf("Android") > 0) {
                    var url = "http://s.touker.com/fs/files/mgtFshbecportal/qqcg_tk.apk";
                    //navigator.app.loadUrl(encodeURI(url), { openExternal:true});
                    window.location.href = url;
                }
                if (/\((iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
                    goToAppStore();
                }
            });
        }

        //页面销毁调用方法
        function destroy() {
        }

        /* 查询用户信息 */
        function queryAccount() {
            var param = {"user_id": appUtils.getSStorageInfo("user_id")};
            service.queryUserInfo(param, function (data) {
                var error_no = data.error_no;
                var error_info = data.error_info;
                if (error_no == 0) {
                    var res = data.results[0];
                    var commissionName = res.commissionName; //佣金费率
                    var branchName = res.branchName; //营业部名称
                    var expectOpenAccountTime = res.expectOpenAccountTime; //预计开户完成时间
                    var expectTradeTime = res.expectTradeTime; //预计开户完成时间
                    var startTime = res.start_time; //用户申请时间
                    var openAccountTime = res.openAccountTime; //开户完成时间
                    var tradeTime = res.tradeTime; //可交易时间
                    var openSuccess = res.openSuccess; //开户成功

                    var startTime1 = startTime.trim().split(" ")[1];
                    var startTimeHour = parseInt(startTime1.split(":")[0]);
                    var startTimeMin = parseInt(startTime1.split(":")[1]);
                    var startTime0 = startTime.trim().split(" ")[0];

                    getEvent(".state-desc-sub").text(branchName + "默认交易佣金：" + parseFloat(commissionName) + "%");
                    getEvent(".main-pic").attr("class","main-pic hourglass");
                    getEvent(".state-desc").text("开户申请已受理");

                    if(isCard != "0"){
                        getEvent(".step.step1 .date").text(startTime0);

                        //是申请时间大于天15:30,预计开户完成时间T+1,不需要输入银行卡的不显示申请时间
                        if (startTimeHour > 15 || (startTimeHour == 15 && startTimeMin >= 30)) {
                            getEvent(".step.step2 .date").text(expectOpenAccountTime);
                            getEvent(".step.step3 .date").text(expectTradeTime);
                        } else {
                            //显示申请当天时间
                            getEvent(".step.step2 .date").text(startTime0);
                            getEvent(".step.step3 .date").text(expectOpenAccountTime);
                        }
                    }

                    if (openSuccess == "true") {
                        //开户完成图标显示
                        getEvent(".step.step2").addClass("on");
                        getEvent(".main-pic").attr("class","main-pic check");
                        getEvent(".state-desc").text("开户完成");
                        //文字显示开户完成时间,可交易时间  
                        if (openAccountTime != "" && isCard != "0") {
                            getEvent(".step.step2 .date").text(openAccountTime);
                            getEvent(".step.step3 .date").text(tradeTime);
                        }

                        //判断用户当前登陆时间是否大于可交易时间,显示可交易图标
                        var presentTime = new Date();
                        var presentTimeMonth = parseInt(presentTime.getMonth() + 1);
                        var presentTimeDate = parseInt(presentTime.getDate());

                        var openAccountTimeMonth = parseInt(openAccountTime.trim().split("-")[1]);
                        var openAccountTimeDate = parseInt(openAccountTime.trim().split("-")[2]);
                        //判断可交易图标显示
                        if (presentTimeMonth > openAccountTimeMonth || ((presentTimeMonth == openAccountTimeMonth) && (presentTimeDate > openAccountTimeDate))){
                            getEvent(".step.step3").addClass("on");
                            getEvent(".main-pic").attr("class","main-pic deal");
                            getEvent(".state-desc").text("可交易");
                        }
                    }
                    layerUtils.iLoading(false);
                }
                else {
                    layerUtils.iMsg(-1, error_info);
                }
            });
        }

        var accountSuccess = {
            "init": init,
            "bindPageEvent": bindPageEvent,
            "destroy": destroy
        };

        function getEvent(event) {
            return $(_pageId + " " + event);
        }

        //暴露接口
        module.exports = accountSuccess;
    }
);