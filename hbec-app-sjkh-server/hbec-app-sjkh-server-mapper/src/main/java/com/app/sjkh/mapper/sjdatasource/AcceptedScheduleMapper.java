package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.AcceptedSchedule;
import com.github.abel533.mapper.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/15.
 */
public interface AcceptedScheduleMapper extends Mapper<AcceptedSchedule> {

	List<AcceptedSchedule> getAuditInfo(@Param("backStep") String backStep, @Param("mobileNo") String mobileNo) throws Exception;

	/**
	 * 用户开户进度报表统计
	 * @param beginDate
	 * @param endDate
	 * @return
	 * @throws Exception
	 */
	List<AcceptedSchedule> getScheduleReport(@Param("beginDate") String beginDate, @Param("endDate") String endDate) throws Exception;

	/**
	 * 获取序列
	 *
	 * @return
	 * @throws Exception
	 */
	String querySequence() throws Exception;
}
