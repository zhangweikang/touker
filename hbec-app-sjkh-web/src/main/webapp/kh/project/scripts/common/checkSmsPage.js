/**
 * 校验短信验证码相关,用户页面跳转
 * Created by Administrator on 2016/11/15.
 */
define(function (require, exports, module) {
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        openChannel = require("gconfig").global.openChannel,
    //新开户基本流程跳转
        Steps = ["uploadimg", "idconfirm", "witness",
            "certintall", "capitalacct",
            "stkacct", "setpwd", "tpbank",
            "risksurvey", "visitsurvey", "success"
        ],
        StepMap = {
            "uploadimg": "account/uploadPhoto",
            "idconfirm": "account/personInfo",
            "witness": "account/videoNotice",
            "certintall": "account/digitalCertificate",
            "capitalacct": "account/signProtocol",
            "stkacct": "account/signProtocol",
            "setpwd": "account/setPwd",
            "tpbank": "account/thirdDepository",
            "risksurvey": "account/riskAssessment",
            "visitsurvey": "account/openConfirm",
            "success": "account/accountSuccess"
        },

    //已绑定了三方存管的流程跳转
        depositorySteps = ["uploadimg", "idconfirm", "setpwd", "witness",
            "certintall", "capitalacct", "stkacct",
            "risksurvey", "visitsurvey", "success"
        ],

        depositoryStepsMap = {
            "uploadimg": "account/uploadPhoto",
            "idconfirm": "account/personInfo",
            "setpwd": "account/personInfo",
            "witness": "account/videoNotice",
            "certintall": "account/digitalCertificate",
            "capitalacct": "account/signProtocol",
            "stkacct": "account/signProtocol",
            "risksurvey": "account/riskAssessment",
            "visitsurvey": "account/openConfirm",
            "success": "account/accountSuccess"
        },

    //已绑定了三方支付的流程跳转
        partiesPaySteps = ["uploadimg", "idconfirm", "setpwd", "witness",
            "certintall", "capitalacct", "stkacct", "tpbank",
            "risksurvey", "visitsurvey", "success"
        ],
        partiesPayStepMap = {
            "uploadimg": "account/uploadPhoto",
            "idconfirm": "account/personInfo",
            "setpwd": "account/personInfo",
            "witness": "account/videoNotice",
            "certintall": "account/digitalCertificate",
            "capitalacct": "account/signProtocol",
            "stkacct": "account/signProtocol",
            "tpbank": "account/thirdDepository",
            "risksurvey": "account/riskAssessment",
            "visitsurvey": "account/openConfirm",
            "success": "account/accountSuccess"
        };

    /**
     * 处理各种驳回状态
     * result 校验短信通过后返回用户数据
     * codePage 当前页面
     **/
    function valiDataReject(acceptedRejectLogs, acceptedCustomerInfo, codePage) {

        var photoParam = {"photo_5005": "", "photo_5006": "", "photo_5007": ""};
        if (acceptedRejectLogs) {
            if (acceptedRejectLogs.photo_5005) {
                photoParam.photo_5005 = acceptedRejectLogs.photo_5005;
            }
            if (acceptedRejectLogs.photo_5006) {
                photoParam.photo_5006 = acceptedRejectLogs.photo_5006;
            }
            if (acceptedRejectLogs.photo_5007) {
                photoParam.photo_5007 = acceptedRejectLogs.photo_5007;
            }

            // 1.驳回:身份证正面、反面、大头像
            if (acceptedRejectLogs.photo_5005 || acceptedRejectLogs.photo_5006 || acceptedRejectLogs.photo_5007) {
                appUtils.setSStorageInfo("backPhone", JSON.stringify(photoParam));
                appUtils.pageInit(codePage, "account/backUploadPhoto");
                return false;
            }
            // 2.驳回视频见证
            if (acceptedRejectLogs.video) {
                appUtils.setSStorageInfo("backVideo", acceptedRejectLogs.video);
                appUtils.pageInit(codePage, "account/videoNotice");
                return false;
            }
        }
        // 3.驳回密码设置
        if (acceptedCustomerInfo && ((!acceptedCustomerInfo.clientId && acceptedCustomerInfo.fundPwdTrue == "0") || (!acceptedCustomerInfo.clientId && acceptedCustomerInfo.tradePwdTrue == "0"))) {
            appUtils.setSStorageInfo("backPwd", true);
            appUtils.pageInit(codePage, "account/backSetPwd");
            return false;
        }
        // 4.驳回开立账户
        if (acceptedRejectLogs && acceptedRejectLogs.account) {
            appUtils.setSStorageInfo("backAccount", acceptedRejectLogs.account);
            appUtils.pageInit(codePage, "account/signProtocol");
            return false;
        }
        // 5.驳回三方存管
        if (acceptedCustomerInfo && acceptedCustomerInfo.cubsbscopenacctflag == "0") {
            appUtils.setSStorageInfo("backThird", true);
            appUtils.pageInit(codePage, "account/thirdDepository");
            return false;
        }

        return true;
    }

    /**
     * 用户没有驳回数据,用户继续开户
     * acceptedSchedule 用户流程数据
     * tpbankFlg 001015：三方存管
     * codePage 当前页面
     **/
    function pageNextStep(acceptedSchedule, tpbankFlg, codePage) {
        console.log("继续开户tpbankFlg=" + tpbankFlg);
        var pageCode = "";
        var lastcompleteStep = acceptedSchedule.lastcompleteStep; //断点：上次走的最后一步
        var customerId = appUtils.getSStorageInfo("khh");
        if (lastcompleteStep) {
            var index = Steps.indexOf(lastcompleteStep);
            if (index < (Steps.length - 1)) {
                if (customerId && (lastcompleteStep == "idconfirm" || lastcompleteStep == "setpwd")) {
                    lastcompleteStep = "idconfirm";
                } else if (tpbankFlg == '001015' && (lastcompleteStep == "capitalacct" || lastcompleteStep == "stkacct")) {
                    lastcompleteStep = "capitalacct";
                } else {
                    lastcompleteStep = Steps[index + 1];
                }
            }
            //用户流程
            pageCode = StepMap[lastcompleteStep];//新用户流程
        } else {
            if (customerId) {
                pageCode = "account/uploadPhoto";
            } else {
                pageCode = "account/selDepartment";
            }
        }

        var backUrl = "";
        if (openChannel == "1"){
            backUrl = "account/phoneNumberVerify";
        } else {
            backUrl = "account/openAccount";
        }
        appUtils.pageInit(codePage, pageCode, {"backUrl": backUrl});
    }

    function setSessionStorage(obj) {
        var acceptedCertInfo = obj.acceptedCertInfo;
        var branchInfo = obj.branchInfo;
        var acceptedCustomerInfo = obj.acceptedCustomerInfo;
        // 顶点身份证号保存到session
        if (obj.idnoDD) {
            appUtils.setSStorageInfo("idnoDD", obj.idnoDD);
        }
        if (acceptedCertInfo) {
            // user_id保存到session
            if (acceptedCertInfo.id) {
                appUtils.setSStorageInfo("userId", acceptedCertInfo.id);
            }
            // custname保存到session
            if (acceptedCertInfo.custname) {
                appUtils.setSStorageInfo("custName", acceptedCertInfo.custname);
            }
            // 身份证号保存到session
            if (acceptedCertInfo.idno) {
                appUtils.setSStorageInfo("idCardNo", acceptedCertInfo.idno);
            }
            // 职业保存到session
            if (acceptedCertInfo.professionCode) {
                appUtils.setSStorageInfo("professionCode", acceptedCertInfo.professionCode);
            }
            // 将营业部Id保存到session
            if (acceptedCertInfo.branchno) {
                appUtils.setSStorageInfo("branchCode", acceptedCertInfo.branchno);
            }
            // 将营业部佣金保存到session
            if (acceptedCertInfo.commission) {
                appUtils.setSStorageInfo("commission", acceptedCertInfo.commission);
            }
            // 将名族保存到session
            if (acceptedCertInfo.ethnic) {
                appUtils.setSStorageInfo("ethnic", acceptedCertInfo.ethnic);
            }
            var paramCheckSms = {
                "mobileNo" : appUtils.getSStorageInfo("mobileNo")
            };
            service.loginInfo(paramCheckSms,function(data){
                var result = data.results;
                // 将 clientinfo 保存到 session 中，用于解决壳子上传照片的权限问题
                if (result[0].clientinfo) {
                    appUtils.setSStorageInfo("clientinfo", result[0].clientinfo);
                }
                // 将 jsessionid 保存到 session 中，用于解决壳子上传照片的权限问题
                if (result[0].jsessionid) {
                    appUtils.setSStorageInfo("jsessionid", result[0].jsessionid);
                }
            },true,false);

            if (acceptedCustomerInfo && acceptedCustomerInfo.banktype) {
                var queryParam = {
                    "bindtype": "",
                    "ispwd": "",
                    "step": "bankInfo",
                    "bankCode": acceptedCustomerInfo.banktype
                };
                service.queryBankList(queryParam, function (data) {
                    var errorNo = data.error_no;
                    var errorInfo = data.error_info;
                    if (errorNo == 0 && data.results.length != 0) {
                        var bankInfo = data.results[0];
                        appUtils.setSStorageInfo("bankCode", bankInfo.bankcode);
                        appUtils.setSStorageInfo(bankInfo.bankcode + "isCard", bankInfo.iscard);
                    } else {
                        layerUtils.iAlert(errorInfo, -1);
                    }
                }, true, false);
            }
        }
        if (branchInfo) {
            // 将营业部Id保存到session
            if (branchInfo.branchno) {
                appUtils.setSStorageInfo("branchCode", branchInfo.branchno);
            }
            // 将营业部名称保存到session
            if (branchInfo.branchname) {
                appUtils.setSStorageInfo("branchName", branchInfo.branchname);
            }
            // 将营业部佣金保存到session
            if (acceptedCertInfo && acceptedCertInfo.commission) {
                appUtils.setSStorageInfo("commission", acceptedCertInfo.commission);
            }
        }
    }

    /**
     * 校验用户数据
     * 按用户流程跳转
     **/
    function valiDataCustomeInfo(param, codePage) {
        /*
         * param = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));
         */
        service.serviceAjax("/touker/validateCustInfo", param, function (data) {
            var code = data.status;
            var obj = data.data;
            if ("001003" == code || "001004" == code || "001006" == code || "001014" == code || "001038" == code || "001039" == code) {
                layerUtils.iMsg(-1, data.msg);
            } else {
                var tpbankFlg = obj.tpbankFlg;
                var tpAddr = obj.tpAddr;

                appUtils.setSStorageInfo("smsCodeVail", "true");
                appUtils.setSStorageInfo("tpbankFlg", tpbankFlg);//用户开户标示
                appUtils.setSStorageInfo("tpAddr", tpAddr);//重置交易密码地址(投客网或者网厅)
                appUtils.setSStorageInfo("idnoDD", obj.idnoDD);//顶点保存的客户身份证号

                setSessionStorage(obj);

                if (code == "001041") {
                    //已走完开户流程,判断用户是否驳回
                    if (valiDataReject(obj.acceptedRejectLogs, obj.acceptedCustomerInfo, codePage)) {
                        appUtils.pageInit(codePage, "account/accountSuccess", {"backUrl": "account/phoneNumberVerify"});
                    }
                } else {
                    //未走完开户流程,继续流程
                    pageNextStep(obj.acceptedSchedule, tpbankFlg, codePage);
                }
            }
        });
    }

    module.exports = {
        "valiDataReject": valiDataReject,
        "pageNextStep": pageNextStep,
        "setSessionStorage": setSessionStorage,
        "valiDataCustomeInfo": valiDataCustomeInfo
    };
});