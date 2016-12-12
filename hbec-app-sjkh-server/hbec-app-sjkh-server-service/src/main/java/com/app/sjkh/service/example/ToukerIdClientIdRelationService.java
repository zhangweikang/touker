package com.app.sjkh.service.example;

import com.app.sjkh.mapper.sjdatasource.ToukerIdClientIdRelationMapper;
import com.app.sjkh.pojo.local.ToukerIdClientIdRelation;
import com.app.sjkh.service.base.HbecBaseService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangweikang on 2016/8/12.
 */
@Service
public class ToukerIdClientIdRelationService extends HbecBaseService<ToukerIdClientIdRelation,Long> {

	private final Log logger = LogFactory.getLog(ToukerIdClientIdRelationService.class);

	@Autowired
	private ToukerIdClientIdRelationMapper toukerIdClientIdRelationMapper;

	/**
	 * 获取序列
	 * @return
	 */
	public String querySequence(){
		String sequence = "";
		try {
			sequence = toukerIdClientIdRelationMapper.querySequence();
		} catch (Exception e) {
			logger.error("获取序列失败",e);
		}
		return sequence;
	}

}
