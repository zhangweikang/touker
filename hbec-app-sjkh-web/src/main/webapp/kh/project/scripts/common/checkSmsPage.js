/**
 * 校验短信验证码相关,用户页面跳转
 * Created by Administrator on 2016/11/15.
 */
define(function (require, exports, module) {
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),
        layerUtils = require("layerUtils"),
        utils = require("utils"),
        global = require("gconfig").global,
    //新开户基本流程跳转
        newSteps = ["uploadimg", "idconfirm", "witness",
            "certintall", "capitalacct",
            "stkacct", "setpwd", "tpbank",
            "risksurvey", "visitsurvey", "success"
        ],
        newStepMap = {
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
            appUtils.pageInit(codePage, "account/backUploadPhoto", photoParam);
            return;
        }
        // 2.驳回视频见证
        if (acceptedRejectLogs.video) {
            appUtils.pageInit(codePage, "account/videoNotice", {"video": acceptedRejectLogs.video});
            return;
        }
        // 3.驳回密码设置
        if ((!acceptedCustomerInfo.clientId && acceptedCustomerInfo.fundPwdTrue == "0") || (!acceptedCustomerInfo.clientId && acceptedCustomerInfo.tradePwdTrue == "0")) {
            appUtils.pageInit(codePage, "account/backSetPwd");
            return;
        }
        // 4.驳回开立账户
        if (acceptedRejectLogs.account) {
            appUtils.pageInit(codePage, "account/backSignProtocol", {"account": acceptedRejectLogs.account});
            return;
        }
        // 5.驳回三方存管
        if (acceptedCustomerInfo.cubsbscopenacctflag == "0") {
            appUtils.pageInit(codePage, "account/backThirdDepository");
            return;
        }
    }

    /**
     * 用户没有驳回数据,用户继续开户
     * acceptedSchedule 用户流程数据
     * tpbankFlg 0：未绑定三方存管和三方支付 1：一定绑定了三方存管，还可能绑定了三方支付 2：只绑定了三方支付
     * codePage 当前页面
     **/
    function pageNextStep(acceptedSchedule, tpbankFlg, codePage) {
        console.log("继续开户tpbankFlg=" + tpbankFlg);
        var newPageCode = "";
        var depositoryPageCode = ""; //已绑定三方存管
        var partiesPayPageCode = ""; //已绑定三方支付
        var lastcompleteStep = acceptedSchedule.lastcompleteStep; //断点：上次走的最后一步
        appUtils.setSStorageInfo("lastcompleteStep", lastcompleteStep);
        if (lastcompleteStep) {
            var index;
            if (tpbankFlg == "1") {
                index = depositorySteps.indexOf(lastcompleteStep);
                if (index < (depositorySteps.length - 1)) {
                    lastcompleteStep = depositorySteps[index + 1];
                }
            } else if (tpbankFlg == "2") {
                index = partiesPaySteps.indexOf(lastcompleteStep);
                if (index < (partiesPaySteps.length - 1)) {
                    lastcompleteStep = partiesPaySteps[index + 1];
                }
            } else {
                index = newSteps.indexOf(lastcompleteStep);
                if (index < (newSteps.length - 1)) {
                    lastcompleteStep = newSteps[index + 1];
                }
            }
            //用户流程
            newPageCode = newStepMap[lastcompleteStep];//新用户流程
            depositoryPageCode = depositoryStepsMap[lastcompleteStep];//三方存管流程
            partiesPayPageCode = partiesPayStepMap[lastcompleteStep];//三方支付流程
        }

        if (newPageCode) {
            //开通三方存管或者三方支付标志（1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	0：未绑定三方存管和三方支付）
            console.log("继续开户tpbankFlg=" + tpbankFlg + " lastcompleteStep=" + lastcompleteStep + " newPageCode=" + newPageCode + " depositoryPageCode=" + depositoryPageCode + " partiesPayPageCode=" + partiesPayPageCode);
            if (tpbankFlg == '1') { //绑定了三方存管
                appUtils.pageInit(codePage, depositoryPageCode);
            } else if (tpbankFlg == '2') { //绑定了三方支付
                appUtils.pageInit(codePage, partiesPayPageCode);
            } else { //未绑定三方存管和三方支付
                appUtils.pageInit(codePage, newPageCode);
            }
        } else {
            if (global.openChannel == "1") {
                console.log("钱钱炒股走新开户流程>>>>>>>>>>>");
                appUtils.pageInit("account/phoneCodeVerify", "account/openAccount");
            } else {
                appUtils.pageInit("account/phoneCodeVerify", "account/selDepartment", {"backUrl": "account/phoneNumberVerify"});
            }
        }
    }

    function setSessionStorage(obj) {
        var acceptedCertInfo = obj.acceptedCertInfo;
        var branchInfo = obj.branchInfo;
        var acceptedCommission = obj.acceptedCommission;
        if (acceptedCertInfo) {
            // user_id保存到session
            if (acceptedCertInfo.id) {
                appUtils.setSStorageInfo("userId", acceptedCertInfo.id);
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
            // 将银行代码保存到session
            if (acceptedCertInfo.banktype) {
                var queryParam = {
                    "bindtype": "",
                    "ispwd": "",
                    "step": "bankInfo",
                    "bankCode": result.banktype
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
                }, true, true, null);

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
                appUtils.setSStorageInfo("commission", branchInfo.commission);
            }
        }
        /*//手机号保存到session
         if (result.mobileno) {
         appUtils.setSStorageInfo("mobileNo", result.mobileno);
         }
         // 将客户姓名保存到 session 中
         if (result.custname) {
         appUtils.setSStorageInfo("custname", result.custname);
         }
         // 签发机关保存到session
         if (result.policeorg) {
         appUtils.setSStorageInfo("policeorg", result.policeorg);
         }
         // 证件地址保存到session
         if (result.native) {
         appUtils.setSStorageInfo("native", result.native);
         }
         // 联系地址保存到session
         if (result.addr) {
         appUtils.setSStorageInfo("addr", result.addr);
         }
         // 起始期限保存到session
         if (result.idbegindate) {
         appUtils.setSStorageInfo("idbegindate", result.idbegindate);
         }
         // 结束期限保存到session
         if (result.idenddate) {
         appUtils.setSStorageInfo("idenddate", result.idenddate);
         }
         // 邮编保存到session
         if (result.postid) {
         appUtils.setSStorageInfo("postid", result.postid);
         }
         // 职业保存到session
         if (result.profession_code) {
         appUtils.setSStorageInfo("profession_code", result.profession_code);
         }
         // 学历保存到session
         if (result.edu) {
         appUtils.setSStorageInfo("edu", result.edu);
         }
         // 将 clientinfo 保存到 session 中，用于解决壳子上传照片的权限问题
         if (result.clientinfo) {
         appUtils.setSStorageInfo("clientinfo", result.clientinfo);
         }
         // 将 jsessionid 保存到 session 中，用于解决壳子上传照片的权限问题
         if (result.jsessionid) {
         appUtils.setSStorageInfo("jsessionid", result.jsessionid);
         }

         // 将省份保存到session
         if (result.provincename) {
         appUtils.setSStorageInfo("provincename", result.provincename);
         }
         // 将城市保存到session
         if (result.cityname) {
         appUtils.setSStorageInfo("cityname", result.cityname);
         }*/
        /*appUtils.setSStorageInfo("shaselect", result.shaselect); // 是否选择沪A
         appUtils.setSStorageInfo("szaselect", result.szaselect); // 是否选择深A
         appUtils.setSStorageInfo("hacnselect", result.shaselect); // 是否选择沪开放式基金
         appUtils.setSStorageInfo("zacnselect", result.szaselect); // 是否选择深开放式基金
         appUtils.setSStorageInfo("openChannel", "new");*/
    }

    /**
     * 校验用户数据
     * 按用户流程跳转
     **/
    function valiDataCustomeInfo(param, codePage) {

        /*if (utils.isAndroid()) {
         var data = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));
         toukerServerPluginCallback(data);
         } else {
         require("shellPlugin").callShellMethod("toukerServerPlugin", function (param) {
         toukerServerPluginCallback(param);
         }, function (data) {
         }, {"command": "requestUrlParamsEncoding", "params": utils.jsonToParams(param)});
         }*/
        toukerServerPluginCallback(param);
        function toukerServerPluginCallback(param) {
            service.serviceAjax("/touker/validateCustInfo", param, function (data) {
                var code = data.status;
                var obj = data.data;
                var reject = obj.reject;
                if ("001003" == code || "001004" == code || "001013" == code || "001038" == code || "001039" == code) {
                    layerUtils.iMsg(-1, data.msg);
                } else {
                    var tpbankFlg = obj.tpbankFlg;
                    var tpAddr = obj.tpAddr;

                    appUtils.setSStorageInfo("tpbankFlg", tpbankFlg);//用户开户标示
                    appUtils.setSStorageInfo("tpAddr", tpAddr);//重置交易密码地址(投客网或者网厅)
                    appUtils.setSStorageInfo("idnoDD", obj.idnoDD);//顶点保存的客户身份证号

                    setSessionStorage(obj);
                    //顶点保存的开户营业部
                    var branchnoDD = obj.branch;
                    if (null != branchnoDD && "undefined" != branchnoDD && "" != branchnoDD) {
                        appUtils.setSStorageInfo("branchno", branchnoDD); //营业部
                    }
                    //已在投客上传影像并审核成功
                    if (code == "001026") {
                        appUtils.setSStorageInfo("idCardImgExist", true);
                        //用顶点的身份证信息，覆盖思迪的信息（已存在客户号）
                        appUtils.setSStorageInfo("idCardNo", obj.idno);
                        appUtils.setSStorageInfo("custname", obj.custname);
                        appUtils.setSStorageInfo("policeorg", obj.policeorg);
                        appUtils.setSStorageInfo("native", obj.natives);
                        appUtils.setSStorageInfo("addr", obj.natives);
                        appUtils.setSStorageInfo("idbegindate", obj.idbegindate);
                        appUtils.setSStorageInfo("idenddate", obj.idenddate);
                        appUtils.setSStorageInfo("postid", obj.postid);
                        appUtils.setSStorageInfo("profession_code", obj.profession_code);
                        appUtils.setSStorageInfo("edu", obj.edu);
                        appUtils.setSStorageInfo("uploadImage", "touker");//投客网上传影像标示
                        appUtils.setSStorageInfo("currentStep", "setpwd");
                        appUtils.pageInit("account/phoneCodeVerify", "account/personInfo");
                    } else if (code == "001024") {
                        //需要重新上传证件
                        appUtils.pageInit("account/phoneCodeVerify", "account/uploadPhoto");
                    } else if (code == "001025") {
                        //待审核,开户成功
                        /*if (valiDataReject(result, codePage)) {
                         appUtils.pageInit("account/phoneCodeVerify", "account/accountSuccess", {"backUrl": "account/phoneNumberVerify"});
                         }*/
                        if ("reject" == reject) {
                            valiDataReject(obj.acceptedRejectLogs, obj.acceptedCustomerInfo, codePage)
                        } else {
                            appUtils.pageInit("account/phoneCodeVerify", "account/accountSuccess", {"backUrl": "account/phoneNumberVerify"});
                        }
                    } else {
                        //判断是否驳回，若驳回 则走驳回流程
                        /*if (valiDataReject(result, codePage)) {
                         //未驳回，则正常走流程
                         pageNextStep(result, tpbankFlg, codePage);
                         }*/
                        if ("reject" == reject) {
                            valiDataReject(obj.acceptedRejectLogs, obj.acceptedCustomerInfo, codePage)
                        } else {
                            pageNextStep(obj.acceptedSchedule, tpbankFlg, codePage);
                        }
                    }
                }
            });
        }
    }

    module.exports = {
        "valiDataReject": valiDataReject,
        "pageNextStep": pageNextStep,
        "setSessionStorage": setSessionStorage,
        "valiDataCustomeInfo": valiDataCustomeInfo
    };
});