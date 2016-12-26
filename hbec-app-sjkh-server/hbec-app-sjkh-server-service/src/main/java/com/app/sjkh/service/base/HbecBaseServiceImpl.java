package com.app.sjkh.service.base;

import com.github.abel533.mapper.Mapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.List;

/**
 * 父Service，主要实现CRUD的封装
 */
public class HbecBaseServiceImpl<T, ID extends Serializable> implements HbecBaseService<T,ID>{

    //利用Spring4.X注解注入
    @Autowired
    private Mapper<T> mapper;
    /**
     * 需要子类实现
     *
     * @return
     */
    /*public void setMapper(Mapper<T> mapper) {
		this.mapper = mapper;
	}
	public Mapper<T> getMapper() {
		return mapper;
	}*/

    /**
     * 根据主键查询
     *
     * @param id
     * @return
     */
    public T queryById(ID id) {
        return mapper.selectByPrimaryKey(id);
    }

    /**
     * 查询数据总条数
     *
     * @return
     */
    public Integer queryCount() {
        return mapper.selectCount(null);
    }

    /**
     * 根据条件查询数据条数
     *
     * @param t
     * @return
     */
    public Integer queryCount(T t) {
        return mapper.selectCount(t);
    }

    /**
     * 查询所有数据
     *
     * @return
     */
    public List<T> queryAll() {
        return mapper.select(null);
    }

    /**
     * 根据条件查询
     *
     * @param t
     * @return
     */
    public List<T> queryByWhere(T t) {
        return mapper.select(t);
    }

    /**
     * 根据条件查询单条数据
     *
     * @param t
     * @return
     */
    public T queryOneByWhere(T t) {
        List<T> list = this.queryByWhere(t);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    /**
     * 分页查询
     *
     * @param page
     * @param rows
     * @return
     */
    public PageInfo<T> queryPageList(Integer page, Integer rows) {
        // 分页参数
        PageHelper.startPage(page, rows, true);
        List<T> list = queryAll();
        return new PageInfo<T>(list);
    }

    /**
     * 根据条件做分页查询
     *
     * @param t
     * @param page
     * @param rows
     * @return
     */
    public PageInfo<T> queryPageList(T t, Integer page, Integer rows) {
        // 分页参数
        PageHelper.startPage(page, rows, true);
        List<T> list = queryByWhere(t);
        return new PageInfo<T>(list);
    }

    /**
     * 新增数据，全部字段保存
     *
     * @param t
     */
    public Integer save(T t) {
        return mapper.insert(t);
    }

    /**
     * 新增数据，不为null的字段做保存
     *
     * @param t
     */
    public Integer saveSelective(T t) {
        return mapper.insertSelective(t);
    }

    /**
     * 更新，所有字段
     *
     * @param t
     */
    public Integer update(T t) {
        return mapper.updateByPrimaryKey(t);
    }

    /**
     * 更新，不为null的字段
     *
     * @param t
     */
    public Integer updateSelective(T t) {
        return mapper.updateByPrimaryKeySelective(t);
    }

    /**
     * 根据主键物理删除数据
     *
     * @param id
     * @return
     */
    public Integer deleteById(ID id) {
        return mapper.deleteByPrimaryKey(id);
    }

}
