package com.app.sjkh.service.example.impl;

import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.mapper.sjdatasource.AcceptedCertInfoMapper;
import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.AcceptedCertInfoService;
import com.app.sjkh.service.example.AcceptedCustomerInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Created by zhangweikang on 2016/8/5.
 */
@Service
public class AcceptedCertInfoServiceImpl extends HbecBaseServiceImpl<AcceptedCertInfo, Long> implements AcceptedCertInfoService {

	@Autowired
	private AcceptedCertInfoMapper acceptedCertInfoMapper;
	@Autowired
	private AcceptedCustomerInfoService acceptedCustomerInfoService;

	public Integer updateByMoblieNoSelective(AcceptedCertInfo bean) throws Exception {
		return acceptedCertInfoMapper.updateByMoblieNoSelective(bean);
	}

	public List<AcceptedCertInfo> getCertInfoAcceptedSchedule(String idno, String userId) throws Exception {
		return acceptedCertInfoMapper.getCertInfoAcceptedSchedule(idno, userId);
	}

	/**
	 * 根据手机号获取用户信息,如果不存在则创建用户
	 * @param mobileNo
	 * @return
     */
	public AcceptedCertInfo getCertInfo(String mobileNo,Integer opway) throws Exception {
		AcceptedCertInfo queryBean = new AcceptedCertInfo();
		queryBean.setMobileno(mobileNo);
		AcceptedCertInfo acceptedCertInfo = super.queryOneByWhere(queryBean);

		if (acceptedCertInfo == null) {
			queryBean.setId(Long.valueOf(acceptedCustomerInfoService.querySequence()));
			queryBean.setOpacctkindFlag(AcceptedCertInfo.State_0);
			queryBean.setAccessChannel(opway);
			queryBean.setState("0");
			queryBean.setCreatedate(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
			super.saveSelective(queryBean);
			return queryBean;
		}

		return acceptedCertInfo;
	}

	/**
	 * 获取序列
	 * @return
	 */
	public String querySequence() throws Exception {
		return acceptedCertInfoMapper.querySequence();
	}
}
