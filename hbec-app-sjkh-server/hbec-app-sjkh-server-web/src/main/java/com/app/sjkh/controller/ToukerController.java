package com.app.sjkh.controller;

import com.app.sjkh.commons.servier.EsbApiService;
import com.app.sjkh.commons.servier.ToukerApiService;
import com.app.sjkh.commons.utils.NumberUtils;
import com.app.sjkh.commons.utils.PropertiesUtils;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.pojo.local.AcceptedMediaUrl;
import com.app.sjkh.service.ToukerService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhangweikang on 2016/8/10.
 */
@RequestMapping("touker")
@Controller
public class ToukerController {

    private final Log logger = LogFactory.getLog(ToukerController.class);

    @Autowired
    private ToukerService toukerService;

    @Autowired
    private ToukerApiService toukerApiService;

    @Autowired
    private PropertiesUtils propertiesUtils;

    @Autowired
    private EsbApiService esbApiService;

    /**
     * 判断手机号是否注册投客网
     *
     * @param request
     * @return 001011, 未注册
     * 001012,已注册
     * 001004,参数空
     * 001003,系统异常
     */
    @RequestMapping(value = "isToukerUser", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse isToukerUser(HttpServletRequest request) {

        String mobileNo = request.getParameter("mobileNo");
//        String mobileNo = (String) request.getAttribute("mobileNo");
        if (StringUtils.isEmpty(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "手机号码不能为空");
        }

        try {
            return toukerApiService.accountServiceFindByPhone(mobileNo);
        } catch (Exception e) {
            logger.error("Api查询用户信息失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常.请稍后再试!");
        }
    }

    /**
     * 发送短信验证码
     *
     * @param request
     * @return 001004, 参数异常
     * 001003,系统异常
     * 000000,短信发送成功
     */
    @RequestMapping(value = "sendSMSCode", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse sendSMSCode(HttpServletRequest request) {

        String mobileNo = request.getParameter("mobileNo");
        String ip = request.getParameter("ip");
        String mac = request.getParameter("mac");
        String op_way = request.getParameter("op_way");

//        String mobileNo = (String) request.getAttribute("mobileNo");
//        String ip = (String) request.getAttribute("ip");
//        String mac = (String) request.getAttribute("mac");
//        String op_way = (String) request.getAttribute("op_way");

        logger.info("【sendSmSapi】mobileno=" + mobileNo);
        if (StringUtils.isEmpty(mobileNo) || StringUtils.isEmpty(ip)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "请求参数异常");
        }
        if (!NumberUtils.isMoblie(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "手机号码格式不正确");
        }

        try {
            return toukerService.sendSMSCode(mobileNo, ip, mac, op_way);
        } catch (Exception e) {
            logger.error("短信发送失败,请稍后再试!");
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "短信发送失败,请稍后再试!");
        }
    }

    /**
     * 校验短信验证码,返回用户信息
     * @param request
     * @return
     */
    @RequestMapping(value = "chakeSMSCode", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse chakeSMSCode(HttpServletRequest request) {
        String mobileNo = request.getParameter("mobileNo");
        String mobileCode = request.getParameter("mobileCode");
        String source = request.getParameter("source");
        String ip = request.getParameter("ip");
        String mac = request.getParameter("mac");

//      String mobileNo = (String) request.getAttribute("mobileNo");
//      String mobileCode = (String) request.getAttribute("mobileCode");

        if (StringUtils.isBlank(mobileNo) || StringUtils.isBlank(mobileCode)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "请求参数异常");
        }
        if (!NumberUtils.isMoblie(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "手机号码格式不正确");
        }

        toukerService.valiSmsCheckUserInfo(mobileNo,mobileCode,source,ip,mac);
        return null;
    }

