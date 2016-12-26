package com.app.sjkh.service.example;

import com.app.sjkh.pojo.local.KhTask;

import java.util.List;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface KhTaskService {

    List<KhTask> getSuccOrFailList(String mobileNo) throws Exception;
}
