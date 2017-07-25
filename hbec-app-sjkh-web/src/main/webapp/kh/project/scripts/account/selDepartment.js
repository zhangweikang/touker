/**
 * 选择营业部
 */
define("project/scripts/account/selDepartment", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        shellPlugin = require("shellPlugin"),
        utils = require("utils"),
        branchList = "",  //营业部
        commissionList = "",  //佣金套餐
        localPro = "",  // 本地省份
        localCity = "",  // 本地城市
        localBranch = "",  // 本地营业部
        branchParam = {
            "branchno": "",
            "commission": ""
        },  //营业部编号
        hasbranch = true,  // 判断定位的城市是否拥有营业部
        _pageId = "#account_selDepartment";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        // 初始化页面
        initPage();
        //查询客户是否与经纪人关联了，如果默认选择经纪人的营业部，否则默认显示自贸区营业部
        initBranch();
    }

    //初始化显示营业部
    function initBranch() {
        var param = {mobileNo:appUtils.getSStorageInfo("mobileNo")};
        service.serviceAjax("/branch/getBranchInfo",param,function(data){
            var code = data.status;
            if (code == "000000") {
                var branchNo = data.data.branchno;
                var branchName = data.data.branchname;
                branchParam.branchno = branchNo;
                getEvent(".sel_branch").html(branchName);
            } else {
                layerUtils.iMsg(-1, data.msg);
            }
        });
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            appUtils.setSStorageInfo("backmsg", 1);
            var backUrl = appUtils.getPageParam("backUrl");
            if (backUrl) {
                appUtils.pageInit("account/selDepartment", appUtils.getPageParam("backUrl"), {"backUrl": "account/selDepartment"});
            } else if (appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app") {// 返回到钱钱炒股App，三分钟快速开户界面
                appUtils.pageInit("account/selDepartment", "account/openAccount", {"backUrl": "account/selDepartment"});
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
            getEvent(".province").hide();  //隐藏省份列表
            getEvent(".city").hide();  //隐藏城市列表
            getEvent(".commission").hide();  //隐藏佣金列表
            getEvent(".branch ul li").removeClass("active");
            getEvent(".branch").slideToggle("fast");	// 显示选择营业厅的下拉列表
            e.stopPropagation();	// 阻止冒泡
        });
        /* 绑定选择佣金套餐 */
        appUtils.bindEvent(getEvent(".mobile_form .sel_commission"), function (e) {
            getEvent(".province").hide();  //隐藏省份列表
            getEvent(".city").hide();  //隐藏城市列表
            getEvent(".branch").hide();  //隐藏营业部列表
            getEvent(".commission ul li").removeClass("active");
            getEvent(".commission").slideToggle("fast");	// 显示选择营业厅的下拉列表
            e.stopPropagation();	// 阻止冒泡
        });

        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {

            var branch_name = getEvent(".mobile_form .sel_branch").text();
            appUtils.setSStorageInfo("branchno", branchParam.branchno);  // 营业部id保存在session
            appUtils.setSStorageInfo("commission", branchParam.commission);  // 佣金保存在session
            if (branch_name == "请选择营业部") {
                layerUtils.iMsg(-1, "请选择开户营业部");
                return false;
            }

            //向后台发送服务营业部
            sendServiceBranch();
        });
    }

    //记录客户的服务营业部
    function sendServiceBranch() {
        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            //向后台发送服务营业部
            var params = {"mobileNo":appUtils.getSStorageInfo("mobileNo"),
                "branchNo":branchParam.branchno};
            service.serviceAjax("/branch/bindServiceBranch", params, function (data) {
                var code = data.status;
                if (code == "000000") {
                    appUtils.pageInit("account/selDepartment", "account/uploadPhoto", branchParam);
                    // 清除完成身份证上传步骤标记
                    appUtils.clearSStorage("idInfo");
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
        cleanPageElement(); // 清理页面元素值
        var Commission = appUtils.getSStorageInfo("commission");  // 用户已选佣金id
        var Commission_name = appUtils.getSStorageInfo("commissionname");  // 用户已选佣金值
        var Branch_no = appUtils.getSStorageInfo("branchno"); // 用户已选营业部id
        var Branch_name = appUtils.getSStorageInfo("branchname");  // 用户已选营业部名称
        var Province_name = appUtils.getSStorageInfo("provincename");  // 用户已选省份
        var City_name = appUtils.getSStorageInfo("cityname");  // 用户已选城市

        //  用户如果已选择了营业部，就不需要定位
        if (Province_name && City_name && Branch_name && Branch_no) {
            hasbranch = true;
            localPro = Province_name;
            localCity = City_name;
            localBranch = Branch_name;
            branchParam.branchno = Branch_no;
            getEvent(".sel_province").html(Province_name);
            getEvent(".sel_city").html(City_name);
            getEvent(".sel_branch").html(Branch_name);
            if (Commission) {
                branchParam.commission = Commission;
                getEvent(".sel_commission").html(Commission_name);
            }
            getBranch();  // 获取营业部List
        }
        else {
            getBranch();  // 获取营业部List
        }
    }

    /* 获取营业部List */
    function getBranch() {
        service.queryBranch({}, function (data) {
            var error_no = data.error_no;
            var error_info = data.error_info;
            if (error_no == "0" && data.dsName) {
                branchList = data.branchList;	//营业部集合
                commissionList = data.commissionList;	//佣金集合
                var blen = branchList.length;
                // 填充定位城市下的所有营业部名称
                if (blen != "") {
                    var branch_str = "", cno = "", branchcode = "", branchname = "";
                    var dongDaStr = "";//东大营业部标签
                    for (var j = 0; j < blen; j++) {
                        cno = branchList[j].cityno;
                        branchcode = branchList[j].branchcode,
                            branchname = branchList[j].branchname;
                        if (branchcode != "9999" && branchcode != "1100") {//剔除总部
                            branch_str += "<li bid='" + branchcode + "'><span>" + branchname + "</span></li>";
                        }

                        if (branchcode == "1100") {
                            dongDaStr = "<li bid='" + branchcode + "'><span>" + branchname + "</span></li>";
                        }
                    }
                    //当用户不在钱钱炒股里面时,显示东大路营业部选项
                    if (appUtils.getSStorageInfo("toukerOpenChannel") != "qianqian_app") {
                        branch_str = branch_str + dongDaStr;
                    }
                    getEvent(".branch ul").html(branch_str);  // 填充对应城市的营业部
                    bindBranch();  //点击营业部
                }

            }
            else {
                layerUtils.iMsg(-1, "营业部获取失败");  //提示错误信息
            }
        }, true, true, handleTimeout);
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
            var bid = $(this).attr("bid");
            $(this).addClass("active").siblings().removeClass("active");
            branchParam.branchno = bid;
            var branchname = $(this).text();  //当前选中营业部的值
            getEvent(".sel_branch").attr("branchcode", bid);
            getEvent(".sel_branch").text(branchname);	  //选中值赋给选择框
            appUtils.setSStorageInfo("branchname", branchname);
            getEvent(".branch").slideUp("fast");	//隐藏下拉框
            // 选中营业部立即填充对应的佣金套餐
            var branchcode = "";  //营业部ID
            var commission_str = "";
            for (var i = 0; i < commissionList.length; i++) {
                branchcode = commissionList[i].branchcode;
                commission = commissionList[i].commission;
                sortno = commissionList[i].sortno;
                if (bid == branchcode) {
                    branchParam.commission = commission;
                    commission_str += "<li yid='" + sortno + "'><span>" + commission + "</span></li>";
                }
            }
            getEvent(".sel_commission").text(branchParam.commission);
            getEvent(".commission ul").html(commission_str);  //填充佣金套餐下拉框
            e.stopPropagation();	// 阻止冒泡
            bindCommission();  //点击佣金套餐
        });
    }

    /* 选中佣金事件绑定*/
    function bindCommission() {
        appUtils.bindEvent(getEvent(".commission ul li"), function (e) {
            var yid = $(this).attr("yid");
            $(this).addClass("active").siblings().removeClass("active");
            branchParam.commission = yid;
            var commissionname = $(this).text();  //当前选中的佣金值
            getEvent(".sel_commission").attr("commissionname", yid);
            getEvent(".sel_commission").text(commissionname);	  //选中值赋给选择框
            appUtils.setSStorageInfo("commissionname", commissionname);
            getEvent(".commission").slideUp("fast");	//隐藏下拉框
            e.stopPropagation();	// 阻止冒泡
        });
    }

    /* 清理界面元素 */
    function cleanPageElement() {
        hasbranch = false;
        getEvent(".sel_province").text("请选择省份");
        getEvent(".sel_city").text("请选择城市");
        getEvent(".sel_branch").text("请选择营业部");
        getEvent(".sel_commssion").text("请选择佣金套餐");
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId+" " + event);
    }

    /*暴露对外的接口*/
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});