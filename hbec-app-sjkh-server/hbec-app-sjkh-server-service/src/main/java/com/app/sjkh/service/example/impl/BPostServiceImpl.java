package com.app.sjkh.service.example.impl;

import com.app.sjkh.mapper.sjdatasource.BPostMapper;
import com.app.sjkh.pojo.local.BPost;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.BPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/15.
 */
@Service
public class BPostServiceImpl extends HbecBaseServiceImpl<BPost,Long> implements BPostService {

	@Autowired
	private BPostMapper bPostMapper;

	public String queryPostId(String natives) throws Exception {
		return bPostMapper.queryPostId(natives);
	}
}
