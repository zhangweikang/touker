package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.ToukerIdClientIdRelation;
import com.github.abel533.mapper.Mapper;

/**
 * Created by zhangweikang on 2016/8/12.
 */
public interface ToukerIdClientIdRelationMapper extends Mapper<ToukerIdClientIdRelation> {

	/**
	 * 获取序列
	 *
	 * @return
	 * @throws Exception
	 */
	String querySequence() throws Exception;
}
