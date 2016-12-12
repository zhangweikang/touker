package com.app.sjkh.datasource;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * AOP数据源拦截器datasource
 * 拦截com.app.mappers.datasource包下的所有mapper注入datasource数据源
 *
 * Created by zhangweikang on 2016/8/5.
 */
@Component
@Aspect
public class MultipleDataSourceAspectAdvice {

	@Around("execution(* com.app.mappers.datasource.*.*(..))")
	public Object doAround(ProceedingJoinPoint jp) throws Throwable {
		MultipleDataSource.setDataSourceKey("dataSource");
		return jp.proceed();
	}
}
