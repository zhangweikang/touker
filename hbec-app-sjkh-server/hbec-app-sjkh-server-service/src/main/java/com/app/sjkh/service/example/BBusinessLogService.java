package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.BBusinessLog;
import com.app.sjkh.service.base.HbecBaseService;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface BBusinessLogService extends HbecBaseService<BBusinessLog,String>{

    String querySequence() throws Exception;
}
