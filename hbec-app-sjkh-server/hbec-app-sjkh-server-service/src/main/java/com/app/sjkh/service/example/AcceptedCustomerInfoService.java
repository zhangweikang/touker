package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedCustomerInfo;
import com.app.sjkh.service.base.HbecBaseService;

import java.util.List;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface AcceptedCustomerInfoService extends HbecBaseService<AcceptedCustomerInfo,Long>{

    AcceptedCustomerInfo queryOneByMoblie(String mobileNo) throws Exception;

    Integer deleteByMobileNo(String mobileNo) throws Exception;

    Integer deleteByuserId(Long userId) throws Exception;

    List<AcceptedCustomerInfo> getTimedOpenAccount(String beginDate, String endDate) throws Exception;

    String querySequence() throws Exception;
}
