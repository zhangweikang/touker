package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.service.base.HbecBaseService;

import java.util.List;

/**
 * Created by Administrator on 2016/12/19.
 */
public interface AcceptedCertInfoService extends HbecBaseService<AcceptedCertInfo,Long>{

    Integer updateByMoblieNoSelective(AcceptedCertInfo bean) throws Exception;

    List<AcceptedCertInfo> getCertInfoAcceptedSchedule(String idno, String userId) throws Exception;

    AcceptedCertInfo getCertInfo(String mobileNo,Integer opway) throws Exception;

    String querySequence() throws Exception;
}
