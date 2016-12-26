package com.app.sjkh.service.example.impl;

import com.app.sjkh.mapper.sjdatasource.KhTaskMapper;
import com.app.sjkh.pojo.local.KhTask;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.KhTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/17.
 */
@Service
public class KhTaskServiceImpl extends HbecBaseServiceImpl<KhTask,Long> implements KhTaskService {

	@Autowired
	private KhTaskMapper khTaskMapper;

	public List<KhTask> getSuccOrFailList(String mobileNo) throws Exception {
		return khTaskMapper.getSuccOrFailList(mobileNo);
	}
}