    /**
     * 关联手机号和投客网ID
     *
     * @param request
     * @return 001004, 参数空
     * 001003,系统异常
     * 001011,用户未注册
     * 000000,成功
     */
    @RequestMapping(value = "verifyLogin", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse verifyLogin(HttpServletRequest request) {

        String mobileNo = request.getParameter("mobileNo");
        String channel = request.getParameter("channel");

        //String mobileNo = (String)request.getAttribute("mobileNo");
        //String channel = (String)request.getAttribute("channel");

        if (StringUtils.isEmpty(mobileNo) || StringUtils.isEmpty(channel)) {
            logger.info("mobileNo=" + mobileNo + "channel=" + channel);
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "参数不能为空!");
        }

        try {
            return toukerService.mobileRelationUserId(mobileNo, channel);
        } catch (Exception e) {
            logger.error("关联投客Id异常", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常,请稍后再试");
        }
    }

    /**
     * 注册投客网并关联手机号投客Id
     *
     * @param request
     * @return 001004, 参数空
     * 001003,系统异常
     * 000000,成功
     */
    @RequestMapping(value = "verifyRegister", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse verifyRegister(HttpServletRequest request) {

//		String mobileNo = request.getParameter("mobileNo");
//		String loginPass = request.getParameter("loginPass");
//		String channel = request.getParameter("channel");

        String mobileNo = (String) request.getAttribute("mobileNo");
        String loginPass = (String) request.getAttribute("loginPass");
        String channel = (String) request.getAttribute("channel");

        if (StringUtils.isEmpty(mobileNo) || StringUtils.isEmpty(channel) || StringUtils.isEmpty(loginPass)) {
            logger.info("mobileNo=" + mobileNo + "channel=" + channel);
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "参数不能为空!");
        }

        try {
            return toukerService.registerTouker(mobileNo, loginPass, channel);
        } catch (Exception e) {
            logger.error("注册投客网失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常,请稍后再试");
        }
    }

    /**
     * @param request
     * @return
     */
    @RequestMapping(value = "validateCustInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse validateCustInfo(HttpServletRequest request) {
        String mobileNo = request.getParameter("mobileNo");
        String channel = request.getParameter("channel");
        String customerId = request.getParameter("khh");
        String mobileCode = request.getParameter("mobileCode");
        String source = request.getParameter("source");
        String ip = request.getParameter("ip");
        String mac = request.getParameter("mac");

//        String mobileNo = (String) request.getAttribute("mobileNo");
//        String channel = (String) request.getAttribute("channel");
//        String customerId = (String) request.getAttribute("khh");
//        String loginFlag = (String) request.getAttribute("login_flag");
//        String opway = (String) request.getAttribute("op_way");

        if (StringUtils.isEmpty(mobileNo) || StringUtils.isEmpty(channel)) {
            logger.info("mobileNo=" + mobileNo + "channel=" + channel + "source=" + source);
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "参数不能为空!");
        }

        try {
            //校验短信
            ResultResponse resultResponse2 = toukerService.valiSmsCheckUserInfo(mobileNo, mobileCode, source, ip, mac);

            //手机号绑定toukerId
            toukerService.mobileRelationUserId(mobileNo, channel);

            //校验用户数据
            ResultResponse resultResponse = toukerService.validateCustInfo(mobileNo, customerId, StringUtils.isEmpty(source) ? 0 : Integer.valueOf(source));

            //判断用户绑卡数据
            Map<String, String> data = (Map<String, String>) resultResponse.getData();
            if (StringUtils.isEmpty(customerId)) {
                ResultResponse resultResponse1 = toukerService.queryInfoBank(customerId);
                String status = resultResponse1.getStatus();
                String tpAddr = "";
                if (ResultCode.HBEC_001015.getCode().equals(status)) {
                    tpAddr = propertiesUtils.get("pwdVerifyAddTp1");
                } else if (ResultCode.HBEC_001017.getCode().equals(status)) {
                    tpAddr = propertiesUtils.get("pwdVerifyAddTp2");
                }
                data.put("tpbankFlg", status);
                data.put("tpAddr", tpAddr);
            } else {
                data.put("tpbankFlg", ResultCode.HBEC_001020.getCode());
                data.put("tpAddr", "");
            }
            data.putAll((Map<String,String>) resultResponse2.getData());
            if (ResultCode.HBEC_001040.getCode().compareTo(resultResponse2.getStatus()) == 0){
                data.put("reject","reject");
            }
            resultResponse.setData(data);
            return resultResponse;
        } catch (Exception e) {
            logger.error("系统异常", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * 清除用户信息
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "clearUnSubmitUserInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse clearUnSubmitUserInfo(HttpServletRequest request) {
        String userId = request.getParameter("user_id");
        String idno = request.getParameter("idno");

//		String userId = (String)request.getAttribute("user_id");
//		String idno = (String)request.getAttribute("idno");

        if (StringUtils.isEmpty(userId) || StringUtils.isEmpty(idno)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }
        try {
            System.out.println("request = [" + request + "]");
            return toukerService.clearUnSubmitUserInfo(idno, userId);
        } catch (Exception e) {
            logger.error("清除用户信息异常", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * 校验交易密码
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "validatePwd", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse validatePwd(HttpServletRequest request) {
        String customerId = request.getParameter("khh");
        String password = request.getParameter("password");
        String ip = request.getParameter("ip");

//		String customerId = (String)request.getAttribute("khh");
//		String password = (String)request.getAttribute("password");
//		String ip = (String)request.getAttribute("ip");

        if (StringUtils.isEmpty(customerId) || StringUtils.isEmpty(password) || StringUtils.isEmpty(ip)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }

        return esbApiService.vaildataTradePwd(customerId, password, ip);
    }

    @RequestMapping(value = "getBranchInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse getBranchInfo(HttpServletRequest request) {
        String mobileNo = (String) request.getAttribute("mobileNo");

        if (StringUtils.isEmpty(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }
        try {
            return toukerService.getBranchInfo(mobileNo);
        } catch (Exception e) {
            logger.error("获取服务营业部失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    @RequestMapping(value = "bindServiceBranch", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse bindServiceBranch(HttpServletRequest request) {
        String mobileNo = (String) request.getAttribute("mobileNo");
        String branchNo = (String) request.getAttribute("branchno");

        if (StringUtils.isEmpty(mobileNo) || StringUtils.isEmpty(branchNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }
        try {
            toukerService.bindServiceBranch(mobileNo, branchNo);
            return ResultResponse.ok();
        } catch (Exception e) {
            logger.error("获取服务营业部失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    @RequestMapping(value = "getPhoto", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse getPhoto(HttpServletRequest request) {
        String id = (String) request.getAttribute("id");

        if (StringUtils.isEmpty(id)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }

        try {
            AcceptedMediaUrl bean = new AcceptedMediaUrl();
            bean.setUserid(id);
            return toukerService.getPhoto(bean);
        } catch (Exception e) {
            logger.error("获取用户上传身份证影像失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "获取用户上传身份证影像失败");
        }
    }

    @RequestMapping(value = "getCertInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse getCertInfo(HttpServletRequest request) {
        String id = (String) request.getAttribute("id");

        if (StringUtils.isEmpty(id)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }

        try {
            AcceptedCertInfo bean = new AcceptedCertInfo();
            bean.setId(Long.valueOf(id));
            return toukerService.getCertInfo(bean);
        } catch (Exception e) {
            logger.error("获取用户上传身份证影像失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "获取用户上传身份证影像失败");
        }
    }
}
