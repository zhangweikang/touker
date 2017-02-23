/**
 * 上传身份证照片
 */
define("project/scripts/account/uploadPhoto", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        global = require("gconfig").global,
        _pageId = "#account_uploadPhoto",
    // 填写资料的页面入参，属性由 imgState 方法赋值
        fillInformationInParam = {
            "idno": "",	// 身份证号
            "custname": "",	// 客户姓名
            "ethnicname": "",	// 民族
            "native": "",		// 证件地址
            "policeorg": "",	// 签发机关
            "birthday": "",	// 出生日期
            "idbegindate": "",	// 证件开始日期
            "idenddate": "",	// 证件结束日期
            "gender": "",	// 用户性别
            "imgPath": "",  // 图片的显示地址
            "imgId": "", // 图片 id
            "branchno": "", //营业部Id
            "commission": "",  //佣金套餐
            "postid": "",  //邮编
            "backUrl": ""
        };
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        window.imgState = imgState;  // 照片上传完成后自动调用该方法

        cleanPageElement();  // 清理页面元素

        queryCertAgreement();  // 获取中登证书协议

        displayPhoto();//显示用户已上传的证件图片

        fillInformationInParam.branchno = appUtils.getSStorageInfo("branchCode");
        fillInformationInParam.commission = appUtils.getSStorageInfo("commission");
        fillInformationInParam.user_id = appUtils.getSStorageInfo("userId");
        fillInformationInParam.infocolect_channel = iBrowser.pc ? 0 : 3;  //信息来源渠道 0：PC  3：手机
        fillInformationInParam.idtype = "00";
        fillInformationInParam.idcardmodify = "0";
        fillInformationInParam.nationality = "156";
        fillInformationInParam.edu = "";
        fillInformationInParam.profession_code = "";
        fillInformationInParam.recommendno = "";
        fillInformationInParam.ipaddr = appUtils.getSStorageInfo("ip");
        fillInformationInParam.macaddr = appUtils.getSStorageInfo("mac");
    }

    function bindPageEvent() {
        /* 点击页面隐藏按钮 */
        appUtils.bindEvent($(_pageId), function () {
            displayNoneCss();
        });

        /* 绑定返回 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            //钱钱炒股在上传身份页面返回   关闭证券开户  回到钱钱炒股
            var khh = appUtils.getSStorageInfo("khh");//如果客户号不为空，则一定已经选择了营业部，这里不能再让客户返回到选择营业部页面重新选择
            if (null != khh && khh != '') {
                if (global.openChannel == "1") {
                    appUtils.pageInit("account/personInfo", "account/openAccount", {backUrl: "account/uploadPhoto"});
                } else {
                    appUtils.pageInit("account/uploadPhoto", "account/phoneNumberVerify", {backUrl: "account/uploadPhoto"});
                }
            } else {
                appUtils.pageInit("account/uploadPhoto", "account/selDepartment", {});
            }
        });

        /* 绑定上传正面身份证照 */
        appUtils.bindEvent(getEvent(".upload_main .positive"), function (e) {
            checkedCss($(this), "上传身份证正面");
            e.stopPropagation();  // 阻止冒泡
        });

        /* 绑定上传反面身份证照 */
        appUtils.bindEvent(getEvent(".upload_main .negative"), function (e) {
            checkedCss($(this), "上传身份证反面");
            e.stopPropagation();  // 阻止冒泡
        });

        /* 点击相册 */
        appUtils.bindEvent(getEvent(".upload_btn li:eq(0)"), function (e) {
            // 相册上传的参数
            var phoneConfig = {
                "funcNo": $(this).attr("mediaId") == "3" ? "501526" : "501525",
                "uuid": "index",
                "r": Math.random(),
                "user_id": appUtils.getSStorageInfo("userId"),
                "phototype": $(this).attr("mediaId") == "3" ? "人像正面" : "身份证",	// 影像名称
                "action": "phone",	// 照片来源类别，phone 相册，pai 相机
                "img_type": $(this).attr("mediaId"),
                "key": "index",	// key 和 uuid 只需要写一个
                "url": global.serverPath,
                "clientinfo": appUtils.getSStorageInfo("clientinfo"),	 // 从 session 中将 clientinfo 取出
                "jsessionid": appUtils.getSStorageInfo("jsessionid") // 从 session 中将 jsessionid 取出
            };

            if (utils.isAndroid()) {
                khmobile.carmeraPhotoUpload(JSON.stringify(phoneConfig));
            } else {
                require("shellPlugin").callShellMethod("carmeraPlugin", null, null, phoneConfig);
            }

            displayNoneCss();
            e.stopPropagation();  // 阻止冒泡
        });

        /* 点击拍照 */
        appUtils.bindEvent(getEvent(".upload_btn li:eq(1)"), function (e) {
            // 相机上传的参数
            var paiConfig = {
                "funcNo": $(this).attr("mediaId") == "3" ? "501526" : "501525",
                "uuid": "index",
                "r": Math.random(),
                "user_id": appUtils.getSStorageInfo("userId"),
                "phototype": $(this).attr("mediaId") == "3" ? "人像正面" : "身份证",	// 影像名称
                "action": "pai",	// 照片来源类别，phone 相册，pai 相机
                "img_type": $(this).attr("mediaId"),
                "key": "index",	// key 和 uuid 只需要写一个
                "url": global.serverPath,
                "clientinfo": appUtils.getSStorageInfo("clientinfo"), 	// 从 session 中将 clientinfo 取出
                "jsessionid": appUtils.getSStorageInfo("jsessionid")	// 从 session 中将 jsessionid 取出
            };

            if (utils.isAndroid()) {
                khmobile.carmeraPhotoUpload(JSON.stringify(paiConfig));
            } else {
                require("shellPlugin").callShellMethod("carmeraPlugin", null, null, paiConfig);
            }

            displayNoneCss();
            e.stopPropagation();  // 阻止冒泡
        });

        /* 绑定同意签署协议 */
        appUtils.bindEvent(getEvent(".upload_main .icon_check"), function () {
            $(this).toggleClass("checked");
        });

        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            if (validatePhoto()) {
                submitPhoto();  // 提交照片
            }
        });
    }

    /* 处理点击上传身份证正面、反面效果 */
    function checkedCss(evl, text) {
        //获取mediaId
        var mediaId = evl.attr("mediaId");
        getEvent(".upload_btn h5").html(text);
        getEvent(".upload_btn li").attr("mediaId", mediaId);
        getEvent(".upload_btn").slideUp("fast");
        getEvent(".upload_btn").slideDown("fast");
    }

    /* 处理点击上传身份证正面、反面效果 */
    function displayNoneCss() {
        // 隐藏照片上传按钮
        getEvent(".upload_btn").slideUp("fast");
        // 将按钮的自定义属性 media-id 设为 null
        getEvent(".upload_btn li").attr("media-id", "null");
    }

    /* 清理界面元素
     * 不能写在 destroy 方法里面，写在 destroy 里面，查看协议的时候，界面的元素也会被清理掉
     */
    function cleanPageElement() {
        // 设置 uploaded 属性为 false
        getEvent(".upload_box").attr("uploaded", false);
        // 恢复照片 li 的内容
        getEvent(".positive").text("");
        getEvent(".negative").text("");
        getEvent(".positive").append("<dd class='icon01'><h5>正 面</h5><p>点击上传身份证</p></dd>");
        getEvent(".negative").append("<dd class='icon02'><h5>背 面</h5><p>点击上传身份证</p></dd>");
    }

    /* 验证图片的完整性 */
    function validatePhoto() {
        getEvent(".upload_btn").hide();  // 隐藏照片按钮
        var ischecked = getEvent(".upload_main .icon_check").hasClass("checked");
        if (getEvent(".positive img").length == 0) {
            layerUtils.iMsg(-1, "请先上传正面照！");
            return false;
        }
        if (getEvent(".negative img").length == 0) {
            layerUtils.iMsg(-1, "请先上传反面照！");
            return false;
        }
        if (!ischecked)  // 检查是否勾选签署协议
        {
            layerUtils.iMsg(-1, "请先签署协议！");
            return false;
        }
        if (!fillInformationInParam.idno) {
            layerUtils.iMsg(-1, "身份证正面不清晰，请重新上传");
            return false;
        }
        if (!fillInformationInParam.custname) {
            layerUtils.iMsg(-1, "身份证正面不清晰，请重新上传");
            return false;
        }
        if (!fillInformationInParam.birthday) {
            layerUtils.iMsg(-1, "身份证正面不清晰，请重新上传");
            return false;
        }
        if (!fillInformationInParam.natives) {
            layerUtils.iMsg(-1, "身份证正面不清晰，请重新上传");
            return false;
        }
        if (!fillInformationInParam.idbegindate) {
            layerUtils.iMsg(-1, "身份证反面不清晰，请重新上传");
            return false;
        }
        if (!fillInformationInParam.idenddate) {
            layerUtils.iMsg(-1, "身份证反面不清晰，请重新上传");
            return false;
        }
        if (!fillInformationInParam.policeorg) {
            layerUtils.iMsg(-1, "身份证反面不清晰，请重新上传");
            return false;
        }
        return true;
    }

    /**
     * 照片上传完成后，会自动调用 imgState 方法，但是该方法只能写在 m/index.html
     * 或者暴露给 window ，否则无法调用
     * 已在 init 中暴露给 window
     */
    function imgState(mediaId, data) {
        data = JSON.parse(data);  // 返回的是 json 串
        var obj = data.results[0];
        if (!data.base64) {
            layerUtils.iAlert("身份证识别失败，需重新拍摄，请注意拍摄的角度和光线！", -1);
            return;
        }
        if (data.error_no != 0) {
            layerUtils.iAlert(data.error_info);
            return;
        }
        var base64Str = (data.base64).replace(/[\n\r]*/g, "");
        base64Str = utils.fmtImgData(base64Str);
        // 身份证正面信息
        if (getEvent(".upload_main .positive").attr("mediaId") == mediaId) {
            var idnoOCR = obj.idno;
            var idnoDD = appUtils.getSStorageInfo("idCardNo");	//顶点系统记录的身份证号
            console.log("uploadPhoto idnoDD=" + idnoDD + "*idnoOCR=" + idnoOCR + "*");
            console.log("idnoOCR != idnoDD:" + idnoOCR != idnoDD);

            if (idnoDD && idnoDD && idnoOCR != idnoDD) {
                layerUtils.iMsg(-1, "您上传的身份证与注册投客网关联身份证不一致，请重新上传！");
                return;
            }
            fillInformationInParam.idno = idnoOCR;  // 身份证号
            fillInformationInParam.custname = obj.custname;  // 客户姓名
            fillInformationInParam.natives = obj['native'];  // 证件地址
            fillInformationInParam.addr = obj['native'];  // 联系地址默认为证件地址
            fillInformationInParam.ethnicname = obj.ethnicname;  // 民族
            appUtils.setSStorageInfo("ethnic", obj.ethnicname);
            fillInformationInParam.birthday = obj.birthday;  // 出生日期
            fillInformationInParam.gender = obj.usersex;  // 用户性别

            if (!fillInformationInParam.idno || !fillInformationInParam.natives || !fillInformationInParam.ethnicname || !fillInformationInParam.birthday || !fillInformationInParam.gender) {
                layerUtils.iAlert("身份证正面信息识别失败，需重新拍摄，请注意拍摄的角度和光线！", -1);
                appUtils.setSStorageInfo("idCardNo",fillInformationInParam.idno);
                appUtils.setSStorageInfo("custName",fillInformationInParam.custname);
                getEvent(".positive").text("");  // 先将  li 置空
                getEvent(".positive").attr("uploaded", "false");  // 标识图片未上传
                getEvent(".positive").append("<dd class='icon01'><h5>正 面</h5><p>点击上传身份证</p></dd>");
                return;
            }
            getEvent(".positive").text("");  // 先将  li 置空
            getEvent(".positive").attr("uploaded", "true");  // 标识图片已经上传
            getEvent(".positive").append("<dd><img src=\"" + base64Str + "\"/></dd>");  // 回显图片
        }
        // 身份证反面信息
        if (getEvent(".upload_main .negative").attr("mediaId") == mediaId) {
            fillInformationInParam.policeorg = obj.policeorg;  // 签发机关
            fillInformationInParam.idbegindate = obj.idbegindate;  // 证件开始日期
            fillInformationInParam.idenddate = obj.idenddate;  // 证件结束日期
            if (!fillInformationInParam.policeorg || !fillInformationInParam.idbegindate || !fillInformationInParam.idenddate) {
                layerUtils.iAlert("身份证反面信息识别失败，需重新拍摄，请注意拍摄的角度和光线！", -1);
                getEvent(".negative").text("");  // 先将  li 置空
                getEvent(".negative").attr("uploaded", "false");  // 标识图片未上传
                getEvent(".negative").append("<dd class='icon02'><h5>反 面</h5><p>点击上传身份证</p></dd>");
                return;
            }
            getEvent(".negative").text("");  // 先将  li 置空
            getEvent(".negative").attr("uploaded", "true");  // 标识图片已上传
            getEvent(".negative").append("<dd><img src=\"" + base64Str + "\"/></dd>");  // 回显图片
        }
        var maxheight = getEvent(".upload_box").height() + "px";
        getEvent(".upload_box").css("height", maxheight);  // 设置回显照片区域高度不变
        getEvent(".upload_box img").css("max-height", maxheight);  //设置图片展示大小
    }

    /*获取数字证书协议*/
    function queryCertAgreement() {
        //中登证书协议：certprotcl 自建证书协议：zjcertprotcl
        var getDigitalParam = {"category_englishname": "certprotcl"};
        service.queryProtocolList(getDigitalParam, function (data) {
            getEvent("#icon_Check").html("已阅读并同意");
            var error_no = data.error_no;
            if (error_no == 0 && data.results) {
                // 《中登个人数字证书申请责任书》
                if (data.results[0] != undefined) {
                    getEvent("#icon_Check").append("<a href='javascript:void(0)' id='protocol00'>《" + data.results[0].econtract_name + "》</a>");
                }
                // 《电子签名约定书》
                if (data.results[1] != undefined) {
                    getEvent("#icon_Check").append("<a href='javascript:void(0)' id='protocol01'>《" + data.results[1].econtract_name + "》</a>");
                }
                // 预绑定查看协议的事件
                appUtils.preBindEvent(getEvent("#icon_Check"), "#protocol00", function (e) {
                    e.stopPropagation();  // 阻止冒泡
                    appUtils.pageInit("account/uploadPhoto", "account/showDigitalProtocol", {"protocolId": data.results[0].econtract_no});
                });
                // 预绑定查看协议的事件
                appUtils.preBindEvent(getEvent("#icon_Check"), "#protocol01", function (e) {
                    e.stopPropagation();  // 阻止冒泡
                    appUtils.pageInit("account/uploadPhoto", "account/showDigitalProtocol", {"protocolId": data.results[1].econtract_no});
                });
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            queryCertAgreement();  // 再次获取中登协议
        });
    }

    /* 提交照片 */
    function submitPhoto() {
        service.submitPhoto(fillInformationInParam, function (data) {
            var error_no = data.error_no;
            if (error_no == 0) {
                // 获取邮编
                var postnumParam = {"addr": fillInformationInParam.natives};
                service.queryPostid(postnumParam, function (data) {
                    var error_no = data.error_no;
                    var postnum = "";  //邮编号码
                    if (error_no == 0 && data.results.length != 0) {
                        postnum = data.results[0].post;
                        fillInformationInParam.postid = postnum;
                    }
                    /**
                     * 在切换页面之前，将图片的 base64 编码和图片识别数据保存到 session 中
                     * 转户走新开户流程时，在提交资料的时候跳转到照片上传页面，此时用户不需要上传正面照和反面照，只需补全人脸正像
                     */
                    var photosInfo = {
                        // 正面照 photo4，反面照 photo5
                        "photo4": "",
                        "photo5": "",
                        // 填写资料的页面入参
                        "fillInformationInParam": fillInformationInParam,
                        // 设置 photosInfo 的 isChangeProcess 属性，true 是更改流程，初始值为 false
                        "isChangeProcess": false
                    };
                    photosInfo.photo4 = getEvent(".positive img").attr("src");
                    photosInfo.photo5 = getEvent(".negative img").attr("src");
                    // 将数据保存到 session 中
                    appUtils.setSStorageInfo("photosInfo", JSON.stringify(photosInfo));
                    layerUtils.iLoading(false);
                    fillInformationInParam.backUrl = "account/uploadPhoto";
                    appUtils.pageInit("account/uploadPhoto", "account/personInfo", fillInformationInParam);
                }, true);
            } else {
                layerUtils.iMsg("-1", data.error_info);
            }
            layerUtils.iLoading(false);
        }, false);
    }

    function displayPhoto() {
        layerUtils.iLoading(true);
        var param = {"id": appUtils.getSStorageInfo('userId')};

        /*param = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));*/

        service.serviceAjax("/touker/getPhoto", param, function (data) {
            var code = data.status;
            var obj = data.data;
            if ("000000" == code) {
                var acceptedMediaUrl1 = obj.acceptedMediaUrls[0];
                var acceptedMediaUrl2 = obj.acceptedMediaUrls[1];
                var mediaContent_back = "";
                var mediaContent_font = "";
                if (acceptedMediaUrl1 && acceptedMediaUrl2 && acceptedMediaUrl1.mediaId == "5006") {
                    mediaContent_back = acceptedMediaUrl1.mediaContent;
                    mediaContent_font = acceptedMediaUrl2.mediaContent;
                } else if (acceptedMediaUrl1 && acceptedMediaUrl2 && acceptedMediaUrl1.mediaId == "5005") {
                    mediaContent_back = acceptedMediaUrl2.mediaContent;
                    mediaContent_font = acceptedMediaUrl1.mediaContent;
                }
                var acceptedCertInfo = obj.acceptedCertInfo;
                if (acceptedCertInfo.idno && acceptedCertInfo.addr && mediaContent_back && mediaContent_font) {
                    mediaContent_back = utils.fmtImgData(mediaContent_back);
                    mediaContent_font = utils.fmtImgData(mediaContent_font);

                    //正面照
                    getEvent(".positive").text("");  // 先将  li 置空
                    getEvent(".positive").attr("uploaded", "true");  // 标识图片已经上传
                    getEvent(".positive").append("<dd><img src='data:image/jpg;base64," + mediaContent_font + "'/></dd>");  // 回显图片

                    //反面照
                    getEvent(".negative").text("");  // 先将  li 置空
                    getEvent(".negative").attr("uploaded", "true");  // 标识图片已上传
                    getEvent(".negative").append("<dd><img src='data:image/jpg;base64," + mediaContent_back + "'/></dd>");  // 回显图片

                    //为Map设置值
                    setReturnParams(acceptedCertInfo);
                }
            }
            layerUtils.iLoading(false);
        });
    }

    function setReturnParams(acceptedCertInfo) {
        fillInformationInParam.idno = acceptedCertInfo.idno;	// 身份证号
        fillInformationInParam.custname = acceptedCertInfo.custname;	// 客户姓名
        fillInformationInParam.ethnicname = acceptedCertInfo.ethnic;	// 民族
        fillInformationInParam.natives = acceptedCertInfo.natives;		// 证件地址
        fillInformationInParam.policeorg = acceptedCertInfo.policeorg;	// 签发机关
        fillInformationInParam.birthday = acceptedCertInfo.borthday;	// 出生日期
        fillInformationInParam.idbegindate = acceptedCertInfo.idbegindate;	// 证件开始日期
        fillInformationInParam.idenddate = acceptedCertInfo.idenddate;	// 证件结束日期
        fillInformationInParam.gender = acceptedCertInfo.usersex;	// 用户性别
        fillInformationInParam.postid = acceptedCertInfo.postid;  //邮编
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    function destroy() {
        service.destroy();
    }

    /* 暴露对外的接口 */
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});