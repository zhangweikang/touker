package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.ToukerIdClientIdRelation;
import com.app.sjkh.service.base.HbecBaseService;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface ToukerIdClientIdRelationService extends HbecBaseService<ToukerIdClientIdRelation,Long>{

    String querySequence() throws Exception;
}
