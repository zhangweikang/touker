package com.app.sjkh.web.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.facade.business.PromoterService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 对外推广页面
 * Created by zhangweikang on 2016/8/22.
 */
@RequestMapping("promoter")
@Controller
public class PromoterController {

    @Reference
    private PromoterService promoterService;

    /**
     * 钱钱推广页面
     * @throws IOException
     */
    @RequestMapping(value = "promoteInfo")
    public ModelAndView mobileOpenAccountIndex() throws IOException {
        return new ModelAndView("promote/promoteInfo");
    }

    /**
     * 手机开户推广页面
     *
     * @throws IOException
     */
    @RequestMapping(value = "promoteInfo_hbstock")
    public ModelAndView qianQianStockIndex() throws IOException {
        return new ModelAndView("promote/promoteInfo_hbstock");
    }

    @RequestMapping(value = "mobileOpenAccount", method = RequestMethod.POST)
    public void mobileOpenAccount(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String phone = (String) request.getAttribute("phoneNo");
        String fwry = (String) request.getAttribute("fwry");
        setBranchnoInLocal(phone, fwry, Constants.MOBILEOPENACCOUNT_CHANNEL);
        response.sendRedirect(Constants.MOBILEOPENACCOUNT_APP_URL);
    }

    @RequestMapping(value = "qianQianStock", method = RequestMethod.POST)
    public void qianQianStock(@RequestParam("phoneno")String phone,@RequestParam("fwry")String fwry,HttpServletResponse response) throws IOException {
        setBranchnoInLocal(phone, fwry, Constants.QIANQIANSTOCK_CHANNEL);
        response.sendRedirect(Constants.QIANQIANSTOCK_APP_URL);
    }


    private void setBranchnoInLocal(String phone,String fwry ,String channel){
        //记录经纪人关系
        promoterService.addPromoteCust(phone, fwry, channel);
        //记录服务营业部
        promoterService.addCustServiceBranch(phone, fwry);
    }
}
