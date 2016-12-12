package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.BPost;
import com.github.abel533.mapper.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * Created by zhangweikang on 2016/8/15.
 */
public interface BPostMapper extends Mapper<BPost> {

	/**
	 * 根据地址获取邮编
	 *
	 * @param natives
	 * @return
	 * @throws Exception
	 */
	String queryPostId(@Param("natives") String natives) throws Exception;
}
