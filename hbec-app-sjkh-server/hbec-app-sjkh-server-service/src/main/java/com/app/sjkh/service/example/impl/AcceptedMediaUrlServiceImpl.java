package com.app.sjkh.service.example.impl;

import com.app.sjkh.mapper.sjdatasource.AcceptedMediaUrlMapper;
import com.app.sjkh.pojo.local.AcceptedMediaUrl;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.AcceptedMediaUrlService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 用户影像资料表Service
 * Created by Administrator on 2016/9/29.
 */
@Service
public class AcceptedMediaUrlServiceImpl extends HbecBaseServiceImpl<AcceptedMediaUrl,String> implements AcceptedMediaUrlService {

    private static final Log logger = LogFactory.getLog(AcceptedMediaUrlServiceImpl.class);
    @Autowired
    private AcceptedMediaUrlMapper acceptedMediaUrlMapper;

    /**
     * 获取序列
     * @return
     */
    public String querySequence(){
        String sequence = "";

        try {
            sequence = acceptedMediaUrlMapper.querySequence();
        } catch (Exception e) {
            logger.error("获取序列失败",e);
        }
        return sequence;
    }
}
