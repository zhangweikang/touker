package com.app.sjkh.service.example;

import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.BBranch;

import java.util.LinkedList;

/**
 * Created by Administrator on 2016/12/19.
 */
public interface BBranchService {

    /**
     * 根据营业部号,获取营业部名称
     *
     * @param branchNo
     * @return
     */
    String getBranchName(String branchNo);

    /**
     * 获取所有营业部
     *
     * @return
     */
    LinkedList<String> getBranchNo();

    /**
     * 获取营业部信息
     *
     * @param branchNo
     * @return
     */
    BBranch getBranchInfo(String branchNo);

    /**
     * 根据手机号码获取用户已选择的服务营业部,为空则设置默认
     * @param mobileNo
     * @return
     */
    ResultResponse getBranchInfoByMobilNo (String mobileNo);

    /**
     * 绑定用户营业部
     * @param mobileNo
     * @param branchNo
     * @param commission
     * @return
     */
    ResultResponse bindServiceBranch(String mobileNo,String branchNo,String commission) throws Exception;
}
