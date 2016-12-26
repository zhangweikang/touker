package com.app.sjkh.service.example.impl;

import com.app.sjkh.mapper.sjdatasource.ToukerIdClientIdRelationMapper;
import com.app.sjkh.pojo.local.ToukerIdClientIdRelation;
import com.app.sjkh.service.base.HbecBaseServiceImpl;
import com.app.sjkh.service.example.ToukerIdClientIdRelationService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/12.
 */
@Service
public class ToukerIdClientIdRelationServiceImpl extends HbecBaseServiceImpl<ToukerIdClientIdRelation,Long> implements ToukerIdClientIdRelationService {

	private final Log logger = LogFactory.getLog(ToukerIdClientIdRelationServiceImpl.class);

	@Autowired
	private ToukerIdClientIdRelationMapper toukerIdClientIdRelationMapper;

	/**
	 * 获取序列
	 * @return
	 */
	public String querySequence() throws Exception {
		return toukerIdClientIdRelationMapper.querySequence();
	}

}
