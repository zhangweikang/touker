package com.app.sjkh.mq;

import com.app.sjkh.utils.JacksonUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;

/**
 * Created by zhangweikang on 2017/8/16.
 */
@Component("openAccountMq")
public class OpenAccountMq implements MessageListener{
    public void onMessage(Message message) {
        byte[] body = message.getBody();

        String result = new String(body);

        HashMap<String, String> stringStringHashMap = JacksonUtil.readValue(result, new TypeReference<HashMap<String, String>>() {
        });
        System.out.println("stringStringHashMap = " + stringStringHashMap);
    }
}
