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
        newStepMap0 = {
            "uploadimg": "account/uploadPhotoChange",
            "witness": "account/digitalCertificate"
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
    function valiDataReject(result, codePage) {
        //驳回情况：身份证正面、反面、大头像、交易密码、资金密码、三方存管、转户驳回到视频见证
        var photoParam = {
            "needFront": result.need_photo_front != undefined ? result.need_photo_front : "0",
            "needBack": result.need_photo_back != undefined ? result.need_photo_back : "0",
            "needNohat": result.need_photo_nohat != undefined ? result.need_photo_nohat : "0"
        };
        //交易密码
        var pwdParam = {
            "needBusinessPwd": result.need_business_password != undefined ? result.need_business_password : "0",
            "needFundPwd": result.need_fund_password != undefined ? result.need_fund_password : "0"
        };
        //开立账户
        var accountParam = {
            "need_account": result.need_account != undefined ? result.need_account : "0"
        };
        //视频见证
        var videoParam = {
            "need_video": result.need_video != undefined ? result.need_video : "0"
        };
        //三方存管
        var thirdParam = {
            "needThirdDeposit": result.need_third_deposit != undefined ? result.need_third_deposit : "0"
        };
        appUtils.setSStorageInfo("videoParam", JSON.stringify(videoParam));
        appUtils.setSStorageInfo("pwdParam", JSON.stringify(pwdParam));
        appUtils.setSStorageInfo("thirdParam", JSON.stringify(thirdParam));
        appUtils.setSStorageInfo("accountParam", JSON.stringify(accountParam));
        // 1.补全照片
        if (photoParam["needFront"] == 1 || photoParam["needBack"] == 1 || photoParam["needNohat"] == 1) {
            appUtils.pageInit("account/phoneCodeVerify", "account/backUploadPhoto", photoParam);
            return;
        }
        // 2.驳回视频见证
        if (videoParam["need_video"] == 1) {
            appUtils.pageInit(codePage, "account/videoNotice", videoParam);
            return;
        }
        // 3.驳回密码设置
        if (pwdParam["needBusinessPwd"] == 1 || pwdParam["needFundPwd"] == 1) {
            appUtils.pageInit(codePage, "account/backSetPwd", pwdParam);
            return;
        }
        // 4.驳回三方存管
        if (thirdParam["needThirdDeposit"] == 1) {
            appUtils.pageInit(codePage, "account/backThirdDepository", thirdParam);
            return;
        }
        // 5.驳回开立账户
        if (accountParam["need_account"] == 1) {
            appUtils.pageInit(codePage, "account/backSignProtocol", accountParam);
            return;
        }

        return true;
    }

    /**
     * 用户没有驳回数据,用户继续开户
     * result 短信校验成功后返回用户数据
     * tpbankFlg 0：未绑定三方存管和三方支付 1：一定绑定了三方存管，还可能绑定了三方支付 2：只绑定了三方支付
     * codePage 当前页面
     **/
    function pageNextStep(result, tpbankFlg, codePage) {
        console.log("继续开户tpbankFlg=" + tpbankFlg);
        var newPageCode = "";
        var openAccountFlag = result.opacctkind_flag;
        var depositoryPageCode = ""; //已绑定三方存管
        var partiesPayPageCode = ""; //已绑定三方支付
        var currentStep = result["lastcomplete_step"]; //断点：上次走的最后一步
        appUtils.setSStorageInfo("currentStep", currentStep);
        if (currentStep && currentStep.length > 0) {
            var index;
            if (tpbankFlg == "1") {
                index = depositorySteps.indexOf(currentStep);
                if (index < (depositorySteps.length - 1)) {
                    currentStep = depositorySteps[index + 1];
                }
            } else if (tpbankFlg == "2") {
                index = partiesPaySteps.indexOf(currentStep);
                if (index < (partiesPaySteps.length - 1)) {
                    currentStep = partiesPaySteps[index + 1];
                }
            } else {
                index = newSteps.indexOf(currentStep);
                if (index < (newSteps.length - 1)) {
                    currentStep = newSteps[index + 1];
                }
            }

            //新开户
            newPageCode = newStepMap[currentStep];
            depositoryPageCode = depositoryStepsMap[currentStep];
            partiesPayPageCode = partiesPayStepMap[currentStep];
        }

        if (newPageCode && newPageCode.length > 0) {
            // 如果是直接跳转到 视频认证 页面，将 QQ 保存到 session 中
            if (newPageCode == "account/videoNotice") {
                appUtils.setSStorageInfo("qq", result.im_code);
            }
            //开通三方存管或者三方支付标志（1：一定绑定了三方存管，还可能绑定了三方支付  	2：只绑定了三方支付	0：未绑定三方存管和三方支付）
            console.log("继续开户tpbankFlg=" + tpbankFlg + " currentStep=" + currentStep + " newPageCode=" + newPageCode + " depositoryPageCode=" + depositoryPageCode + " partiesPayPageCode=" + partiesPayPageCode);
            if (tpbankFlg == '1') { //绑定了三方存管
                appUtils.pageInit("account/phoneCodeVerify", depositoryPageCode);
            } else if (tpbankFlg == '2') { //绑定了三方支付
                appUtils.pageInit("account/phoneCodeVerify", partiesPayPageCode);
            } else { //未绑定三方存管和三方支付
                appUtils.pageInit("account/phoneCodeVerify", newPageCode);
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

    function setSessionStorage(result) {
        // user_id保存到session
        if (result.user_id) {
            appUtils.setSStorageInfo("user_id", result.user_id);
        }
        // 身份证号保存到session
        if (result.idno) {
            appUtils.setSStorageInfo("idCardNo", result.idno);
        }
        //手机号保存到session
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
        // 将佣金id保存到session
        if (result.commission) {
            appUtils.setSStorageInfo("commission", result.commission);
        }
        // 将佣金值保存到session
        if (result.commissionname) {
            appUtils.setSStorageInfo("commissionname", result.commissionname);
        }
        // 将营业部Id保存到session
        if (result.branchno) {
            appUtils.setSStorageInfo("branchno", result.branchno);
        }
        // 将营业部名称保存到session
        if (result.branchname) {
            appUtils.setSStorageInfo("branchname", result.branchname);
        }
        // 将省份保存到session
        if (result.provincename) {
            appUtils.setSStorageInfo("provincename", result.provincename);
        }
        // 将城市保存到session
        if (result.cityname) {
            appUtils.setSStorageInfo("cityname", result.cityname);
        }
        // 将银行代码保存到session
        if (result.banktype) {
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
        appUtils.setSStorageInfo("shaselect", result.shaselect); // 是否选择沪A
        appUtils.setSStorageInfo("szaselect", result.szaselect); // 是否选择深A
        appUtils.setSStorageInfo("hacnselect", result.shaselect); // 是否选择沪开放式基金
        appUtils.setSStorageInfo("zacnselect", result.szaselect); // 是否选择深开放式基金
        appUtils.setSStorageInfo("openChannel", "new");
    }

    /**
     * 校验用户数据
     * 按用户流程跳转
     **/
    function valiDataCustomeInfo(result, param, codePage) {

        if (utils.isAndroid()) {
            var data = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));
            toukerServerPluginCallback(data);
        } else {
            require("shellPlugin").callShellMethod("toukerServerPlugin", function (param) {
                toukerServerPluginCallback(param);
            }, function (data) {
            }, {"command": "requestUrlParamsEncoding", "params": utils.jsonToParams(param)});
        }

        function toukerServerPluginCallback(param) {
            service.serviceAjax("/touker/validateCustInfo", param, function (data) {
                var code = data.status;
                var obj = data.data;
                if ("001003" == code || "001004" == code) {
                    layerUtils.iMsg(-1, data.msg);
                } else {
                    var tpbankFlg = obj.tpbankFlg;
                    var tpAddr = obj.tpAddr;

                    appUtils.setSStorageInfo("tpbankFlg", tpbankFlg);//用户开户标示
                    appUtils.setSStorageInfo("tpAddr", tpAddr);//重置交易密码地址(投客网或者网厅)
                    appUtils.setSStorageInfo("idnoDD", dataSet.idnoDD);//顶点保存的客户身份证号

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
                        if (valiDataReject(result, codePage)) {
                            appUtils.pageInit("account/phoneCodeVerify", "account/accountSuccess", {"backUrl": "account/phoneNumberVerify"});
                        }
                    } else {
                        //判断是否驳回，若驳回 则走驳回流程
                        if (valiDataReject(result, codePage)) {
                            //未驳回，则正常走流程
                            pageNextStep(result, tpbankFlg, codePage);
                        }
                    }
                }
            });
        }
    }

    var checkSmsPage = {
        "valiDataReject": valiDataReject,
        "pageNextStep": pageNextStep,
        "setSessionStorage": setSessionStorage,
        "valiDataCustomeInfo": valiDataCustomeInfo
    }
    module.exports = checkSmsPage;
});