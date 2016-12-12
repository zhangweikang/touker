package com.app.sjkh.datasource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * Created by zhangweikang on 2016/8/5.
 */
public class MultipleDataSource extends AbstractRoutingDataSource {

	private static final Log logger = LogFactory.getLog(MultipleDataSource.class);

	private static final ThreadLocal<String> dataSourceKey = new InheritableThreadLocal<String>();

	public static void setDataSourceKey(String dataSource) {
		logger.info("注入数据源,dataSource:"+dataSource);
		dataSourceKey.set(dataSource);
	}

	@Override
	protected Object determineCurrentLookupKey() {
		return dataSourceKey.get();
	}
}
