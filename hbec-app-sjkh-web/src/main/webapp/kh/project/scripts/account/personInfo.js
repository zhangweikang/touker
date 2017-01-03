/**
 * 填写个人信息
 */
define("project/scripts/account/personInfo", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        manId = "",
        womenId = "",
        validatorUtil = require("validatorUtil"),
        idCardModify = false,  // 身份证是否被手工修改
        backUrl = "",
        certUploadState = "",
        _pageId = "#account_personInfo";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        cleanPageElement();  // 清除页面元素

        //  从上传照片页面进入
        if (appUtils.getSStorageInfo("_prePageCode") == "account/uploadPhoto" || appUtils.getSStorageInfo("_prePageCode") == "account/uploadPhotoChange") {
            backUrl = appUtils.getPageParam("backUrl");
            // 根据传入的值，填充页面的数据
            getEvent(".name").val(appUtils.getPageParam("custname"));	  // 客户姓名
            getEvent(".idCardNo").val(appUtils.getPageParam("idno"));	 // 身份证号
            getEvent(".signDepartment").val(appUtils.getPageParam("policeorg"));	// 签发机关
            getEvent(".idCardAddress").val(appUtils.getPageParam("natives"));	// 证件地址
            getEvent(".address").val(appUtils.getPageParam("natives"));	// 联系地址和证件地址设置相同的
            getEvent(".idBeginDate").val(appUtils.getPageParam("idbegindate"));  //起始期限
            getEvent(".idEndDate").val(appUtils.getPageParam("idenddate"));  //结束期限

            // 如果是由新开流程跳转到转户流程， 并且有设置过学历和职业，那么初始化页面时,
            // 职业和学历和上次的选择保持不变
            var photosInfo = appUtils.getSStorageInfo("photosInfo");
            if (appUtils.getSStorageInfo("photosInfo") != null) {
                photosInfo = JSON.parse(photosInfo);
            }
            if (appUtils.getPageParam("postid") != null && appUtils.getPageParam("postid") != "") {
                getEvent(".zipCode").val(appUtils.getPageParam("postid"));  //邮编
            }
            // 显示之前所选职业
            if (photosInfo != null && photosInfo.isChangeProcess == "true" && photosInfo.fillInformationInParam.occupation.text != "请选择职业") {
                getEvent(".selectOccupation").text(photosInfo.fillInformationInParam.occupation.text);
                getEvent(".selectOccupation").attr("value", photosInfo.fillInformationInParam.occupation.value);
            }
            // 显示之前所选学历
            if (photosInfo != null && photosInfo.isChangeProcess == "true" && photosInfo.fillInformationInParam.degree.text != "请选择学历") {
                getEvent(".selectDegree").text(photosInfo.fillInformationInParam.degree.text);
                getEvent(".selectDegree").attr("value", photosInfo.fillInformationInParam.degree.value);
            }
        } else {
            var encodeParam = {"id": appUtils.getSStorageInfo('userId')};

            /*encodeParam = utils.getParams(encodeParam);*/
            encodePluginCallback(encodeParam);
            function encodePluginCallback(paramData) {
                service.serviceAjax("/touker/getCertInfo", paramData, function (data) {
                    var code = data.status;
                    var obj = data.data;
                    if (code == "000000") {
                        getEvent(".name").val(obj.custname);	  // 客户姓名
                        getEvent(".idCardNo").val(obj.idno);	 // 身份证号
                        getEvent(".signDepartment").val(obj.policeorg);	// 签发机关
                        getEvent(".idCardAddress").val(obj.natives);	// 证件地址
                        getEvent(".address").val(obj.natives);	 // 联系地址和证件地址设置相同的
                        if (obj.postid != null && obj.postid != "") {
                            getEvent(".zipCode").val(obj.postid);  //邮编
                        }
                        getEvent(".idBeginDate").val(obj.idbegindate);  // 证件开始日期
                        getEvent(".idEndDate").val(obj.idenddate);  // 证件结束日期

                        appUtils.setSStorageInfo("edu", obj.edu);//职业
                        appUtils.setSStorageInfo("professionCode", obj.professionCode);//学历

                        certUploadState = obj.certUploadState;
                    } else {
                        layerUtils.iMsg("-1", data.msg);
                    }
                });
            }
        }
        queryDataDict();  // 获取职业和学历列表
    }

    function bindPageEvent() {
        /* 绑定返回 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
            if (backUrl != "") {
                appUtils.pageInit("account/personInfo", backUrl);
            } else {
                if ((tpbankFlg == "1" || tpbankFlg == "2")) {
                    if ("2" == certUploadState) {
                        //已开通三方存管或者三方支付,并且在钱钱中打开回到第一个页面
                        if (appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app")
                            appUtils.pageInit("account/personInfo", "account/openAccount", {backUrl: "account/personInfo"});
                        else
                            appUtils.pageInit("account/personInfo", "account/phoneNumberVerify", {backUrl: "account/personInfo"});
                    } else {
                        appUtils.pageInit("account/personInfo", "account/uploadPhoto", {});
                    }
                } else {
                    appUtils.pageInit("account/personInfo", "account/uploadPhoto", {});
                }
            }
        });

        /* 点击页面其他元素隐藏下拉列表 */
        appUtils.bindEvent($(_pageId), function (e) {
            // 隐藏下拉列表
            getEvent(".sel_list").slideUp("fast", function () {
                $("body #bodyContent").css("overflow", "auto");
            });
            e.stopPropagation();	// 阻止冒泡
        });

        /* 选择职业 */
        appUtils.bindEvent(getEvent(".selectOccupation"), function (e) {
            getEvent(".job ul li").removeClass("active");
            // 显示选择职业的下拉列表
            getEvent(".sel_list:eq(0)").slideDown("fast", function () {
                $("body #bodyContent").css("overflow", "hidden");
            });
            e.stopPropagation();	// 阻止冒泡
        });

        /* 选择学历 */
        appUtils.bindEvent(getEvent(".selectDegree"), function (e) {
            getEvent(".education ul li").removeClass("active");
            // 显示选择学历的下拉列表
            getEvent(".sel_list:eq(1)").slideDown("fast", function () {
                $("body #bodyContent").css("overflow", "hidden");
            });
            e.stopPropagation(); // 阻止冒泡
        });

        /* 限制名字的长度 */
        appUtils.bindEvent(getEvent(".name"), function () {
            utils.dealIPhoneMaxLength(this, 8);  //处理iphone兼容
        }, "input");

        /* 限制身份证的长度 */
        appUtils.bindEvent(getEvent(".idCardNo"), function () {
            utils.dealIPhoneMaxLength(this, 18);  //处理iphone兼容
        }, "input");

        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            if (verifyInfo())  // 校验数据
            {
                submitInfo();  //提交用户信息
            }
        });
    }

    /* 处理返回按钮 */
    function pageBack() {
        var currentStep = appUtils.getSStorageInfo("currentStep");
        // 当前完成步骤为：已成功上传身份证 或者 由视频返回到资料提交页，处理返回按钮
        if (appUtils.getSStorageInfo("personInfo") == "exist" || currentStep == "uploadimg") {
            appUtils.setSStorageInfo("currentStep", "uploadimg");
            appUtils.setSStorageInfo("idInfo", "exist");  // 标记用户完成照片上传
            appUtils.pageInit("account/personInfo", "account/uploadPhoto", {});
        } else {// 正常开户处理返回按钮
            var message = appUtils.getSStorageInfo("message");
            if (message == '4') {		//如果是已经在投客网上传过身份证
                appUtils.setSStorageInfo("currentStep", "uploadimg");
                appUtils.setSStorageInfo("idInfo", "");  //
            }
            appUtils.pageInit("account/personInfo", "account/uploadPhoto", {});
        }
    }

    function destroy() {
        service.destroy();
    }

    /*提交开户信息*/
    function submitInfo() {
        //绑定三方存管或者三方支付标志     1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	0：未绑定三方存管和三方支付
        var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
        var idno = getEvent(".idCardNo").val();  // 身份证号
        //先进行预处理（清除之前占用了该身份证号的客户的数据信息）
        var khh = appUtils.getSStorageInfo("khh");
        var paramCert = {"userId": appUtils.getSStorageInfo("userId"), "idno": idno};

        //先提交思迪，判读是否需要删除占用者客户数据信息
        /*paramCert = utils.getParams(paramCert);*/
        toukerServerPluginCallback(paramCert);
        function toukerServerPluginCallback(returnData) {
            service.serviceAjax("/touker/clearUnSubmitUserInfo", returnData, function (data) {
                var code = data.status;
                if (code != "000000") {
                    layerUtils.iMsg("-1", data.msg);
                    return;
                }
                // 开户信息资料提交
                var param = setSubmitDataParam();
                service.submitUserInfo(param, function (data) {
                    var error_no = data.error_no;
                    var error_info = data.error_info;
                    if (error_no == 0) {
                        //新开，则走新开流程
                        if (tpbankFlg == '001017' || tpbankFlg == '001015') {
                            // 跳转到验证交易密码
                            console.log("跳转到密码验证页面");
                            appUtils.pageInit("account/personInfo", "account/pwdVerify", {"backUrl": "account/personInfo"});
                        } else {
                            appUtils.pageInit("account/personInfo", "account/videoNotice", {});
                        }
                    } else {
                        layerUtils.iLoading(false);
                        layerUtils.iAlert(error_info);  // 填写资料失败，弹出提示
                    }
                }, false);
            });
        }
    }

    /* 根据身份证号进行判断性别: 倒数第二位数字，偶数为女，基数为男 */
    function checkSexId(idno) {
        var value = idno.charAt(idno.length - 2); // 身份证倒数第二位数字
        var isnum = value % 2;
        var sexid = "";
        if (isnum == 0) // 偶为 女
        {
            sexid = womenId;
        }
        else // 奇为男
        {
            sexid = manId;
        }
        return sexid;
    }

    /* 获取用户信息*/
    function setSubmitDataParam() {
        var idno = getEvent(".idCardNo").val().replace(/\s*/g, "");  // 身份证号
        // 判断性别，根据身份证传入男或女，也可以通过身份证号进行判断
        var sexId = checkSexId(idno); // 根据身份证判断性别
        return {
            "userId": appUtils.getSStorageInfo("userId"),
            "infocolect_channel": iBrowser.pc ? 0 : 3, // 信息来源渠道 0：PC  3：手机
            "idtype": "00", // 证件类别，数据字典中定义的是 00
            "idno": idno,  // 身份证号
            "ethnicname": appUtils.getSStorageInfo("ethnic"), // 民族
            "custname": getEvent(".name").val(),
            "birthday": getEvent(".idCardNo").attr("birthday"),  // 身份证修改了，出生日期也要修改
            "idbegindate": getEvent(".idBeginDate").val(),  // 证件开始日期
            "idenddate": getEvent(".idEndDate").val(),  // 证件结束日期
            "natives": getEvent(".idCardAddress").val().replace(/\s+/g, ""),  // 证件地址
            "policeorg": getEvent(".signDepartment").val(),  // 签发机关
            "usersex": sexId,  // 用户性别，男 0 女 1
            "nationality": "156",  // 屏蔽，待解决  // 国籍地区，必须写 156
            "addr": getEvent(".address").val().replace(/\s+/g, ""),  // 联系地址
            "postid": getEvent(".zipCode").val(),  // 邮政编码
            "edu": getEvent(".selectDegree").val(),  // 学历代码
            "recommendno": getEvent(".input_form .reference").val(),  //推荐人号码
            "profession_code": getEvent(".selectOccupation").val(),  // 职业代码
            "branchno": appUtils.getSStorageInfo("branchCode"),   // 营业部代码
            "commission": appUtils.getSStorageInfo("commission"),  // 营业部代码佣金代码
            "provinceno": "",  // 省份代码, 屏蔽, 待解决
            "cityno": "",  // 城市代码
            "ipaddr": appUtils.getSStorageInfo("ip"),  // ip 地址，在获取 短信验证码 的时候，就已经把 ip 和 mac 保存到 session 里面了
            "macaddr": appUtils.getSStorageInfo("mac"),  // mac 地址
            "idcardmodify": idCardModify ? 1 : 0  // 身份证是否被手动修改，被修改传 1 ，否则传 0
        };
    }

    /* 获取职业、学历、性别列表*/
    function queryDataDict() {
        // 获取职业
        var profession_code = appUtils.getSStorageInfo("professionCode");  // 获取session中的职业
        var occupationalParam = {"enum_type": "occupational"};
        service.queryDataDict(occupationalParam, function (data) {
            var error_no = data.error_no,
                error_info = data.error_info;
            getEvent(".sel_list:eq(0) ul").html("");  // 首先清空数据
            if (error_no == "0" && data.results.length != 0) {
                var occupational = data.results;
                var ul = getEvent(".sel_list:eq(0) ul");
                for (var i = 0; i < occupational.length; i++) {
                    var li = $("<li><span class='occupation0" + i + "' value='" + occupational[i].item_value + "'>" + occupational[i].item_name + "</span></li>");
                    ul.append(li);
                    if (profession_code != "" && occupational[i].item_value == profession_code) {
                        getEvent(".selectOccupation").text(occupational[i].item_name);
                        getEvent(".selectOccupation").val(occupational[i].item_value);
                    }
                    BindSelectOccupation(i);	 // 预绑定选择职业的事件
                }
                queryAdapter();  // 再获取学历
            }
            else {
                layerUtils.iLoading(false);
                layerUtils.iMsg(-1, error_info);  // 提示错误信息
            }
        }, false, true, handleTimeout);
    }

    /* 获取学历 */
    function queryAdapter() {
        var edu = appUtils.getSStorageInfo("edu");  // 获取session中的学历
        var adapterParam = {"enum_type": "adapter"};
        service.queryDataDict(adapterParam, function (data) {
            var error_no = data.error_no,
                error_info = data.error_info;
            getEvent(".sel_list:eq(1) ul").html("");  // 首先清空数据
            if (error_no == "0" && data.results.length != 0) {
                var adapter = data.results;
                var ul = getEvent(".sel_list:eq(1) ul");
                for (var i = 0; i < adapter.length; i++) {
                    var li = $("<li><span class='degree0" + i + "' value='" + adapter[i].item_value + "'>" + adapter[i].item_name + "</span></li>");
                    ul.append(li);
                    if (edu != "" && adapter[i].item_value == edu) {
                        getEvent(".selectDegree").text(adapter[i].item_name);
                        getEvent(".selectDegree").val(adapter[i].item_value);
                    }
                    BindSelectDegree(i);  // 预绑定选择学历的事件
                }
                querySex();  // 获取性别
            }
            else {
                layerUtils.iLoading(false);
                layerUtils.iMsg(-1, error_info);  // 提示错误信息
            }
        }, false, true, handleTimeout);
    }

    /* 获取性别 */
    function querySex() {
        var sexParam = {"enum_type": "sex"};
        service.queryDataDict(sexParam, function (data) {
            var error_no = data.error_no,
                error_info = data.error_info;
            if (error_no == "0" && data.results.length != 0) {
                var sex = data.results;
                var sexvalue = "";
                for (var i = 0; i < sex.length; i++) {
                    sexvalue = sex[i].item_name;
                    if (sexvalue == "男") {
                        manId = sex[i].item_value;
                    }
                    if (sexvalue == "女") {
                        womenId = sex[i].item_value;
                    }
                }
            }
            else {
                layerUtils.iMsg(-1, error_info);  // 提示错误信息
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            queryDataDict();  // 再次获取职业和学历
        });
    }

    /* 预绑定选择职业的事件 */
    function BindSelectOccupation(i) {
        appUtils.bindEvent(getEvent(".sel_list:eq(0) ul .occupation0" + i), function (e) {
            getEvent(".selectOccupation").attr("value", getEvent(".occupation0" + i).attr("value"));
            $(this).parent().addClass("active").siblings().removeClass("active");
            var check_val = getEvent(".occupation0" + i).text();
            getEvent(".selectOccupation").text(check_val);
            getEvent(".sel_list:eq(0)").slideUp("fast", function () {
                $("body #bodyContent").css("overflow", "auto");
            });
            e.stopPropagation();	// 阻止冒泡
        });
    }

    /*  预绑定选择学历的事件 */
    function BindSelectDegree(i) {
        appUtils.bindEvent(getEvent(".sel_list:eq(1) ul .degree0" + i), function (e) {
            // strong 不能用 val() 方法设置 value ，用的话无效
            getEvent(".selectDegree").attr("value", getEvent(".degree0" + i).attr("value"));
            $(this).parent().addClass("active").siblings().removeClass("active");
            var check_val = getEvent(".degree0" + i).text();
            getEvent(".selectDegree").text(check_val);
            getEvent(".sel_list:eq(1)").slideUp("fast", function () {
                $("body #bodyContent").css("overflow", "auto");
            });
            e.stopPropagation();  // 阻止冒泡
        });
    }

    /* 信息提交校验 */
    function verifyInfo() {
        var name = getEvent(".user_form .name").val();	//姓名
        var idCardNo = getEvent(".user_form .idCardNo").val();	//身份证
        var signDepartment = getEvent(".user_form .signDepartment").val();  //签发机关
        var idCardAddress = getEvent(".user_form .idCardAddress").val();  //证件地址
        var address = getEvent(".user_form .address").val();  //联系地址
        var idBeginDate = getEvent(".user_form .idBeginDate").val();  //起始期限
        var idEndDate = getEvent(".user_form .idEndDate").val();  //结束期限
        var zipCode = getEvent(".user_form .zipCode").val();  //邮编
        var selectOccupation = getEvent(".input_form .selectOccupation").text();  //职业
        var selectDegree = getEvent(".input_form .selectDegree").text();  //学历
        if (!name) {
            layerUtils.iMsg(-1, "姓名不能为空");
            return false;
        }
        if (!idCardNo) {
            layerUtils.iMsg(-1, "身份证不能为空");
            return false;
        }
        if (!signDepartment) {
            layerUtils.iMsg(-1, "签发机关不能为空");
            return false;
        }
        if (!idCardAddress) {
            layerUtils.iMsg(-1, "证件地址不能为空");
            return false;
        }
        if (!address) {
            layerUtils.iMsg(-1, "联系地址不能为空");
            return false;
        }
        if (!idBeginDate) {
            layerUtils.iMsg(-1, "身份证起始期限不能为空");
            return false;
        }
        if (!idEndDate) {
            layerUtils.iMsg(-1, "身份证结束期限不能为空");
            return false;
        }
        if (!zipCode) {
            layerUtils.iMsg(-1, "邮编不能为空");
            return false;
        }
        if (!require("validatorUtil").isPostalCode(zipCode)) {
            layerUtils.iMsg(-1, "邮编格式不正确,请重新输入");
            return false;
        }
        if (selectOccupation == "请选择职业") {
            layerUtils.iMsg(-1, "职业不能为空");
            return false;
        }
        if (selectDegree == "请选择学历") {
            layerUtils.iMsg(-1, "学历不能为空");
            return false;
        }
        // 发送身份证存在性检查之前，前端验证身份证的格式
        if (!validatorUtil.isCardID(idCardNo)) {
            layerUtils.iMsg(-1, "请输入正确的身份证号码!");
            return false;
        }
        // 对不满 18 周岁进行控制
        if (idCardNo.length == 18) {
            var dateStr = idCardNo.substring(6, 10) + "/" + idCardNo.substring(10, 12) + "/" + idCardNo.substring(12, 14),
                userAge = new Date().getTime() - Date.parse(dateStr);
            userAge = userAge / (365 * 24 * 60 * 60 * 1000);
            if (parseInt(userAge) < 18) {
                layerUtils.iAlert("您的年龄未满 18 周岁，不允许开户!", -1);
                return false;
            }
        }

        var pageInIdCardNo = appUtils.getPageParam("idno")?appUtils.getPageParam("idno"):appUtils.getSStorageInfo("idCardNo");

        var countDiffe = 0;  // 计算身份证修改的位数
        for (var i = 0; i < idCardNo.length; i++) {
            var oneIdNo = idCardNo.charAt(i),
                oneInIdNo = pageInIdCardNo.charAt(i);
            if (oneIdNo != oneInIdNo) {
                countDiffe++;
            }
        }
        // 如果被修改的位数不等于 0 ，countDiffe 为 true
        idCardModify = countDiffe != 0;
        if (countDiffe > 5) {
            utils.layerTwoButton("您好,发现您的证件号码与上传的差异过大，请您确认是否需要更换身份证?", "重新上传身份证", "重新确认身份证", function () {
                appUtils.pageInit("account/personInfo", "account/uploadPhoto", {});
            }, function () {
                return false;
            });
            return false;
        }
        // 设置出生日期
        getEvent(".idCardNo").attr("birthday", idCardNo.substring(6, 10) + "-" + idCardNo.substring(10, 12) + "-" + idCardNo.substring(12, 14));
        return true;
    }

    /* 初始化邮编,职业,学历*/
    function cleanPageElement() {
        getEvent(".zipCode").val(200000);  //邮编
        getEvent(".selectOccupation").html("行政事业单位工人");  //清理职业
        getEvent(".selectDegree").html("学士");  //清理学历
        if (getEvent(".selectOccupation").text() == "行政事业单位工人" && getEvent(".selectDegree").text() == "学士") {
            getEvent(".selectDegree").val(3);  // 学历代码
            getEvent(".selectOccupation").val(4);  // 职业代码
        }
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "pageBack": pageBack,
        "destroy": destroy
    };
});