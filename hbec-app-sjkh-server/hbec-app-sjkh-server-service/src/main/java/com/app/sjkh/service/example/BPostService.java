package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.BPost;
import com.app.sjkh.service.base.HbecBaseService;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface BPostService extends HbecBaseService<BPost,Long>{

    String queryPostId(String natives) throws Exception;
}
