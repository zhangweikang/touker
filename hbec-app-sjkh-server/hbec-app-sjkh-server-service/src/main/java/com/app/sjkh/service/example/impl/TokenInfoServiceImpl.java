package com.app.sjkh.service.example.impl;

import com.app.sjkh.pojo.local.TokenInfo;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.TokenInfoService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/3.
 */
@Service
public class TokenInfoServiceImpl extends HbecBaseServiceImpl<TokenInfo,String> implements TokenInfoService {

	private final Log logger = LogFactory.getLog(TokenInfoServiceImpl.class);

}
