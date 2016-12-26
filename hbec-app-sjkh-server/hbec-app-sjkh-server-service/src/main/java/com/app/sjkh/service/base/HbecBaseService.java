package com.app.sjkh.service.base;

import com.github.pagehelper.PageInfo;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Administrator on 2016/12/26.
 */
public interface HbecBaseService<T, ID extends Serializable>{

    T queryById(ID id);

    Integer queryCount();

    Integer queryCount(T t);

    List<T> queryAll();

    List<T> queryByWhere(T t);

    T queryOneByWhere(T t);

    PageInfo<T> queryPageList(Integer page, Integer rows);

    PageInfo<T> queryPageList(T t, Integer page, Integer rows);

    Integer save(T t);

    Integer saveSelective(T t);

    Integer update(T t);

    Integer updateSelective(T t);

    Integer deleteById(ID id);
}
