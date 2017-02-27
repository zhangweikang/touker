/**
 * 风险测评
 */
define("project/scripts/account/riskAssessment", function (require, exports, module) {
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        fristMap = "",
        _pageId = "#account_riskAssessment";
    /* 私有业务模块的全局变量 end */

    function init() {
        //加载样式
        getEvent(".page").height($(window).height());
        getEvent(".over_scroll").height($(window).height() - 45).css({overflow: "auto"});
        $("body").scrollTop(0);
        getRiskAssessQuestions();  // 获取问卷答题
    }

    function bindPageEvent() {
        /* 绑定返回事件 */
        appUtils.bindEvent(getEvent(".header .icon_back"), function () {
            var tpbankFlg = appUtils.getSStorageInfo("tpbankFlg");
            if (tpbankFlg == '1') {
                appUtils.setSStorageInfo("backsignp", "signprotocol");
                appUtils.pageInit("account/riskAssessment", "account/signProtocol", {});
            } else {
                appUtils.pageInit("account/riskAssessment", "account/thirdDepository", {});
            }
        });

        /* 提交答题  */
        appUtils.preBindEvent($(document), _pageId + " .ct_btn", function () {
            var keys = fristMap.keys();
            postRiskAssessmentData(keys);  // 提交答题
        });
    }

    /* 获取风险测评题库 */
    function getRiskAssessQuestions() {
        // 查询风险评测
        var userid = appUtils.getSStorageInfo("userId");
        var queryTestParam = {"user_id": userid};
        service.queryRiskToc(queryTestParam, function (data) {
            var errorNo = data.error_no;
            var errorInfo = data.error_info;
            if (!(errorNo == 0 && data.results.length != 0)) {
                layerUtils.iMsg("-1", errorInfo);
            } else {
                // 调用成功
                var results = data.results;
                getEvent(".test_main").html("");
                //获取所有题目
                //getRiskQuestions(results);

                fristMap = utils.getTitle(results);
                //创建所有题目
                createRiskQuestions(fristMap);
                // 当题目过多，则设置下一步按钮悬浮底部
                if ($(document.body).height() < $(_pageId).height()) {
                    getEvent(".fix_bot").css("position", "fixed");
                } else {
                    getEvent(".fix_bot").css("position", "absolute");
                }
                // 为选择按钮添加事件
                appUtils.bindEvent(getEvent(".test_main .icon_radio"), function () {
                    var quetype = $(this).attr("que-type");	 // 问题类型0：单选，1：多选
                    var queid = $(this).attr("id");
                    if (quetype == 1) {
                        $(this).toggleClass("checked");
                    } else {
                        if ($(this).hasClass("checked")) {
                            $(this).parent().parent().prev("h5").css("color", "red");  // 未选择答案，则将该题标记为红色
                            $(this).removeClass("checked");
                        } else {
                            getEvent(".test_main #" + queid).removeClass("checked");
                            $(this).parent().parent().prev("h5").css("color", "#666666");	// 题目红色标记恢复黑色
                            $(this).addClass("checked");
                        }
                    }
                });
                setDefaultAnswer();  // 设置默认的答案，默认是最低风险承受能力
            }
        }, true, true, handleTimeout);
    }

    /* 处理请求超时 */
    function handleTimeout() {
        layerUtils.iConfirm("请求超时，是否重新加载？", function () {
            getRiskAssessQuestions();  // 再次风险测评题目
        });
    }

    /* 设置问题的默认答案 */
    function setDefaultAnswer() {
        var questionList = getEvent(".test_main .input_list");  // 获取所有问题的集合
        // 处理每一个问题
        questionList.each(function () {
            var markArray = new Array();
            for (var i = 0; i < $(this).children("p").length; i++) {
                markArray.push(Number($(this).children("p").eq(i).children("a").attr("ans-mark")));
            }
            markArray.sort();  // js 的 sort 方法是在原数组的基础上进行排序
            $(this).children("p").children("a[ans-mark='" + markArray[1] + "']").addClass("checked");
        });
    }

    /* 提交风险评测答案 */
    function postRiskAssessmentData(keys) {
        var oneRiskAssessData = "";	// 格式如：1_2_7|2_7_3|  问题ID_答案ID_答案分值
        var countNoChoice = 0; // 没有选择问题数量
        var numNoChoice = "";  // 没有选择问题题号
        for (var j = 0; j < keys.length; j++) {
            var index = j + 1;
            var queid = keys[j].split("-")[1];
            var isChoice = false;
            getEvent(".test_main #" + queid).each(function () {
                if ($(this).hasClass("checked")) {
                    isChoice = true;
                    var ansid = $(this).attr("ans-id");
                    var mark = $(this).attr("ans-mark");
                    oneRiskAssessData += (queid + "_" + ansid + "_" + mark + "|");
                }
            });
            if (!isChoice)  // 没有选中 则记录未提交的题目编号
            {
                countNoChoice++;
                numNoChoice += index + "、";
            }
        }
        if (countNoChoice > 0)//您的答题尚未完成
        {
            numNoChoice = numNoChoice.substring(0, numNoChoice.length - 1); // 去掉最后一个逗号
            layerUtils.iAlert("您的答题尚未完成，未完成题目编号：" + numNoChoice);
            return false;
        }
        var userid = appUtils.getSStorageInfo("userId");
        var submitTestParam = {
            "user_id": userid,
            "sub_id": "1",
            "q_a_args": oneRiskAssessData
        };
        // 提交风险评测答案
        service.submitTestAnswer(submitTestParam, function (data) {
            var errorNo = data.error_no;
            var errorInfo = data.error_info;
            if (errorNo == 0 && data.results.length != 0)	//调用成功,跳转到风险测评页面
            {
                var remark = data.results[0].remark;
                var riskdesc = data.results[0].riskdesc;
                appUtils.pageInit("account/riskAssessment", "account/riskAssessmentResult", {
                    "remark": remark,
                    "riskdesc": riskdesc
                });
            }
            else {
                layerUtils.iMsg("-1", errorInfo);
            }
        });
    }

    /**
     * 处理选项标题
     * @param num
     * @returns {string}
     */
    function changQuestionBgNum(num) {
        var bgNum = "A";
        switch (num) {
            case 0:
                bgNum = "A";
                break;
            case 1:
                bgNum = "B";
                break;
            case 2:
                bgNum = "C";
                break;
            case 3:
                bgNum = "D";
                break;
            case 4:
                bgNum = "E";
                break;
            case 5:
                bgNum = "F";
                break;
            case 6:
                bgNum = "G";
                break;
            default:
                bgNum = "其它";
        }
        return bgNum;
    }

    /**
     * 将所有题目放入fristMap
     */
    function getRiskQuestions(results){
        for (var i = 0; i < results.length; i++)  // 先遍历
        {
            var oneEle = results[i];
            var queid = oneEle.que_id;  // que_id	题目编号
            var type = oneEle.type;  // type	问题类型（0：单选，1：多选）
            var qname = oneEle.q_name;  // q_name	题目描述
            var str = type + "-" + queid + "-" + qname;
            var secondMap = null;
            if (!fristMap.containsKey(str))  // 若map中没有对应的问题号，则存入问题号
            {
                secondMap = new Map();
                secondMap.put(oneEle.ans_id, oneEle);
                fristMap.put(str, secondMap);	  // fristMap每一个Key对应一个问题
            } else {
                fristMap.get(str).put(oneEle.ans_id, oneEle);
            }
        }
    }

    /**
     * 创建所有的题目
     */
    function createRiskQuestions(fristMap){
        var testMain = getEvent(".test_main");
        var keys = fristMap.keys();
        //遍历所有题目
        for (var j = 0; j < keys.length; j++) {
            var key = keys[j];
            var type = key.split("-")[0];
            var queid = key.split("-")[1];
            var qname = key.split("-")[2];
            var str = "(多选)";
            // 问题标号
            var bgNum = "A";

            var oneData = fristMap.get(key); // 取出一个问题
            var oneDataKeys = oneData.keys();

            var divBox = $("<div class='test_box'></div>");
            var H5 = $("<h5>" + (j+1) + ". " + qname + str + "</h5>");
            var divList = $("<div class='input_list' id='" + ((j+1) + "-" + queid) + "'></div>");
            //办理题目选项
            for (var k = 0; k < oneDataKeys.length; k++) {
                var oneElem = oneData.get(oneDataKeys[k]);
                var mark = oneElem.mark;  // 答案分值
                var aname = oneElem.a_name;  // 答案描述
                var ansid = oneElem.ans_id;
                if (type == 0) str = "(单选)";
                bgNum = changQuestionBgNum(k);

                var p = $("<p><a href='javascript:void(0);' class='icon_radio' que-type ='" + type + "' ans-id='" + ansid + "' ans-mark='" + mark + "' id ='" + queid + "'>" + bgNum + ". " + aname + "</a></p>");

                divList.append(p);
            }
            divBox.append(H5).append(divList);
            testMain.append(divBox);
        }
    }

    //获取当前页面属性对象
    function getEvent(event) {
        return $(_pageId + " " + event);
    }

    function destroy() {
        service.destroy();
    }

    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent,
        "destroy": destroy
    };
});