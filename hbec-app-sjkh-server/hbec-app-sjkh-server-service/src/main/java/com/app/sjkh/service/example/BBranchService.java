package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.BBranchMapper;
import com.app.sjkh.pojo.local.BBranch;
import com.app.sjkh.service.base.HbecBaseService;
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

	public String getBranchInfo(String branchNo) {
		List<String> branchInfo = bBranchMapper.getBranchInfo(branchNo);

		if (branchInfo != null && branchInfo.isEmpty()) {
			return branchInfo.get(0);
		}
		return "";
	}

	public LinkedList<String> getBranchNo() {

		LinkedList<String> branchNoList = new LinkedList<String>();
		List<String> branchNo = bBranchMapper.getBranchNo();
		for (String branchno : branchNo) {
			branchNoList.add(branchno);
		}
		return branchNoList;
	}
}
