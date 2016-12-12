package com.app.sjkh.controller;

import com.app.sjkh.commons.utils.NumberUtils;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.service.QianQianStockService;
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

/**
 * Created by zhangweikang on 2016/8/17.
 */
@RequestMapping("qianqian")
@Controller
public class QianQianStockController {

    private final Log logger = LogFactory.getLog(QianQianStockController.class);

    @Autowired
    private ToukerService toukerService;

    @Autowired
    private QianQianStockService qianQianStockService;

    @RequestMapping(value = "qqAccess", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse qqAccess(HttpServletRequest request) {
        String mobileNo = request.getParameter("mobileNo");
        String channel = request.getParameter("channel");

//		String mobileNo = (String)request.getAttribute("mobileNo");
//		String channel = (String)request.getAttribute("channel");

        if (StringUtils.isEmpty(mobileNo) || StringUtils.isEmpty(channel)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }
        if (!NumberUtils.isMoblie(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "手机号格式不正确");
        }

        try {
            toukerService.mobileRelationUserId(mobileNo, channel);
            return qianQianStockService.genAndSaveSmsCode(mobileNo);
        } catch (Exception e) {
            logger.error("系统异常", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    @RequestMapping(value = "queryAccStat", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse queryAccStat(HttpServletRequest request) {
        String mobileNo = request.getParameter("mobileNo");

        //String mobileNo = (String)request.getAttribute("mobileNo");

        if (StringUtils.isEmpty(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }
        if (!NumberUtils.isMoblie(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "手机号格式不正确");
        }

        try {
            return qianQianStockService.getOpenStockState(mobileNo);
        } catch (Exception e) {
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }
}
