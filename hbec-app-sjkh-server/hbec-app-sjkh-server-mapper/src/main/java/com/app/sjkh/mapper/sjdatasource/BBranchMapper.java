package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.BBranch;
import com.github.abel533.mapper.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by zhangweikang on 2016/8/22.
 */
public interface BBranchMapper extends Mapper<BBranch> {

	List<String> getBranchInfo(@Param("branchNo") String branchNo);

	List<String> getBranchNo();
}
