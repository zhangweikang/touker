package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.BBusinessLogMapper;
import com.app.sjkh.pojo.local.BBusinessLog;
import com.app.sjkh.service.base.HbecBaseService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/10.
 */
@Service
public class BBusinessLogService extends HbecBaseService<BBusinessLog,String> {

	private final Log logger = LogFactory.getLog(BBusinessLogService.class);

	@Autowired
	private BBusinessLogMapper bBusinessLogMapper;

	/**
	 * 获取序列
	 * @return
	 */
	public String querySequence() throws Exception {
		return bBusinessLogMapper.querySequence();
	}
}
