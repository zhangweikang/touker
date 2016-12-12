package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.BPostMapper;
import com.app.sjkh.pojo.local.BPost;
import com.app.sjkh.service.base.HbecBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/15.
 */
@Service
public class BPostService extends HbecBaseService<BPost,Long> {

	@Autowired
	private BPostMapper bPostMapper;

	public String queryPostId(String natives) throws Exception {
		return bPostMapper.queryPostId(natives);
	}
}
