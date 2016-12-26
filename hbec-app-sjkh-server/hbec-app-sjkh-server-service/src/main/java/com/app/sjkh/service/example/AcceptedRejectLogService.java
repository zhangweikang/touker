package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedRejectLog;
import com.app.sjkh.service.base.HbecBaseService;

import java.util.List;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface AcceptedRejectLogService extends HbecBaseService<AcceptedRejectLog, Long>{

    List<AcceptedRejectLog> getReject(Long userId);
}
