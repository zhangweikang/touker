package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.AcceptedRejectLog;
import com.app.sjkh.service.base.HbecBaseService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 用户驳回记录Service
 * Created by Administrator on 2016/12/13.
 */
@Service
public class AcceptedRejectLogService extends HbecBaseService<AcceptedRejectLog, Long> {

    public List<AcceptedRejectLog> getReject(Long userId){
        AcceptedRejectLog queryBean = new AcceptedRejectLog();
        queryBean.setUserid(userId);
        queryBean.setIsfix("0");
        return queryByWhere(queryBean);
    }
}
