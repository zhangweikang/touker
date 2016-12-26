package com.app.sjkh.service;

import com.app.sjkh.commons.servier.EsbApiService;
import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.commons.utils.NumberUtils;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.CustomerServiceBranch;
import com.app.sjkh.pojo.local.PromoteCustomer;
import com.app.sjkh.service.example.CustomerServiceBranchService;
import com.app.sjkh.service.example.PromoteCustomerService;
import com.app.sjkh.service.example.impl.CustomerServiceBranchServiceImpl;
import com.app.sjkh.service.example.impl.PromoteCustomerServiceImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * Created by zhangweikang on 2016/8/22.
 */
@Service
public class PromoterService {

	private final static Log logger = LogFactory.getLog(PromoterService.class);

	@Autowired
	private PromoteCustomerService promoteCustomerService;

	@Autowired
	private CustomerServiceBranchService customerServiceBranchService;

	@Autowired
	private EsbApiService esbApiService;

	/**
	 * 设置客户服务营业部
	 *
	 * @param phone
	 * @param fwry
	 * @param channel
	 */
	public void addPromoteCust(String phone, String fwry, String channel) {

		PromoteCustomer promoteCustomer = new PromoteCustomer();
		promoteCustomer.setCustPhone(Long.parseLong(phone));
		promoteCustomer.setIsdelete("0");
		promoteCustomer.setIseffective("0");
		promoteCustomer.setIsok("0");
		promoteCustomer.setIssyncrm("0");

		//获取手机号码历史数据
		List<PromoteCustomer> promoteCustomers = promoteCustomerService.queryByWhere(promoteCustomer);
		boolean isOpen = false;
		if (promoteCustomers != null && promoteCustomers.size() > 0) {
			logger.info("此号码" + phone + "历史数据数:" + promoteCustomers.size());
			for (PromoteCustomer pc : promoteCustomers) {
				if (PromoteCustomer.isOk_1.equals(pc.getIsok())) {
					isOpen = true;
					logger.info("此号码" + phone + "已经开户成功！");
					break;
				} else {//把历史数据至为无效
					pc.setIseffective("1");
					pc.setUpdatetime(DateUtils.getCurDateTime());
					promoteCustomerService.updateSelective(pc);
				}
			}
		}
		if (!isOpen) {
			//维护客户经纪人关系
			promoteCustomer.setRefereesid(fwry);
			promoteCustomer.setReqdate(DateUtils.getCurrentDate());
			promoteCustomer.setReqtime(DateUtils.getCurrentTime());
			promoteCustomer.setId(NumberUtils.getUUID());
			promoteCustomer.setChannel(channel);
			promoteCustomerService.save(promoteCustomer);
		}
	}

	/**
	 * 设置服务营业部
	 *
	 * @param phoneNo
	 * @param fwry
	 * @throws Exception
	 */
	public ResultResponse addCustServiceBranch(String phoneNo, String fwry){

		//通过ESB接口查询经纪人的营业部   设置客户服务营业部为经纪人所属营业部
		ResultResponse cxfwryyyb = esbApiService.cxfwryyyb(fwry);
		if (!ResultCode.HBEC_000000.getCode().equals(cxfwryyyb.getStatus())) {
			return cxfwryyyb;
		}

		String referbranchno = cxfwryyyb.getData().toString();    //经纪人营业部

		//维护客户服务营业部信息
		CustomerServiceBranch serviceBranch = new CustomerServiceBranch();
		serviceBranch.setMobileno(phoneNo);
		serviceBranch.setSynclientidflg("0");
		serviceBranch.setSyncrmflg("0");
		List<CustomerServiceBranch> customerServiceBranches = customerServiceBranchService.queryByWhere(serviceBranch);
		if (null == customerServiceBranches || customerServiceBranches.size() == 0) {    //新增记录
			serviceBranch.setBranchno(referbranchno);
			serviceBranch.setChannel("0");    //经纪人推荐开户
			serviceBranch.setReqtime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
			serviceBranch.setUpdatetime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
			customerServiceBranchService.save(serviceBranch);
		} else {    //更新记录   客户可能先在app上自行选择了营业部，后面通过经纪人推荐营业部,所以要更新服务营业部和开户方式
			CustomerServiceBranch tmp = customerServiceBranches.get(0);
			tmp.setUpdatetime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
			tmp.setBranchno(referbranchno);
			tmp.setChannel("0");

			customerServiceBranchService.updateSelective(tmp);
		}

		return ResultResponse.ok();
	}
}
