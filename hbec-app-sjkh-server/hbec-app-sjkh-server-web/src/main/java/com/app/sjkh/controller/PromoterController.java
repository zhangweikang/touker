package com.app.sjkh.controller;

import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.service.PromoterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 对外推广页面
 * Created by zhangweikang on 2016/8/22.
 */
@RequestMapping("promoter")
@Controller
public class PromoterController {

    @Autowired
    private PromoterService promoterService;

    @RequestMapping(value = "set/branchno", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse setBranchnoInLocal(@RequestParam("phone") String phone, @RequestParam("fwry") String fwry, @RequestParam("channel") String channel) {

        //记录经纪人关系
        promoterService.addPromoteCust(phone, fwry, channel);
        //记录服务营业部
        promoterService.addCustServiceBranch(phone, fwry);

        return ResultResponse.ok();
    }
}
