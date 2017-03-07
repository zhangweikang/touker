package com.app.sjkh.commons.servier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.ShardedJedis;
import redis.clients.jedis.ShardedJedisPool;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class RedisService {

    @Autowired
    private ShardedJedisPool shardedJedisPool;

    private static final Integer DEFAULT_DB_INDEX = 0;

    private <K> K execute(Function<Jedis, K> fun, String key, Integer index) {
        ShardedJedis shardedJedis = null;
        Boolean selectDB = false;
        Jedis jedis = null;
        try {
            // 从连接池中获取到jedis分片对象
            shardedJedis = shardedJedisPool.getResource();
            jedis = shardedJedis.getShard(key);
            if (index != null && index.intValue() != DEFAULT_DB_INDEX) {// 选中传入的数据库
                selectDB = true;
                jedis.select(index);
            }
            return fun.callback(jedis);
        } finally {
            if (selectDB && null != jedis) {// 恢复默认选中数据库
                jedis.select(DEFAULT_DB_INDEX);
            }
            if (null != shardedJedis) {
                // 关闭，检测连接是否有效，有效则放回到连接池中，无效则重置状态
                shardedJedis.close();
            }
        }
    }

    /**
     * 设置一个值
     *
     * @param key
     * @param value
     * @return
     */
    public String set(final String key, final String value) {
        return this.set(DEFAULT_DB_INDEX, key, value);
    }

    /**
     * 设置一个值
     *
     * @param index 数据库名
     * @param key
     * @param value
     * @return
     */
    public String set(Integer index, final String key, final String value) {
        return this.execute(new Function<Jedis, String>() {
            @Override
            public String callback(Jedis jedis) {
                return jedis.set(key, value);
            }
        }, key, index);
    }

    /**
     * 设置一个值，并且指定生存时间
     *
     * @param key
     * @param value
     * @param seconds
     * @return
     */
    public String set(final String key, final String value, final Integer seconds) {
        return this.set(DEFAULT_DB_INDEX, key, value, seconds);
    }

    /**
     * 设置一个值，并且指定生存时间
     *
     * @param index   数据库名
     * @param key
     * @param value
     * @param seconds
     * @return
     */
    public String set(Integer index, final String key, final String value, final Integer seconds) {
        return this.execute(new Function<Jedis, String>() {
            @Override
            public String callback(Jedis jedis) {
                String str = jedis.set(key, value);
                jedis.expire(key, seconds);
                return str;
            }
        }, key, index);
    }

    /**
     * 正则匹配获取所有的key
     *
     * @param index   数据库名(不传默认0数据库)
     * @param pattern
     * @return
     */
    public Set<String> keys(Integer index, final String pattern) {
        return this.execute(new Function<Jedis, Set<String>>() {
            @Override
            public Set<String> callback(Jedis jedis) {
                Set<String> keys = jedis.keys(pattern);
                return keys;
            }
        }, pattern, index);
    }

    /**
     * 为key设置生存时间
     *
     * @param key
     * @param seconds
     * @return
     */
    public Long expire(final String key, final Integer seconds) {
        return this.expire(DEFAULT_DB_INDEX, key, seconds);
    }

    /**
     * 为key设置生存时间
     *
     * @param index   数据库名
     * @param key
     * @param seconds
     * @return
     */
    public Long expire(Integer index, final String key, final Integer seconds) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis jedis) {
                return jedis.expire(key, seconds);
            }

        }, key, index);
    }

    /**
     * 获取数据
     *
     * @param key
     * @return
     */
    public String get(final String key) {
        return this.get(DEFAULT_DB_INDEX, key);
    }

    /**
     * 获取数据
     *
     * @param index 数据库名
     * @param key
     * @return
     */
    public String get(Integer index, final String key) {
        return this.execute(new Function<Jedis, String>() {
            @Override
            public String callback(Jedis e) {
                return e.get(key);
            }
        }, key, index);
    }

    /**
     * 删除key
     *
     * @param key
     * @return
     */
    public Long del(final String key) {
        return this.del(DEFAULT_DB_INDEX, key);
    }

    /**
     * 删除key
     *
     * @param index 数据库名
     * @param key
     * @return
     */
    public Long del(Integer index, final String key) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis e) {
                return e.del(key);
            }
        }, key, index);
    }

    /**
     * 给   一组hash  设置   值和生存时间
     *
     * @param index
     * @param key
     * @param value
     * @param seconds
     * @return String
     */
    public String hmset(Integer index, final String key, final Map<String, String> value, final Integer seconds) {
        return this.execute(new Function<Jedis, String>() {
            @Override
            public String callback(Jedis jedis) {
                String str = jedis.hmset(key, value);
                jedis.expire(key, seconds);
                return str;
            }
        }, key, index);
    }

    /**
     * 给 hash 指定的 key  指定的饿字段 field设置值value
     *
     * @param index
     * @param key
     * @param field
     * @param value
     * @param seconds
     * @return String
     */
    public String hset(Integer index, final String key, final String field, final String value, final Integer seconds) {
        return this.execute(new Function<Jedis, String>() {
            @Override
            public String callback(Jedis jedis) {
                Long set = jedis.hset(key, field, value);
                jedis.expire(key, seconds);
                return String.valueOf(set);
            }
        }, key, index);
    }

    /**
     * 获取 hash 指定   key 指定的饿字段  field  value值
     *
     * @param index
     * @param key
     * @param field
     * @return String
     */
    public String hget(Integer index, final String key, final String field) {
        return this.execute(new Function<Jedis, String>() {
            @Override
            public String callback(Jedis e) {
                return e.hget(key, field);
            }
        }, key, index);
    }

    /**
     * 获取 hash 指定 key  对应的所有字段的值
     *
     * @param index
     * @param key
     * @return Map<String,String>
     */
    public Map<String, String> hgetAll(Integer index, final String key) {
        return this.execute(new Function<Jedis, Map<String, String>>() {
            @Override
            public Map<String, String> callback(Jedis e) {
                return e.hgetAll(key);
            }
        }, key, index);
    }

    /**
     * 判断  hash 字段是否存在
     *
     * @param index
     * @param key
     * @param field
     * @return Boolean
     */
    public Boolean hexists(Integer index, final String key, final String field) {
        return this.execute(new Function<Jedis, Boolean>() {
            @Override
            public Boolean callback(Jedis e) {
                return e.hexists(key, field);
            }
        }, key, index);

    }

    /**
     * hash    删除key    指定字段的方法
     *
     * @param index
     * @param key
     * @param field
     * @return Long
     */
    public Long hdel(Integer index, final String key, final String field) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis e) {
                return e.hdel(key, field);
            }
        }, key, index);
    }

    /**
     * 在redis中将数据以list的形式进行存储
     * 在名称为key的list尾添加一个值为value的元素
     *
     * @param index
     * @param key
     * @param string
     * @param seconds
     * @return Long
     */
    public Long rpush(Integer index, final String key, final String string, final Integer seconds) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis jedis) {
                Long str = jedis.rpush(key, string);
                jedis.expire(key, seconds);
                return str;
            }
        }, key, index);
    }

    /**
     * 在redis中将数据以list的形式进行存储
     * 在名称为key的list头添加一个值为value的 元素
     *
     * @param index
     * @param key
     * @param string
     * @param seconds
     * @return Long
     */
    public Long lpush(Integer index, final String key, final String string, final Integer seconds) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis jedis) {
                Long str = jedis.lpush(key, string);
                jedis.expire(key, seconds);
                return str;
            }
        }, key, index);
    }

    /**
     * 获取list集合存储的数量
     *
     * @param index
     * @param key
     * @return Long
     */
    public Long llen(Integer index, final String key) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis jedis) {
                Long llen = jedis.llen(key);
                return llen;
            }
        }, key, index);
    }

    /**
     * 删除redis中的list集合中的某一个value值
     *
     * @param index
     * @param key
     * @param counts 删除几次
     * @param value
     * @return Long
     */
    public Long lrem(Integer index, final String key, final Long counts, final String value) {
        return this.execute(new Function<Jedis, Long>() {
            @Override
            public Long callback(Jedis jedis) {
                Long lrem = jedis.lrem(key, counts, value);
                return lrem;
            }
        }, key, index);
    }

    /**
     * 获取list集合中   角标从start开始到end结束  中的数据值
     *
     * @param index
     * @param key
     * @param start
     * @param end
     * @return List<String>
     */
    public List<String> lrange(Integer index, final String key, final Long start, final Long end) {
        return this.execute(new Function<Jedis, List<String>>() {
            @Override
            public List<String> callback(Jedis jedis) {
                List<String> lrange = jedis.lrange(key, start, end);
                return lrange;
            }
        }, key, index);
    }
}
