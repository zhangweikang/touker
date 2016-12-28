/**
 * 设置服务营业部
 */
define("project/scripts/account/selDepartment", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        global = require("gconfig").global,
        layerUtils = require("layerUtils"),
        shellPlugin = require("shellPlugin"),
        utils = require("utils"),
        branchNo = "",
        branchName = "",
        commissionJsonEavl = {},
        _pageId = "#account_selDepartment";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        $(_pageId + " .page").height($(window).height());
        $(_pageId + " .over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        branchNo = appUtils.getSStorageInfo("branchNo"); // 用户已选营业部id
        branchName = appUtils.getSStorageInfo("branchName");  // 用户已选营业部名称
        // 初始化页面
        initPage();
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            var backUrl = appUtils.getPageParam("backUrl");
            if (backUrl) {
                appUtils.pageInit("account/selDepartment", appUtils.getPageParam("backUrl"), {"backUrl": "account/selDepartment"});
            } else if (appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app") {// 返回到钱钱炒股App，三分钟快速开户界面
                utils.closeApp();
            } else {
                appUtils.pageInit("account/selDepartment", "account/phoneNumberVerify", {});
            }
        });

        /* 点击页面其他元素隐藏下拉列表 */
        appUtils.bindEvent($(_pageId), function (e) {
            getEvent(".sel_list").slideUp("fast");	// 隐藏下拉列表
            e.stopPropagation();	// 阻止冒泡
        });

        /* 绑定选择营业部 */
        appUtils.bindEvent(getEvent(".mobile_form .sel_branch"), function (e) {
            getEvent(".branch ul li").removeClass("active");
            getEvent(".branch").slideToggle("fast");	// 显示选择营业厅的下拉列表
            e.stopPropagation();	// 阻止冒泡
        });

        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {

            var branchName = getEvent(".mobile_form .sel_branch").text();
            if (branchName == "请选择营业部") {
                layerUtils.iMsg(-1, "请选择开户营业部");
                return false;
            }

            //向后台发送服务营业部
            var mobileNo = appUtils.getSStorageInfo("mobileNo");
            var branchNo = getEvent(".sel_branch").attr("branchcode");
            var commission = getEvent(".sel_branch").attr("commission");
            service.serviceAjax("/branch/bindServiceBranch", {
                "mobileNo": mobileNo,
                "branchNo": branchNo,
                "commission": commission
            }, function (data) {
                var code = data.status;
                if (code == "000000") {
                    appUtils.pageInit("account/selDepartment", "account/uploadPhoto");
                } else {
                    layerUtils.iMsg(-1, data.msg);
                }
            });
        });
    }

    function destroy() {
        service.destroy();
    }

    /* 初始化页面 */
    function initPage() {
        // 清理页面元素值
        getEvent(".sel_branch").text("请选择营业部");
        //  用户如果已选择了营业部，就不需要定位
        if (branchName && branchNo) {
            getEvent(".sel_branch").attr("branchcode", branchNo);
            getEvent(".sel_branch").html(branchName);
            getEvent(".sel_branch").attr("commission", commission);
            getBranch();  // 获取营业部List
        }
        else {
            getBranch();  // 获取营业部List
        }
    }

    //初始化显示营业部
    function initBranch() {
        var param = {"mobileNo": appUtils.getSStorageInfo("mobileNo")}
        param = utils.getParams(param);
        service.serviceAjax("/branch/getBranchInfo",param, function (data) {
            var code = data.status;
            if (code == "000000") {
                var branchNo = data.data.branchno;
                var branchName = data.data.branchname;
                var commission = commissionJsonEavl[parseInt(branchNo)];
                getEvent(".sel_branch").attr("branchcode", branchNo);
                getEvent(".sel_branch").attr("commission", commission);
                getEvent(".sel_branch").html(branchName);
                appUtils.setSStorageInfo("branchCode", branchNo);
                appUtils.setSStorageInfo("branchName", branchName);
                appUtils.setSStorageInfo("commission", commission);
            } else {
                layerUtils.iMsg(-1, data.msg);
            }
        });
    }

    /* 获取营业部List */
    function getBranch() {
        service.queryBranch({}, function (data) {
            var error_no = data.error_no;
            if (error_no == "0" && data.dsName) {
                var branchList = data.branchList;
                if (branchList) {
                    commsionListEavl(data)//获取所有佣金
                    var branchcode = "", branchname = "";
                    var branchUl = getEvent(".branch ul");
                    for (var j = 0; j < branchList.length; j++) {
                        branchcode = branchList[j].branchcode,
                            branchname = branchList[j].branchname;
                        if (branchcode != "9999" && branchcode != "1100") {//剔除总部
                            var branch = $("<li bid='" + branchcode + "'><span>" + branchname + "</span></li>");
                            branchUl.append(branch);
                        }

                        if (global.platform == "1" && branchcode == "1100") {
                            var dongDaStr = $("<li bid='" + branchcode + "'><span>" + branchname + "</span></li>");
                            branchUl.append(dongDaStr);
                        }
                    }
                    //点击营业部
                    bindBranch();
                }
                //查询客户是否与经纪人关联了，如果默认选择经纪人的营业部，否则默认显示自贸区营业部
                initBranch();
            }
            else {
                layerUtils.iMsg(-1, "营业部获取失败");  //提示错误信息
            }
        }, true, true, handleTimeout);
    }

    function commsionListEavl(data) {
        if (!jQuery.isEmptyObject(commissionJsonEavl)) {
            return;
        }
        var commissionList = data.commissionList;
        for (var i = 0; i < commissionList.length; i++) {
            commissionJsonEavl[commissionList[i].branchcode] = commissionList[i].commission;
        }
    }


    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            getBranch();  // 再次获取营业部
        });
    }

    /* 选中营业部事件绑定*/
    function bindBranch() {
        appUtils.bindEvent(getEvent(".branch ul li"), function (e) {
            var branchCode = $(this).attr("bid");
            $(this).addClass("active").siblings().removeClass("active");
            var branchName = $(this).text();  //当前选中营业部的值
            var commission = commissionJsonEavl[parseInt(branchCode)];
            getEvent(".sel_branch").attr("branchcode", branchCode);
            getEvent(".sel_branch").attr("commission", commission);
            getEvent(".sel_branch").text(branchName);	  //选中值赋给选择框
            appUtils.setSStorageInfo("branchCode", branchCode);
            appUtils.setSStorageInfo("branchName", branchName);
            appUtils.setSStorageInfo("commission", commission);
            getEvent(".branch").slideUp("fast");	//隐藏下拉框
            e.stopPropagation();	// 阻止冒泡
        });
    }


    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    /*暴露对外的接口*/
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});