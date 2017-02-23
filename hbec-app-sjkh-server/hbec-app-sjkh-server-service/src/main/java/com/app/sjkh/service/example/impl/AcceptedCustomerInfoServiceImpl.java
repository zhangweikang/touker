package com.app.sjkh.service.example.impl;

import com.app.sjkh.mapper.sjdatasource.AcceptedCustomerInfoMapper;
import com.app.sjkh.pojo.local.AcceptedCustomerInfo;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.AcceptedCustomerInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/12.
 */
@Service
public class AcceptedCustomerInfoServiceImpl extends HbecBaseServiceImpl<AcceptedCustomerInfo,Long> implements AcceptedCustomerInfoService {

	@Autowired
	private AcceptedCustomerInfoMapper acceptedCustomerInfoMapper;

	public AcceptedCustomerInfo queryOneByMoblie(String mobileNo) throws Exception {
		AcceptedCustomerInfo custInfo = new AcceptedCustomerInfo();
		custInfo.setMobileno(mobileNo);
		return super.queryOneByWhere(custInfo);
	}

	public Integer deleteByMobileNo(String mobileNo) throws Exception {
		return acceptedCustomerInfoMapper.deleteByMobileNo(mobileNo);
	}

	public Integer deleteByuserId(Long userId) throws Exception {
		return acceptedCustomerInfoMapper.deleteByUserId(userId);
	}

	/**
	 * 根据时间段查询开户成功的用户
	 *
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public List<AcceptedCustomerInfo> getTimedOpenAccount(String beginDate , String endDate) throws Exception {
		return acceptedCustomerInfoMapper.getTimedOpenAccount(beginDate, endDate);
	}

	/**
	 * 获取序列
	 * @return
	 */
	public String querySequence() throws Exception {
		return acceptedCustomerInfoMapper.querySequence();
	}
}
