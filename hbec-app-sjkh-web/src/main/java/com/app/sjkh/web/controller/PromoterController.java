package com.app.sjkh.web.controller;

import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.web.service.PromoterServiceImpl;
import com.app.sjkh.web.service.impl.PromoterService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private PromoterService promoterService;

    /**
     * 钱钱推广页面
     *
     * @param request
     * @param response
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "promoteInfo")
    public ModelAndView mobileOpenAccountIndex(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ModelAndView mv = new ModelAndView("promote/promoteInfo");
        return mv;
    }

    /**
     * 手机开户推广页面
     *
     * @param request
     * @param response
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "promoteInfo_hbstock")
    public ModelAndView qianQianStockIndex(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ModelAndView mv = new ModelAndView("promote/promoteInfo_hbstock");
        return mv;
    }

    @RequestMapping(value = "mobileOpenAccount", method = RequestMethod.POST)
    public void mobileOpenAccount(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String phone = (String) request.getAttribute("phoneNo");
        String fwry = (String) request.getAttribute("fwry");
        promoterService.setBranchnoInLocal(phone, fwry, Constants.MOBILEOPENACCOUNT_CHANNEL);
        response.sendRedirect(Constants.MOBILEOPENACCOUNT_APP_URL);
        return;
    }

    @RequestMapping(value = "qianQianStock", method = RequestMethod.POST)
    public void qianQianStock(@RequestParam("phoneno")String phone,@RequestParam("fwry")String fwry,HttpServletResponse response,HttpServletRequest request) throws IOException {
        promoterService.setBranchnoInLocal(phone, fwry, Constants.QIANQIANSTOCK_CHANNEL);
        response.sendRedirect(Constants.QIANQIANSTOCK_APP_URL);
        return;
    }

}
