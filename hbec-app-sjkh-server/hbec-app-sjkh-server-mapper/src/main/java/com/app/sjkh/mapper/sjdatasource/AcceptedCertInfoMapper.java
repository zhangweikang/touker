package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.AcceptedCertInfo;
import com.github.abel533.mapper.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/5.
 */
public interface AcceptedCertInfoMapper extends Mapper<AcceptedCertInfo> {

	/**
	 * 根据mobileNo数据
	 *
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	Integer updateByMoblieNoSelective(AcceptedCertInfo bean) throws Exception;

	/**
	 * 查询用户信息
	 * @param idno
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	List<AcceptedCertInfo> getCertInfoAcceptedSchedule(@Param("idno") String idno, @Param("userId") String userId) throws Exception;

	/**
	 * 获取序列
	 *
	 * @return
	 * @throws Exception
	 */
	String querySequence() throws Exception;
}
