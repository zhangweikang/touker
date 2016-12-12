package com.app.sjkh.commons.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * properties注册为spring主键,获取加载resources配置文件中的值
 * Created by Administrator on 2016/11/25.
 */
@Component
public class PropertiesUtils {

    private final static Log logger = LogFactory.getLog(PropertiesUtils.class);
    private static Map<String, String> propertiesMap;

    static {
        propertiesMap = new HashMap<>();
        Properties prop = new Properties();

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
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @return
     */
    public String get(String propertiesKey) {
        return propertiesMap.get(propertiesKey);
    }

    /**
     * @param plamformKey
     * @param plamformValue
     */
    public void set(String plamformKey, String plamformValue) {
        propertiesMap.put(plamformKey, plamformValue);
    }

}