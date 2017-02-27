/**
 * 开户确认（问卷回访）
 */
define("project/scripts/account/openConfirm", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(), //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        fristMap = "",
        _pageId = "#account_openConfirm",
        _pageLocation = "account/openConfirm";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        $(_pageId).height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        $("body").scrollTop(0);
        getOpenConfirmData(); //获取问卷回访问题
    }

    function bindPageEvent() {
        /* 绑定返回事件*/
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            appUtils.pageInit(_pageLocation, "account/riskAssessmentResult", {});
        });

        /* 问题卷选项绑定提示事件 */
        appUtils.preBindEvent(getEvent(".user_form"), " .icon_radio", function () {
            validateSelect(this);
        });

        /* 提交问卷回访 */
        appUtils.bindEvent(getEvent(".ct_btn"), function () {
            postQuestionaireData();
        });
    }

    function destroy() {
        service.destroy();
    }

    /* 选项选中验证事件，若选择否 则按钮不可点击 */
    function validateSelect(obj) {
        // 若当前点击没有选中，去除全部选中
        if (!$(obj).hasClass("checked")) {
            $(obj).parent().siblings().children("a").removeClass("checked");  // 选中当前答案，将其他答案标记未选择
            $(obj).parent().parent().prev("h5").css("color", "#666666");	 // 红色标记恢复黑色
        }
        else {
            $(obj).parent().parent().prev("h5").css("color", "red");  //未选择答案，则将该题标记为红色
        }
        $(obj).toggleClass("checked");
    }

    /* 获取开户确认回访问卷 */
    function getOpenConfirmData() {
        var userid = appUtils.getSStorageInfo("userId");
        getEvent(".user_form").html("");
        var visitSubParam = {
            "user_id": userid,
            "sub_id": "5000"
        };
        // 获取回访问卷题目
        service.getVisitSub(visitSubParam, function (data) {
            var errorNo = data.error_no;
            var errorInfo = data.error_info;
            if (errorNo == 0 && data.results.length != 0)	//调用成功
            {
                var results = data.results;

                fristMap = utils.getTitle(results);

                createRiskQuestions(fristMap);

                if ($(document.body).height() < $(_pageId).height()) {
                    getEvent(".fix_bot").css("position", "fixed");
                }
                else {
                    getEvent(".fix_bot").css("position", "absolute");
                }
                // 设置默认值，默认选择正确答案
                getEvent(".user_form dl a[ans-mark=1]").addClass("checked");
            }
            else {
                layerUtils.iAlert(errorInfo);
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            getOpenConfirmData();  // 再次获取问卷回访题目
        });
    }


    /* 提交问卷回访数据（用户选择答案） */
    function postQuestionaireData() {
        oneQuestionaireData = "";	// 格式如：1_2_7|2_7_3|  问题ID_答案ID_答案分值
        oneQuestionaireData = validateIfQuestionisFinish();
        if (!oneQuestionaireData) {
            return false;
        }
        var userid = appUtils.getSStorageInfo("userId");
        var submitParam = {
            "user_id": userid,
            "q_a_args": oneQuestionaireData,
            "sub_id": "5000"
        };
        getEvent(".user_form h5").css("color", "#666666");	// 红色标记恢复黑色
        service.submitVisitAnswer(submitParam, function (data) {
            var errorNo = data.error_no;
            var errorInfo = data.error_info;
            if (errorNo == 0)	 // 调用成功,跳转到风险测评页面
            {
                appUtils.pageInit(_pageLocation, "account/accountSuccess");  // 直接跳到结果页
            }
            else {
                layerUtils.iAlert(errorInfo, -1);
            }
        });
    }

    /* 验证问题全部是否回答 */
    function validateIfQuestionisFinish() {
        var oneRiskAssessData = "";
        var countNoChoice = 0; // 没有选择问题数量
        var numNoChoice = ""; // 没有选择问题题号
        var keys = fristMap.keys();
        for (var j = 0; j < keys.length; j++) {
            var queid = keys[j].split("-")[1];
            var isChoice = false;
            getEvent(".radio_table dd #" + queid).each(function () {
                if ($(this).hasClass("checked")) {
                    isChoice = true;
                    var ansid = $(this).attr("ans-id");
                    var mark = $(this).attr("ans-mark");
                    oneRiskAssessData += (queid + "_" + ansid + "_" + mark + "|");
                }
            });
            // 校验不规范答题
            if (!isChoice || !getEvent(".radio_table:eq(" + j + ") dd a[ans-mark='1'] ").hasClass("checked")) {
                countNoChoice++;
                numNoChoice += (j + 1) + "、";
            }
        }
        if (countNoChoice > 0) // 您的答题尚未完成
        {
            numNoChoice = numNoChoice.substring(0, numNoChoice.length - 1); // 去掉最后一个逗号
            layerUtils.iAlert("亲！您如下答题编号：【" + numNoChoice + "】 无法通过问卷回访，请重新作答");
            return false;
        }
        return oneRiskAssessData;
    }

    /**
     * 创建所有的题目
     */
    function createRiskQuestions(fristMap){
        var userForm = getEvent(".user_form");
        var keys = fristMap.keys();
        //遍历所有题目
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var type = key.split("-")[0];
            var queid = key.split("-")[1];
            var qname = key.split("-")[2];

            var oneData = fristMap.get(key); // 取出一个问题
            var oneDataKeys = oneData.keys();

            var H5 = $("<h5 class='title'>" + (j+1) + "、 " + qname + "</h5>");
            var dl = $("<dl class='radio_table' id=" + queid + "></dl>");
            //办理题目选项
            for (var i = 0; i < oneDataKeys.length; i += 3) // 先遍历确定有多少题
            {
                var oneElem = oneData.get(oneDataKeys[i]);
                var mark = oneElem.mark;
                var aname = oneElem.a_name;
                var ansid = oneElem.ans_id;
                var dd1 = $("<dd><a href='javascript:;' class='icon_radio' que-choice='0' que-type ='" + type + "' ans-id='" + ansid + "' ans-mark='" + mark + "' id ='" + queid + "'>" + aname + "</a></dd>");

                dl.append(dd1);
                if (oneDataKeys.length >= 2) // 取第二条数据
                {
                    var oneEleTwo = oneData.get(oneDataKeys[i + 1]);
                    var markTwo = oneEleTwo.mark;
                    var anameTwo = oneEleTwo.a_name;
                    var ansidTwo = oneEleTwo.ans_id;
                    var dd2 = $("<dd><a href='javascript:;' class='icon_radio' que-choice='1' que-type ='" + type + "' ans-id='" + ansidTwo + "' ans-mark='" + markTwo + "' id ='" + queid + "'>" + anameTwo + "</a></dd>");

                    dl.append(dd2);
                    if (oneDataKeys.length >= 3)  // 取第三条数据
                    {
                        var oneEleThree = oneData.get(oneDataKeys[i + 2]);
                        var markThree = oneEleThree.mark;
                        var anameThree = oneEleThree.a_name;
                        var ansidThree = oneEleThree.ans_id;
                        var dd3 = $("<dd><a href='javascript:;' class='icon_radio' que-choice='1' que-type ='" + type + "' ans-id='" + ansidThree + "' ans-mark='" + markThree + "' id ='" + queid + "'>" + anameThree + "</a></dd>");

                        dl.append(dd3);
                    }
                }
                userForm.append(H5).append(dl);
            }
        }
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