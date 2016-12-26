package com.app.sjkh.service.example.impl;

import com.app.sjkh.pojo.local.AcceptedSmsLimit;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.AcceptedSmsLimitService;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/10.
 */
@Service
public class AcceptedSmsLimitServiceImpl extends HbecBaseServiceImpl<AcceptedSmsLimit,String> implements AcceptedSmsLimitService {


	public AcceptedSmsLimit getSmsLog(AcceptedSmsLimit bean) throws Exception {

		AcceptedSmsLimit acceptedSmsLimit = super.queryById(bean.getClientSource());

		if(acceptedSmsLimit == null){
			bean.setSendCount(0);
			super.save(bean);
			return bean;
		}
		return acceptedSmsLimit;
	}

	public Integer updateSendCount(AcceptedSmsLimit bean) throws Exception {
		return super.updateSelective(bean);
	}
}
