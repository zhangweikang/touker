package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.AcceptedCertInfoMapper;
import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.service.base.HbecBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/5.
 */
@Service
public class AcceptedCertInfoService extends HbecBaseService<AcceptedCertInfo, Long> {

	@Autowired
	private AcceptedCertInfoMapper acceptedCertInfoMapper;

	public Integer updateByMoblieNoSelective(AcceptedCertInfo bean) throws Exception {
		return acceptedCertInfoMapper.updateByMoblieNoSelective(bean);
	}

	public List<AcceptedCertInfo> getCertInfoAcceptedSchedule(String idno, String userId) throws Exception {
		return acceptedCertInfoMapper.getCertInfoAcceptedSchedule(idno, userId);
	}
}
