package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.BBusinessLog;
import com.github.abel533.mapper.Mapper;

/**
 * Created by zhangweikang on 2016/8/10.
 */
public interface BBusinessLogMapper extends Mapper<BBusinessLog> {

	/**
	 * 获取序列
	 *
	 * @return
	 * @throws Exception
	 */
	String querySequence() throws Exception;
}
