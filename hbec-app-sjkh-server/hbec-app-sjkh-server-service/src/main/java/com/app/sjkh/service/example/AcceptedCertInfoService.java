package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedCertInfo;

import java.util.List;

/**
 * Created by Administrator on 2016/12/19.
 */
public interface AcceptedCertInfoService {

    Integer updateByMoblieNoSelective(AcceptedCertInfo bean) throws Exception;

    List<AcceptedCertInfo> getCertInfoAcceptedSchedule(String idno, String userId) throws Exception;

    AcceptedCertInfo getCertInfo(String mobileNo) throws Exception;

    String querySequence() throws Exception;
}
