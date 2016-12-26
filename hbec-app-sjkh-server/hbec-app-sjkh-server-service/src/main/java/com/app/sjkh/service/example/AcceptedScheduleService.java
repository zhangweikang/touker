package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedSchedule;
import com.app.sjkh.service.base.HbecBaseService;

import java.util.List;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface AcceptedScheduleService extends HbecBaseService<AcceptedSchedule, String>{

    AcceptedSchedule getAuditInfo(String mobileNo) throws Exception;

    AcceptedSchedule getUnSubmitInfo(String mobileNo) throws Exception;

    List<AcceptedSchedule> getScheduleReport(String beginDate, String endDate) throws Exception;

    AcceptedSchedule getSchedule(String userId) throws Exception;
}
