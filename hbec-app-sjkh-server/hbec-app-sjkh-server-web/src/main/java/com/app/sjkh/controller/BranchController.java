package com.app.sjkh.controller;

import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.service.example.BBranchService;
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
 * 营业部相关请求
 * Created by Administrator on 2016/12/19.
 */
@RequestMapping("branch")
@Controller
public class BranchController {

    private final static Log logger = LogFactory.getLog(BranchController.class);

    @Autowired
    private BBranchService bBranchServiceImpl;

    @RequestMapping(value = "getBranchInfo", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse getBranchInfo(HttpServletRequest request) {

        String mobileNo = request.getParameter("mobileNo");
//        String mobileNo = (String) request.getAttribute("mobileNo");
        if (StringUtils.isBlank(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), "手机号码不能为空");
        }

        try {
            return bBranchServiceImpl.getBranchInfoByMobilNo(mobileNo);
        } catch (Exception e) {
            logger.error("获取用户服务营业部失败!", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常.请稍后再试!");
        }
    }
    @RequestMapping(value = "bindServiceBranch", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse bindServiceBranch(HttpServletRequest request) {

        String mobileNo = request.getParameter("mobileNo");
        String branchNo = request.getParameter("branchNo");
//        String mobileNo = (String) request.getAttribute("mobileNo");
//        String branchNo = (String) request.getAttribute("branchNo");
        if (StringUtils.isBlank(mobileNo) || StringUtils.isBlank(branchNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }

        try {
            return bBranchServiceImpl.bindServiceBranch(mobileNo,branchNo);
        } catch (Exception e) {
            logger.error("获取用户服务营业部失败!", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常.请稍后再试!");
        }
    }
}
