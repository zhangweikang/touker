package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.TokenInfoMapper;
import com.app.sjkh.pojo.local.TokenInfo;
import com.app.sjkh.service.base.HbecBaseService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/3.
 */
@Service
public class TokenInfoService extends HbecBaseService<TokenInfo,String> {

	private final Log logger = LogFactory.getLog(TokenInfoService.class);

}
