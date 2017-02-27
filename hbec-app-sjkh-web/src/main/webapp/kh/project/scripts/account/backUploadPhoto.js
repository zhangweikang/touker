/**
 * 驳回影像上传
 */
define("project/scripts/account/backUploadPhoto", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        gconfig = require("gconfig"),
        utils = require("utils"),
        global = gconfig.global,
        _pageId = "#account_backUploadPhoto",
        front = "",
        back = "",
        nohat = "";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});

        window.imgState = imgState;  //上传完照片自动调用该方法
        claerHtmlPageEvent();
        initPage();  // 初始化页面
    }

    function bindPageEvent() {
        /* 绑定返回事件*/
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            appUtils.pageInit("account/backUploadPhoto","account/openAccount",{backUrl:"account/backUploadPhoto"});
        });
        /* 点击页面隐藏按钮 */
        appUtils.bindEvent($(_pageId), function () {
            displayNoneCss();
        });

        /* 绑定上传正面身份证照 */
        appUtils.bindEvent(getEvent(".upload_main .positive"), function (e) {
            checkedCss($(this), "上传身份证正面");
            e.stopPropagation();
        });

        /* 绑定上传反面身份证照 */
        appUtils.bindEvent(getEvent(".upload_main .negative"), function (e) {
            checkedCss($(this), "上传身份证反面");
            e.stopPropagation();
        });

        /* 绑定上传反面身份证照 */
        appUtils.bindEvent(getEvent(".icon_back"), function () {
            appUtils.pageInit("account/backUploadPhoto", "account/openAccount", {backUrl: "account/backUploadPhoto"});
        });


        /*人像正面 */
        appUtils.bindEvent(getEvent(".upload_main .headpic"), function (e) {
            checkedCss($(this), "上传大头像");
            e.stopPropagation();
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
                "clientinfo": appUtils.getSStorageInfo("clientinfo"),	// 从 session 中将 clientinfo 取出
                "jsessionid": appUtils.getSStorageInfo("jsessionid")	// 从 session 中将 jsessionid 取出
            };

            khmobile.carmeraPhotoUpload(JSON.stringify(phoneConfig));

            displayNoneCss();
            e.stopPropagation();
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
                "clientinfo": appUtils.getSStorageInfo("clientinfo"),	// 从 session 中将 clientinfo 取出
                "jsessionid": appUtils.getSStorageInfo("jsessionid")	// 从 session 中将 jsessionid 取出
            };

            khmobile.carmeraPhotoUpload(JSON.stringify(paiConfig));

            displayNoneCss();
            e.stopPropagation();
        });

        /* 绑定下一步 */
        appUtils.bindEvent(getEvent(".fix_bot .ct_btn"), function () {
            if (valiImage()) {
                utils.boHuiRedirect("photo", "account/backUploadPhoto", "backPhone");
            }
        });
    }

    /* 初始化页面 */
    function initPage() {
        // 给补全信息赋值
        var backPhone = appUtils.getSStorageInfo("backPhone");
        if (backPhone) {
            backPhone = JSON.parse(backPhone);
            back = backPhone.photo_5005;
            front = backPhone.photo_5006;
            nohat = backPhone.photo_5007;
        }
        // 只补全正面照
        if (back) {
            getEvent(".upload_main .positive").show();  //显示上传身份证正面
            getEvent(".upload_main h5:eq(0)").html("补充以下相关影像");
            if (back.rejreason) {
                getEvent(".ared").text(back.rejreason);
            }
        }
        // 只补全反面照
        if (front) {
            getEvent(".upload_main .negative").show();  //显示上传身份证反面
            getEvent(".upload_main h5:eq(0)").html("补充以下相关影像");
            if (front.rejreason) {
                getEvent(".ared").text(front.rejreason);
            }
        }
        // 只补全大头像
        if (nohat) {
            getEvent(".upload_main .headpic").show();  //显示上传大头像
            getEvent(".upload_main h5:eq(0)").html("补充以下相关影像");
            if (nohat.rejreason) {
                getEvent(".ared").text(nohat.rejreason);
            }
        }
    }

    /**
     * 照片上传完成后，会自动调用 imgState 方法，但是该方法只能写在 m/index.html
     * 或者暴露给 window ，否则无法调用
     * 已在 init 中暴露给 window
     */
    function imgState(mediaId, data) {
        data = JSON.parse(data);  // 返回的是 json 串
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
            getEvent(".positive").text("");  // 先将  li 置空
            getEvent(".positive").attr("uploaded", "true");  // 标识图片已经上传
            getEvent(".positive").append("<dd><img src='" + base64Str + "'/></dd>");  // 回显图片
        }
        // 身份证反面信息
        if (getEvent(".upload_main .negative").attr("mediaId") == mediaId) {
            getEvent(".negative").text("");  // 先将  li 置空
            getEvent(".negative").attr("uploaded", "true");  // 标识图片已上传
            getEvent(".negative").append("<dd><img src='" + base64Str + "'/></dd>");  // 回显图片
        }
        if (getEvent(".upload_main .headpic").attr("mediaId") == mediaId) {
            getEvent(".headpic").text("");  // 先将  li 置空
            getEvent(".headpic").attr("uploaded", "true");  // 标识图片已上传
            getEvent(".headpic").append("<dd><img src='" + base64Str + "'/></dd>");  // 回显图片
        }
        var maxheight = getEvent(".upload_box").height() + "px";
        getEvent(".upload_box").css("height", maxheight);  // 设置回显照片区域高度不变
        getEvent(".upload_box img").css("max-height", maxheight);  //设置图片展示大小
    }

    /**
     * 检验图片
     * @returns {boolean}
     */
    function valiImage() {
        if (back) {
            if (getEvent(".positive img").length == 0) {
                layerUtils.iMsg(-1, "请先上传正面照！");
                return false;
            }
        }
        // 只补全反面照
        if (front) {
            if (getEvent(".negative img").length == 0) {
                layerUtils.iMsg(-1, "请先上传反面照！");
                return false;
            }
        }
        // 只补全大头像
        if (nohat) {
            if (getEvent(".headpic img").length == 0) {
                layerUtils.iMsg(-1, "请先上传人像正面！");
                return false;
            }
        }

        return true;
    }

    function claerHtmlPageEvent() {
        getEvent(".upload_main .positive").hide();
        getEvent(".upload_main .negative").hide();
        getEvent(".upload_main .headpic").hide();
        getEvent(".upload_main h5:eq(0)").html("");

        getEvent(".positive").attr("uploaded", "false");
        getEvent(".negative").attr("uploaded", "false");
        getEvent(".headpic").attr("uploaded", "false");

        getEvent(".positive").html("<dd class='icon01'><h5>正 面</h5><p>点击上传身份证</p></dd>");
        getEvent(".negative").html("<dd class='icon02'><h5>背 面</h5><p>点击上传身份证</p></dd>");
        getEvent(".headpic").html("<dd class='icon03'><h5>大头像</h5><p>点击上传免冠头像</p></dd>");
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

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    function destroy() {
        service.destroy();
    }

    // 暴露对外的接口
    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});