package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.BBranchMapper;
import com.app.sjkh.pojo.local.BBranch;
import com.app.sjkh.service.base.HbecBaseService;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by zhangweikang on 2016/8/22.
 */
@Service
public class BBranchService extends HbecBaseService<BBranch, String> {

	@Autowired
	private BBranchMapper bBranchMapper;

	/**
	 * 根据营业部号,获取营业部名称
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
	 * @return
     */
	public LinkedList<String> getBranchNo() {

		LinkedList<String> branchNoList = new LinkedList<String>();
		List<String> branchNo = bBranchMapper.getBranchNo();
		for (String branchno : branchNo) {
			branchNoList.add(branchno);
		}
		return branchNoList;
	}

	/**
	 * 获取营业部信息
	 * @param branchNo
	 * @return
     */
	public BBranch getBranchInfo(String branchNo){
		return bBranchMapper.getBranchInfo(branchNo);
	}
}
