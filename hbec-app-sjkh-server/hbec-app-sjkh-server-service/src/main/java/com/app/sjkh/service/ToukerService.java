package com.app.sjkh.service;

import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.pojo.local.AcceptedMediaUrl;

import java.util.Map;

/**
 * Created by Administrator on 2017/3/1.
 */
public interface ToukerService {

    ResultResponse sendSMSCode(String mobileNo, String ip, String mac, String opway,String isToukerRegister) throws Exception;

    ResultResponse checkSMSCode(String mobileNo, String mobileCode, String source, String ip, String mac ,String isToukerRegister);

    ResultResponse valiSmsCheckUserInfo(String mobileNo, String mobileCode, String source, String ip, String mac,String isToukerRegister);

    ResultResponse valiUserInfo(String mobileNo, Integer source);

    ResultResponse mobileRelationUserId(String mobileNo, String channel) throws Exception;

    ResultResponse registerTouker(String mobileNo, String loginPass, String channel) throws Exception;

    ResultResponse queryInfoBank(String customerId);

    ResultResponse validateCustInfo(String mobileNo, String customerId, Integer opway) throws Exception;

    ResultResponse validateCustomerInfo(String mobileNo, String customerId, Integer opway) throws Exception;

    ResultResponse getImgFromTouker(String mobileno, String userId, Map<String, String> data) throws Exception;

    ResultResponse clearUnSubmitUserInfo(String idno, String userId) throws Exception;

    ResultResponse getTradeDate();

    ResultResponse getBranchInfo(String mobileNo) throws Exception;

    void bindServiceBranch(String mobileNo, String branchNo) throws Exception;

    ResultResponse getPhoto(AcceptedMediaUrl bean) throws Exception;

    ResultResponse getCertInfo(AcceptedCertInfo bean) throws Exception;

    void getAgentByPhone(String phone);

    ResultResponse updateOpenAccBranchNo(Long userId, String idcardNo, String mobileNo) throws Exception;
}
