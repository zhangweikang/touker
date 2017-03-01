package com.app.sjkh.service;

import com.app.sjkh.commons.vo.ResultResponse;

/**
 * Created by Administrator on 2017/3/1.
 */
public interface PromoterService {

    void addPromoteCust(String phone, String fwry, String channel);

    ResultResponse addCustServiceBranch(String phoneNo, String fwry);
}
