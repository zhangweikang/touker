/**
 * 选择开户类型
 */
define("project/scripts/account/signProtocol", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        Map = require("map"),
        fristMap = null,  //  存放所有相关协议
        protocolArray = null,  // 存放协议签名值
        countProtocol = 0, // 计算签署成功的数量
        userId = appUtils.getSStorageInfo("userId"),
        cert_type = "zd",
        backAccount = "",
        _pageId = "#account_signProtocol",
        _pageLocation = "account/signProtocol";
    /* 私有业务模块的全局变量 end */

    function init() {
        layerUtils.iLoading(true);
        backAccount = appUtils.getSStorageInfo("backAccount");
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        clearCssStyle();

        utils.chechCertificate(getMarket,null,true);//检测证书是否存在
        showUserSignProtocol();//显示用户已选择账户
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            if (backAccount){
                appUtils.pageInit(_pageLocation, "account/openAccount", {backUrl:_pageLocation});
            } else {
                appUtils.pageInit(_pageLocation, "account/digitalCertificate");
            }
        });

        /* 隐藏按钮*/
        appUtils.bindEvent($(_pageId), function () {
            getEvent(".btn_bot").hide();
        });

        /* 绑定签署协议*/
        appUtils.bindEvent(getEvent(".rule_check01 .icon_check"), function () {
            $(this).toggleClass("checked"); //  切换勾选样式
        });

        /* 继续开户（下一步）*/
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn a"), function () {
            getSignProtocl();  // 获取签名值并验签
        });
    }

    function clearCssStyle(){
        if (backAccount){
            getEvent(".error_notice").show();
            getEvent(".step_box.top_step").hide();
        } else {
            getEvent(".error_notice").hide();
            getEvent(".step_box.top_step").show();
        }

        getEvent(".user_form.pt0 ul").html("");

        getEvent(".fix_bot .ct_btn a").html("下一步 >");  // 开户
    }

    function destroy() {
        service.destroy();
    }

    /* 获取市场列表 */
    function getMarket() {
        // 获取开通证券账户枚举
        service.queryDataDict({"enum_type": "zqzhlx"}, function (data) {
            if (data.error_no == 0 && data.results.length != 0) {
                var openAccountEnum = data.results;
                var ul = getEvent(".radio_list ul");
                for (var i = 0; i < openAccountEnum.length; i++) {
                    var itemValue = openAccountEnum[i].item_value;
                    var itemName = openAccountEnum[i].item_name;
                    //深B,沪B,不显示
                    if (itemValue != "2" && itemValue != "4") {
                        var other = $("<li><a href='javascript:;' class='icon_radio' id='selectAccount0" + i + "' value='" + itemValue + "'>" + itemName + "</a></li>");
                        ul.append(other);
                    }
                }
                initSelcet();  // 初始化证券账户的选择
            } else {
                layerUtils.iLoading(false);
                layerUtils.iAlert(data.error_info);
            }
        }, false, true, handleTimeout);
    }

    /* 默认所有的账号都开通 */
    function initSelcet() {
        // 账号绑定提醒事件，数据填充完毕才绑定事件
        appUtils.bindEvent(getEvent(".radio_list ul li a"), function (e) {
            confrimOpenAccount($(this));
            e.stopPropagation();
        });
        getAgreement();  // 获取协议
    }

    /* 获取协议 */
    function getAgreement() {
        // category_no 1.资金开户协议   2.证券账户开户协议
        service.queryProtocolList({"category_no": "1"}, function (data) {
            if (data.error_no == 0 && data.results.length != 0) {
                fristMap = new Map();
                var results = data.results;
                var protocolMap = null;
                var ul = getEvent(".rule_list ul");
                for (var i = 0; i < results.length; i++) {
                    protocolMap = new Map();
                    var econtractNo = results[i].econtract_no;
                    var econtractName = results[i].econtract_name;
                    var econtractMd5 = results[i].econtract_md5;
                    protocolMap.put("protocolid", econtractNo);	//协议id
                    protocolMap.put("protocolname", econtractName);	//协议名
                    protocolMap.put("summary", econtractMd5);	//协议内容MD5,签名摘要信息
                    var li = $("<li><a href='javascript:;' protocol-id='" + econtractNo + "' id='protocol0" + i + "'>《" + econtractName + "》</a></li>");
                    ul.append(li);
                    // 预绑定查看协议的事件
                    appUtils.preBindEvent(ul, "#protocol0" + i, function (e) {
                        appUtils.pageInit(_pageLocation, "account/showProtocol", {"protocol_id": $(this).attr("protocol-id")});
                        e.stopPropagation();
                    });
                    fristMap.put(i, protocolMap);
                }
            }
            else {
                layerUtils.iLoading(false);
                layerUtils.iAlert(data.error_info);
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            getMarket();  // 再次获取市场代码和协议
        });
    }

    /* 提示用户若不开通某账号将影响正常交易 */
    function confrimOpenAccount(obj) {
        if ($(obj).hasClass("checked")) {
            var accountName = $(obj).html();
            getEvent(".btn_bot h5").html("确定取消开立\"" + accountName + "\"账户？");
            getEvent(".btn_bot p").html("不开通\"" + accountName + "\"账户，将影响您该项正常交易<br>请您慎重选择");
            getEvent(".btn_bot").show();
            // 确定取消
            appUtils.bindEvent(getEvent(".btn_box a:eq(0)"), function (e) {
                $(obj).removeClass("checked");
                getEvent(".btn_bot").hide();
                e.stopPropagation();
            });
            // 继续开立
            appUtils.bindEvent(getEvent(".btn_box a:eq(1)"), function (e) {
                getEvent(".btn_bot").hide();
                e.stopPropagation();
            });
        } else {
            $(obj).addClass("checked");  // 选中当前开通账户
            if ($(obj).text() == "深基金") {
                getEvent(".radio_list:eq(0) ul li a[value='1']").removeClass("checked");
            } else if ($(obj).text() == "沪基金") {
                getEvent(".radio_list:eq(0) ul li a[value='3']").removeClass("checked");
            } else if ($(obj).text() == "深A") {
                getEvent(".radio_list:eq(0) ul li a[value='5']").removeClass("checked");
            } else if ($(obj).text() == "沪A") {
                getEvent(".radio_list:eq(0) ul li a[value='6']").removeClass("checked");
            }
        }
    }

    /* 获取签名值 */
    function getSignProtocl() {
        var keys = fristMap.keys();  // 协议的数量
        // 检查是否勾选开通的账户
        if (!getEvent(".radio_list a").hasClass("checked")) {
            layerUtils.iMsg(-1, "请选择需开通的账户！");
            return false;
        }
        // 检查是否勾选签署协议
        if (getEvent(".rule_check01 a").hasClass("checked")) {
            layerUtils.iLoading(true);  // 开启等待层。。。
            var oneData = fristMap.get(keys[countProtocol]); // 取出一个协议
            var protocolid = oneData.get("protocolid"); // 协议ID
            var protocolname = oneData.get("protocolname");  //协议名称
            var summary = oneData.get("summary");  // 协议内容MD5,签名摘要信息
            var signParam = {
                "medid": protocolid,
                "content": summary,
                "userId": appUtils.getSStorageInfo("userId"),
                "type": cert_type
            };
            // 获取协议的数字签名值

            var signParam = khmobile.sign(JSON.stringify(signParam));

            signParam ? signPluginCallback(signParam) : layerUtils.iLoading(false);countProtocol = 0;

            function signPluginCallback(signParam) {
                protocolArray = new Array();
                // 添加值到数组中
                var protocol = {
                    "protocol_id": protocolid,
                    "protocol_dcsign": signParam,
                    "summary": summary
                };
                protocolArray.push(protocol);
                countProtocol++;
                if (countProtocol < keys.length) { // 通过比较，获取每个协议的签名值
                    getSignProtocl();
                } else { // 获取完每个签名值后 进行验签
                    startSign();
                }
            }
        } else {
            layerUtils.iMsg(-1, "请阅读并勾选同意签署以上全部协议！");
            return false;
        }
    }

    /* 发请求进行协议验签 */
    function startSign() {
        countProtocol = 0;  // 将签署协议的计数器置为 0
        var signProtocolParam = {
            "user_id": appUtils.getSStorageInfo("userId"),
            "jsondata": JSON.stringify(protocolArray),
            "ipaddr": appUtils.getSStorageInfo("ip"),
            "macaddr": appUtils.getSStorageInfo("mac")
        };
        // 新开中登验签
        service.queryOpenCheckSign(signProtocolParam, callSign, false);
    }

    /* 验签回调函数*/
    function callSign(data) {
        // 如果有一个协议签署失败，就将签署结果设为 false
        if (data.error_no == 0) {
            openZjAccountAndClient();	//开立账户系统客户号和资金账户
        }
        else {
            layerUtils.iLoading(false);  // 关闭等待层。。。
            layerUtils.iAlert(data.error_info, -1);
        }
    }

    /* 开立账户系统客户号和资金账户 */
    function openZjAccountAndClient() {
        //开立账户系统客户号和资金账户
        var param = {"user_id": appUtils.getSStorageInfo("userId")};
        service.queryOpenAccount(param, function (data) {
            var error_no = data.error_no;
            var error_info = data.error_info;
            if (error_no == 0)	//调用成功
            {
                // 开立中登账户
                var openStockParam = {
                    "user_id": appUtils.getSStorageInfo("userId"),
                    "sza_str": "",  // 深A开通情况，不开传空 ，新开 1 ，转户 2
                    "sha_str": "",  //沪A开通情况
                    "szfnd_str": "",  // 深基金开通情况
                    "shfnd_str": "",  // 沪基金开通情况
                    "opfnd_str": ""  // 通用开发试基金
                };
                // 深 A 的开通状况
                if (getEvent(".radio_list ul li a[value='1']").hasClass("checked")) {
                    openStockParam.sza_str = appUtils.getSStorageInfo("openChannel") == "new" ? "1" : "2|";
                    if (getEvent(".radio_list ul li a[value='1']").attr("trdacct")) {
                        openStockParam.sza_str += getEvent(".radio_list ul li a[value='1']").attr("trdacct");
                    }
                }
                // 沪 A 的开通状况
                if (getEvent(".radio_list ul li a[value='3']").hasClass("checked")) {
                    openStockParam.sha_str = appUtils.getSStorageInfo("openChannel") == "new" ? "1" : "2|";
                    if (getEvent(".radio_list ul li a[value='3']").attr("trdacct")) {
                        openStockParam.sha_str += getEvent(".radio_list ul li a[value='3']").attr("trdacct");
                    }
                }
                // 深基金的开通状况
                if (getEvent(".radio_list ul li a[value='5']").hasClass("checked")) {
                    openStockParam.szfnd_str = "1";
                }
                // 沪基金的开通状况
                if (getEvent(".radio_list ul li a[value='6']").hasClass("checked")) {
                    openStockParam.shfnd_str = "1";
                }
                //开立中登股东账号
                service.queryOpenCompyAccount(openStockParam, function (data) {
                    if (data.error_no == 0) {
                        if (backAccount){
                            //驳回补全,跳转成功页面
                            utils.boHuiRedirect("account",_pageLocation,"backAccount");
                        } else {
                            var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
                            console.log("签署协议页面获取的tpbankFlg=" + tpbankFlg);
                            if (tpbankFlg == '001015') {
                                appUtils.pageInit(_pageLocation, "account/riskAssessment", {});  //跳转到问卷回访页面
                            } else {
                                appUtils.pageInit(_pageLocation, "account/setPwd", {});  //跳转设置密码页面
                            }
                        }
                    } else {
                        layerUtils.iLoading(false);
                        layerUtils.iAlert(data.error_info, -1);
                    }
                }, true);
            }
            else {
                layerUtils.iLoading(false);
                layerUtils.iAlert(error_info, -1);
            }
        }, false);
    }

    function showUserSignProtocol() {
        //获取用户是否已经开通股东户,默认选中用户之前选中的股东户
        var param = {"user_id": appUtils.getSStorageInfo("userId")};
        service.queryUserInfo(param, function (data) {
            var error_no = data.error_no;
            var error_info = data.error_info;
            if (error_no == 0) {
                var res = data.results[0];
                var shaselect = res.shaselect; //沪A是否选择 1 未选择   2 已选择
                var szaselect = res.szaselect; //深A是否选择 1 未选择   2 已选择
                var hacnselect = res.hacnselect; //沪基金 1 未选择   2 已选择
                var zacnselect = res.zacnselect; //深基金 1 未选择   2 已选择
                if (shaselect != "" || szaselect != "" || hacnselect != "" || zacnselect != "") {
                    getEvent(".radio_list ul li a").removeClass("checked");
                }

                getEvent(".radio_list ul li a[value='3']").addClass("checked");
                getEvent(".radio_list ul li a[value='1']").addClass("checked");

                if ("2" == shaselect) {
                    getEvent(".radio_list ul li a[value='3']").addClass("checked");
                    getEvent(".radio_list ul li a[value='6']").removeClass("checked");
                }
                if ("2" == szaselect) {
                    getEvent(".radio_list ul li a[value='1']").addClass("checked");
                    getEvent(".radio_list ul li a[value='5']").removeClass("checked");
                }
                if ("2" == hacnselect) {
                    getEvent(".radio_list ul li a[value='6']").addClass("checked");
                    getEvent(".radio_list ul li a[value='3']").removeClass("checked");
                }
                if ("2" == zacnselect) {
                    getEvent(".radio_list ul li a[value='5']").addClass("checked");
                    getEvent(".radio_list ul li a[value='1']").removeClass("checked");
                }
            } else {
                layerUtils.iMsg(-1, error_info);
            }
        },true,true);
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