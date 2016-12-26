package com.app.sjkh.service.example.impl;

import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.mapper.sjdatasource.AcceptedScheduleMapper;
import com.app.sjkh.pojo.local.AcceptedSchedule;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.AcceptedScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户开户流程Service
 * Created by zhangweikang on 2016/8/15.
 */
@Service
public class AcceptedScheduleServiceImpl extends HbecBaseServiceImpl<AcceptedSchedule, String> implements AcceptedScheduleService {

    @Autowired
    private AcceptedScheduleMapper acceptedScheduleMapper;

    public AcceptedSchedule getAuditInfo(String mobileNo) throws Exception {
        String backStep = "a";
        List<AcceptedSchedule> auditInfo = acceptedScheduleMapper.getAuditInfo(backStep, mobileNo);
        if (auditInfo != null && auditInfo.size() > 0) {
            return auditInfo.get(0);
        }
        return null;
    }

    public AcceptedSchedule getUnSubmitInfo(String mobileNo) throws Exception {
        String backStep = "0";
        List<AcceptedSchedule> auditInfo = acceptedScheduleMapper.getAuditInfo(backStep, mobileNo);
        if (auditInfo != null && auditInfo.size() > 0) {
            return auditInfo.get(0);
        }
        return null;
    }

    /**
     * 用户开户进度报表统计
     *
     * @param beginDate
     * @param endDate
     * @return
     * @throws Exception
     */
    public List<AcceptedSchedule> getScheduleReport(String beginDate, String endDate) throws Exception {
        return acceptedScheduleMapper.getScheduleReport(beginDate, endDate);
    }

    /**
     * 根据userId获取用户流程,没有则创建一个新的
     * @param userId
     * @return
     * @throws Exception
     */
    public AcceptedSchedule getSchedule(String userId) throws Exception {
        AcceptedSchedule queryBean = new AcceptedSchedule();
        queryBean.setUserId(userId);

        AcceptedSchedule acceptedSchedule = queryOneByWhere(queryBean);

        if (acceptedSchedule == null){
            queryBean.setUpdateTime(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
            queryBean.setState("0");
            queryBean.setStartTime(queryBean.getUpdateTime());
            queryBean.setId(acceptedScheduleMapper.querySequence());
            queryBean.setBusiness("1");
            queryBean.setBackStep("0");
            queryBean.setCurrentStep("");
            queryBean.setUploadimgFlag("0");
            queryBean.setIdconfirmFlag("0");
            queryBean.setWitnessFlag("0");
            queryBean.setCertintallFlag("0");
            queryBean.setCapitalacctFlag("0");
            queryBean.setStkacctFlag("0");
            queryBean.setOpfndacctFlag("0");
            queryBean.setSetpwdFlag("0");
            queryBean.setTpbankFlag("0");
            queryBean.setRisksurveyFlag("0");
            queryBean.setVisitsurveyFlag("0");

            super.saveSelective(queryBean);
             return queryBean;
        }

            return acceptedSchedule;
    }
}
