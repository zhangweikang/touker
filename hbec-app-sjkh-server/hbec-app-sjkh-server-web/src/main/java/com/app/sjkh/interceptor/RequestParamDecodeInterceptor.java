package com.app.sjkh.interceptor;

import com.app.sjkh.commons.utils.EncryptionUtils;
import com.app.sjkh.commons.utils.PropertiesUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLDecoder;
import java.util.Map;

/**
 * request参数解密
 * <p/>
 * Created by zhangweikang on 2016/8/18.
 */
public class RequestParamDecodeInterceptor extends HandlerInterceptorAdapter {

    private PropertiesUtils propertiesUtils;

    private final Log logger = LogFactory.getLog(RequestParamDecodeInterceptor.class);

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        logger.info("请求路径:" + request.getRequestURI());
        Map parameterMap = request.getParameterMap();

        ServletContext servletContext = request.getSession().getServletContext();
        WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
        if (propertiesUtils == null) {
            propertiesUtils = webApplicationContext.getBean(PropertiesUtils.class);
        }

        String decodeFlag = propertiesUtils.get("decodeFlag");

        if (!"0".equals(decodeFlag)) {
            String _appCrypt_ = (String) parameterMap.get("_appCrypt_");    //密文
            logger.debug("_appCrypt_1:" + _appCrypt_);
            if (_appCrypt_.indexOf("%") > 0) {    //如果加密数据中存在%字符，则需要进行decode
                _appCrypt_ = URLDecoder.decode(_appCrypt_, "UTF8");        //加密数据
            }
            String _appSign_ = (String) parameterMap.get("_appSign_");        //签名数据
            logger.debug("_appCrypt_2:" + _appCrypt_);
            logger.debug("_appSign_:" + _appSign_);
            if (StringUtils.isEmpty(_appCrypt_)) {
                logger.error("加密数据不能为空");
                return false;
            }
            if (StringUtils.isEmpty(_appSign_)) {
                logger.error("签名数据不能为空");
                return false;
            }
            //数据解密
            String decodeData = EncryptionUtils.decryptThreeDESECB(_appCrypt_);
            logger.info("【验签-入参】" + decodeData);
            //数据签名
            String signData = EncryptionUtils.shaEncryption(decodeData);
            //签名数据比对
            if (!_appSign_.equals(signData)) {
                logger.error("数据不合法,验签失败");
                return false;
            }
            logger.info("【验签成功】");
            //decodeData:step=isToukerUser&mobileNo=11555522233
            String[] paramArr = decodeData.split("&");
            if (paramArr != null && paramArr.length > 0) {
                for (int i = 0; i < paramArr.length; i++) {
                    String[] oneParam = paramArr[i].split("=");
                    String key = oneParam[0];
                    String value = "";
                    if (!"null".equals(oneParam[1])) {
                        value = oneParam[1];
                    }
                    request.setAttribute(key, value);
                    logger.info("请求参数: key = " + key + ";value = " + value);
                }
            }
        } else {
            for (Object key : parameterMap.keySet()) {
                String value = ((String[]) parameterMap.get(key))[0];
                request.setAttribute(key.toString(), value);
                logger.info("请求参数: key = " + key + ";value = " + value);
            }
        }
        return true;
    }

}
