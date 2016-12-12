package com.app.sjkh.mapper.sjdatasource;

import com.app.sjkh.pojo.local.AcceptedMediaUrl;
import com.github.abel533.mapper.Mapper;

/**
 * 用户影像资料表Mapper
 * Created by Administrator on 2016/9/29.
 */
public interface AcceptedMediaUrlMapper extends Mapper<AcceptedMediaUrl> {

    /**
     * 获取序列
     *
     * @return
     * @throws Exception
     */
    String querySequence() throws Exception;
}
