package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedSmsLimit;
import com.app.sjkh.service.base.HbecBaseService;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface AcceptedSmsLimitService extends HbecBaseService<AcceptedSmsLimit,String>{

    AcceptedSmsLimit getSmsLog(AcceptedSmsLimit bean) throws Exception;

    Integer updateSendCount(AcceptedSmsLimit bean) throws Exception;
}
