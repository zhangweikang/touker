package com.app.sjkh.web.service.impl;

import com.app.sjkh.commons.utils.JacksonUtil;
import com.app.sjkh.web.service.OpenAccountService;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhangweikang on 2017/8/16.
 */
@Service
public class OpenAccountServiceImpl implements OpenAccountService {
    @Autowired
    private AmqpTemplate amqpTemplate;

    public void openAccount(String userId) {
        Map<String,String> map = new HashMap<String, String>();
        map.put("userId",userId);

        String s = JacksonUtil.toJSon(map);

        amqpTemplate.convertAndSend("openAccount",s);
    }
}
