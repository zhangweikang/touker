package com.app.sjkh.service;

import com.app.sjkh.commons.vo.ResultResponse;

/**
 * Created by Administrator on 2017/3/1.
 */
public interface QianQianStockService {

    ResultResponse genAndSaveSmsCode(String mobileNo) throws Exception;

    ResultResponse getOpenStockState(String mobileNo) throws Exception;
}
