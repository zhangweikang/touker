package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.AcceptedScheduleMapper;
import com.app.sjkh.pojo.local.AcceptedSchedule;
import com.app.sjkh.service.base.HbecBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/15.
 */
@Service
public class AcceptedScheduleService extends HbecBaseService<AcceptedSchedule,String> {

	@Autowired
	private AcceptedScheduleMapper acceptedScheduleMapper;

	public AcceptedSchedule getAuditInfo(String mobileNo) throws Exception {
		String backStep = "a";
		List<AcceptedSchedule> auditInfo = acceptedScheduleMapper.getAuditInfo(backStep,mobileNo);
		if (auditInfo != null && auditInfo.size()>0){
			return auditInfo.get(0);
		}
		return null;
	}

	public AcceptedSchedule getUnSubmitInfo(String mobileNo) throws Exception {
		String backStep = "0";
		List<AcceptedSchedule> auditInfo = acceptedScheduleMapper.getAuditInfo(backStep,mobileNo);
		if (auditInfo != null && auditInfo.size()>0){
			return auditInfo.get(0);
		}
		return null;
	}

	/**
	 * 用户开户进度报表统计
	 * @param beginDate
	 * @param endDate
	 * @return
	 * @throws Exception
	 */
	public List<AcceptedSchedule> getScheduleReport(String beginDate, String endDate) throws Exception {
		return acceptedScheduleMapper.getScheduleReport(beginDate, endDate);
	}

}
