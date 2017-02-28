package com.app.sjkh.service.example.impl;

import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.commons.utils.PropertiesUtils;
import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.mapper.sjdatasource.BBranchMapper;
import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.app.sjkh.pojo.local.BBranch;
import com.app.sjkh.pojo.local.CustomerServiceBranch;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.AcceptedCertInfoService;
import com.app.sjkh.service.example.BBranchService;
import com.app.sjkh.service.example.CustomerServiceBranchService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by zhangweikang on 2016/8/22.
 */
@Service
public class BBranchServiceImpl extends HbecBaseServiceImpl<BBranch, String> implements BBranchService {

    private final static Log logger = LogFactory.getLog(BBranchServiceImpl.class);

    @Autowired
    private BBranchMapper bBranchMapper;

    @Autowired
    private PropertiesUtils propertiesUtils;

    @Autowired
    private AcceptedCertInfoService acceptedCertInfoService;

    @Autowired
    private CustomerServiceBranchService customerServiceBranchService;

    /**
     * 根据营业部号,获取营业部名称
     *
     * @param branchNo
     * @return
     */
    public String getBranchName(String branchNo) {
        List<String> branchInfo = bBranchMapper.getBranchName(branchNo);

        if (branchInfo != null && branchInfo.isEmpty()) {
            return branchInfo.get(0);
        }
        return "";
    }

    /**
     * 获取所有营业部
     *
     * @return
     */
    public LinkedList<String> getBranchNo() {

        LinkedList<String> branchNoList = new LinkedList<>();
        List<String> branchNo = bBranchMapper.getBranchNo();
        for (String branchno : branchNo) {
            branchNoList.add(branchno);
        }
        return branchNoList;
    }

    /**
     * 获取营业部信息
     *
     * @param branchNo
     * @return
     */
    public BBranch getBranchInfo(String branchNo) {
        List<BBranch> branchInfo = bBranchMapper.getBranchInfo(branchNo);
        return (branchInfo != null && !branchInfo.isEmpty()) ? branchInfo.get(0) : null;
    }

    /**
     * 根据手机号码获取用户已选择的服务营业部,为空则设置默认
     *
     * @param mobileNo
     * @return
     */
    @Override
    public ResultResponse getBranchInfoByMobilNo(String mobileNo) {
        BBranch branchInfoByMobilNo = bBranchMapper.getBranchInfoByMobilNo(mobileNo);
        if (branchInfoByMobilNo != null) {
            return ResultResponse.ok(branchInfoByMobilNo);
        }

        //默认营业部编号  上海自贸区营业部
        String defBranchNo = propertiesUtils.get("branchNo");
        //默认营业部名称
        String thirdPartyChannel = "";

        //获取用户推荐经纪人
        CustomerServiceBranch bean = new CustomerServiceBranch();
        bean.setMobileno(mobileNo);
        bean.setChannel("0");
        CustomerServiceBranch customerServiceBranch = customerServiceBranchService.queryOneByWhere(bean);

        if (customerServiceBranch != null) {
            defBranchNo = customerServiceBranch.getBranchno();
            thirdPartyChannel = customerServiceBranch.getThirdpartychannel();
        }

        //第三方渠道开户
        logger.info("====== 第三方渠道开户,thirdPartyChannel:" + thirdPartyChannel);
        if (customerServiceBranch != null && StringUtils.isNotBlank(thirdPartyChannel)) {
            Map<String, String> map = propertiesUtils.getMap("thirdPartyOpenAccBranch");
            if (map != null && StringUtils.isNotBlank(map.get(thirdPartyChannel))) {
                defBranchNo = map.get(thirdPartyChannel);
            }
        }
        logger.info("====== 第三方渠道开户:branchNo" + defBranchNo);

        return ResultResponse.ok(getBranchInfo(defBranchNo));
    }

    /**
     * 绑定用户营业部
     *
     * @param mobileNo
     * @param branchNo
     * @param commission
     * @return
     */
    @Override
    public ResultResponse bindServiceBranch(String mobileNo, String branchNo, String commission) throws Exception {
        String defBranchNo = propertiesUtils.get("branchNo");

        AcceptedCertInfo updateBean = new AcceptedCertInfo();
        updateBean.setMobileno(mobileNo);
        updateBean.setBranchno(branchNo);
        updateBean.setCommission(Double.parseDouble(commission));
        acceptedCertInfoService.updateByMoblieNoSelective(updateBean);

        CustomerServiceBranch serviceBranch = new CustomerServiceBranch();
        serviceBranch.setMobileno(mobileNo);
        serviceBranch.setSynclientidflg("0");
        List<CustomerServiceBranch> customerServiceBranches = customerServiceBranchService.queryByWhere(serviceBranch);
        if (customerServiceBranches == null || customerServiceBranches.isEmpty()) {
            //如果上送过来的营业部为默认营业部（自贸区营业部）则需要平均分配
            if (defBranchNo.equals(branchNo)) {
//				branchno = (String) branchList.peek();	//平均分配服务营业部
//				branchList.remove(branchno);
//				branchList.add(branchno);
                serviceBranch.setSyncrmflg(Constants.NO_NEED_SYNC_SERVICE_BRANCH_FLAG);
            }
            serviceBranch.setChannel("1");
            serviceBranch.setBranchno(branchNo);
            serviceBranch.setReqtime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            serviceBranch.setUpdatetime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));

            customerServiceBranchService.saveSelective(serviceBranch);
        } else {
            CustomerServiceBranch customerServiceBranch = customerServiceBranches.get(0);
            String channel = customerServiceBranch.getChannel();
            if ("1".equals(channel) && "0".equals(customerServiceBranch.getSyncrmflg())) {        //如果是自行开户的需要更新服务营业部，推荐开户的不允许更新服务营业部
                customerServiceBranch.setBranchno(branchNo);
                customerServiceBranch.setUpdatetime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
                customerServiceBranchService.updateSelective(customerServiceBranch);
            }
        }
        return ResultResponse.ok();
    }

    //第三方渠道和服务营业部对应关系
    private Map<String, String> getThirdPartyOpenAccBranch() {
        Map<String, String> map = new HashMap<String, String>();
        String tpBranch = propertiesUtils.get("thirdPartyOpenAccBranch");
        if (StringUtils.isNotBlank(tpBranch)) {
            String[] temp = tpBranch.split(","); //通过逗号进行分割
            for (int i = 0; i < temp.length; i++) {
                String[] arr = temp[i].split(":"); //通过冒号继续分割
                String[] tempAagin = new String[arr.length]; //再开辟一个数组用来接收分割后的数据
                for (int j = 0; j < arr.length; j++) {
                    tempAagin[j] = arr[j];
                }
                map.put(arr[0], arr[1]);
            }
        }
        return map;
    }
}
