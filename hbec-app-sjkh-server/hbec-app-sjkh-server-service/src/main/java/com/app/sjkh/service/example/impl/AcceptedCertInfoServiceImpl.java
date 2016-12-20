package com.app.sjkh.service.example.impl;

import com.app.sjkh.mapper.sjdatasource.AcceptedCertInfoMapper;
import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.service.base.HbecBaseService;
import com.app.sjkh.service.example.AcceptedCertInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/5.
 */
@Service
public class AcceptedCertInfoServiceImpl extends HbecBaseService<AcceptedCertInfo, Long> implements AcceptedCertInfoService {

	@Autowired
	private AcceptedCertInfoMapper acceptedCertInfoMapper;

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
	public AcceptedCertInfo getCertInfo(String mobileNo) throws Exception {
		AcceptedCertInfo queryBean = new AcceptedCertInfo();
		queryBean.setMobileno(mobileNo);
		AcceptedCertInfo acceptedCertInfo = super.queryOneByWhere(queryBean);

		if (acceptedCertInfo == null) {
			queryBean.setId(Long.valueOf(querySequence()));
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
