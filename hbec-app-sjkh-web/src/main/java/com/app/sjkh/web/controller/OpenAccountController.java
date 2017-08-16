package com.app.sjkh.web.controller;

import com.app.sjkh.web.service.OpenAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 开户controller
 * Created by zhangweikang on 2017/8/16.
 */
@RequestMapping("openAccount")
@Controller
public class OpenAccountController {

    @Autowired
    private OpenAccountService openAccountService;

    @RequestMapping(value = "task",method = RequestMethod.POST)
    @ResponseBody
    public void openAccount(){
        for (int i = 0; i < 10; i++) {
            openAccountService.openAccount("12345" + i);
        }
    }
}
