package com.app.sjkh.interceptor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * Created by Administrator on 2016/12/20.
 */
public class RequestParamInterceptor extends HandlerInterceptorAdapter {

    private final Log logger = LogFactory.getLog(RequestParamInterceptor.class);

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        logger.info("请求路径:" + request.getRequestURI());

        Map parameterMap = request.getParameterMap();

        for (Object entry : parameterMap.entrySet()) {
            Map.Entry<String,String> entrys = (Map.Entry<String,String>)entry;
            logger.info("请求参数: key = " + entrys.getKey() + ";value = " + entrys.getValue());
        }
    }
}
