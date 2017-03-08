package com.app.sjkh.esb.utils;

import com.app.sjkh.esb.pojo.Constants;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * properties注册为spring主键,获取加载resources配置文件中的值
 * Created by Administrator on 2016/11/25.
 */
@Component
public class PropertiesUtils implements ApplicationContextAware {

    private final static Log logger = LogFactory.getLog(PropertiesUtils.class);
    private Map<String, String> propertiesMap = null;
    private ApplicationContext applicationContext = null;
    private RedisService redisService;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        init();
    }


    private void init() {
        if (propertiesMap == null) {
            propertiesMap = new HashMap<String, String>();
        }
        Properties prop = new Properties();
        redisService = applicationContext.getBean(RedisService.class);
        try {
            String path = PropertiesUtils.class.getClassLoader().getResource("").getPath();
            File file = new File(path);
            File[] array = file.listFiles();
            for (File files : array) {
                if (files.isFile() && files.getName().endsWith(".properties")) {
                    logger.info("properties:" + files.getName());
                    prop.load(PropertiesUtils.class.getClassLoader().getResourceAsStream(files.getName()));
                }
            }
            for (Map.Entry entry : prop.entrySet()) {
                propertiesMap.put((String) entry.getKey(), (String) entry.getValue());
            }

            //如果redis服务存在,则获取redis中的plamform/目录下的缓存放入内存中,每5分钟同步一次
            if (redisService != null) {
                Timer timer = new Timer();
                timer.schedule(new TimesTask(), new Date(), 1000 * 60 * 5);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @param propertiesKey 获取key
     * @return
     */
    public String get(String propertiesKey) {
        return propertiesMap.get(propertiesKey);
    }

    /**
     * @param propertiesKey 获取key
     * @param defaultValue  默认值
     * @return
     */
    public String get(String propertiesKey, String defaultValue) {
        return StringUtils.isNotBlank(propertiesMap.get(propertiesKey)) ? propertiesMap.get(propertiesKey) : defaultValue;
    }

    /**
     * @param plamformKey
     * @param plamformValue
     */
    public void set(String plamformKey, String plamformValue) {
        propertiesMap.put(plamformKey, plamformValue);
    }

    /**
     * 获取配置文件中的值,转化成list
     * 例:propertiesKey:propertiesValue1,propertiesValue2......
     *
     * @param propertiesKey
     * @return
     */
    public List<String> getList(String propertiesKey) {
        String propertiesValues = get(propertiesKey);
        String[] split = propertiesValues.split(",");
        return Arrays.asList(split);
    }

    /**
     * 获取配置文件中的值,转化成map
     * 例:propertiesKey:key1:value1,key2:value2......
     *
     * @param propertiesKey
     * @return
     */
    public Map<String, String> getMap(String propertiesKey) {
        String propertiesValues = get(propertiesKey);
        String[] split = propertiesValues.split(",");

        Map<String, String> map = new HashMap<String, String>();
        for (String value : split) {
            String[] split1 = value.split(":");
            map.put(split1[0], split1[1]);
        }
        return map;
    }

    class TimesTask extends TimerTask {
        @Override
        public void run() {
            Set<String> keys = redisService.keys(null, Constants.REDIS_KEY_ESB_PLAMFORM + "*");
            if (keys.size() > 0) {
                for (String key : keys) {
                    String value = redisService.get(key);
                    propertiesMap.put(key.substring(Constants.REDIS_KEY_ESB_PLAMFORM.length(), key.length()), value);
                }
            }
        }
    }
}
