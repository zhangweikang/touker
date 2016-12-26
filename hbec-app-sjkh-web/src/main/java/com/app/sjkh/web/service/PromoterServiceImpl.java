package com.app.sjkh.web.service;

import com.app.sjkh.commons.servier.ApiService;
import com.app.sjkh.web.service.impl.PromoterService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2016/12/6.
 */
@Service
public class PromoterServiceImpl implements PromoterService {

    private Log logger = LogFactory.getLog(PromoterServiceImpl.class);

    @Autowired
    private ApiService apiService;

    @Value("${PROMOTER_SET_BRANCHNO}")
    private String PROMOTER_SET_BRANCHNO;

    public void setBranchnoInLocal(String phone, String fwry, String channel) {
        Map<String,String> map = new HashMap<>();
        map.put("phone",phone);
        map.put("fwry",fwry);
        map.put("channel",channel);
        try {
            apiService.doPost(PROMOTER_SET_BRANCHNO,map);
        } catch (IOException e) {
            logger.error("设置用户营业部失败",e);
        }
    }
}
