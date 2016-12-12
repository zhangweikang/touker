package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.KhTask;
import com.github.abel533.mapper.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/17.
 */
public interface KhTaskMapper extends Mapper<KhTask> {

	List<KhTask> getSuccOrFailList(@Param("mobileNo") String mobileNo) throws Exception;
}
