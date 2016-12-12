package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.AcceptedSmsLimitMapper;
import com.app.sjkh.pojo.local.AcceptedSmsLimit;
import com.app.sjkh.service.base.HbecBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/10.
 */
@Service
public class AcceptedSmsLimitService extends HbecBaseService<AcceptedSmsLimit,String> {

	@Autowired
	private AcceptedSmsLimitMapper acceptedSmsLimitMapper;

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
