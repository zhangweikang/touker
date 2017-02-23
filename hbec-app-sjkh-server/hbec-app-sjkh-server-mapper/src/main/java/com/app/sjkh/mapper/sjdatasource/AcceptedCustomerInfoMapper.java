package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.AcceptedCustomerInfo;
import com.github.abel533.mapper.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/12.
 */
public interface AcceptedCustomerInfoMapper extends Mapper<AcceptedCustomerInfo> {

	/**
	 * 根据mobileNo物理删除数据
	 *
	 * @param mobileNo
	 * @return
	 * @throws Exception
	 */
	Integer deleteByMobileNo(@Param("mobileNo") String mobileNo) throws Exception;

	/**
	 * 根据userId物理删除数据
	 *
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	Integer deleteByUserId(@Param("userId") Long userId) throws Exception;

	/**
	 * 根据时间段查询开户成功的用户
	 *
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<AcceptedCustomerInfo> getTimedOpenAccount(@Param("beginDate") String beginDate, @Param("endDate") String endDate) throws Exception;

	/**
	 * 获取序列
	 *
	 * @return
	 * @throws Exception
	 */
	String querySequence() throws Exception;
}
