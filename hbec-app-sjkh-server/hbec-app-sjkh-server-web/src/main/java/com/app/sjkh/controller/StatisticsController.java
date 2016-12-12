package com.app.sjkh.controller;

import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.AcceptedCustomerInfo;
import com.app.sjkh.pojo.local.AcceptedSchedule;
import com.app.sjkh.service.example.AcceptedCustomerInfoService;
import com.app.sjkh.service.example.AcceptedScheduleService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 对外提供统计接口
 * <p/>
 * Created by zhangweikang on 2016/8/23.
 */
@RequestMapping("statistics")
@Controller
public class StatisticsController {

	private static final Log logger = LogFactory.getLog(StatisticsController.class);

	@Autowired
	private AcceptedCustomerInfoService acceptedCustomerInfoService;

	@Autowired
	private AcceptedScheduleService acceptedScheduleService;

	/**
	 * 根据时间段查询开户成功的用户
	 *
	 * @param request
	 * @return 000000, 成功;data,用户数据
	 * 001004,参数为空
	 * 001037,查询超出返回
	 * 001003,系统异常
	 */
	@RequestMapping(value = "getTimedOpenAccount", method = RequestMethod.POST)
	@ResponseBody
	public ResultResponse getTimedOpenAccount(HttpServletRequest request) {

//		String beginDate = (String) request.getAttribute("beginDate");
//		String endDate = (String) request.getAttribute("endDate");

		String beginDate = request.getParameter("beginDate");
		String endDate = request.getParameter("endDate");

		ResultResponse resultResponse = vailDateParam(beginDate, endDate);
		if (!ResultCode.HBEC_000000.getCode().equals(resultResponse.getStatus())) {
			return resultResponse;
		}

		Map<String, String> data = (Map<String, String>) resultResponse.getData();
		beginDate = data.get("beginDate");
		endDate = data.get("endDate");

		try {
			List<AcceptedCustomerInfo> timedOpenAccount = acceptedCustomerInfoService.getTimedOpenAccount(beginDate, endDate);

			return ResultResponse.ok(timedOpenAccount);
		} catch (Exception e) {
			logger.error("查询指定时间段内开户成功用户数据异常", e);

			return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
		}
	}

	/**
	 * 用户开户进度报表统计
	 *
	 * @param request
	 * @return 000000, 成功;data,用户数据
	 * 001004,参数为空
	 * 001037,查询超出返回
	 * 001003,系统异常
	 */
	@RequestMapping(value = "getScheduleReport", method = RequestMethod.POST)
	@ResponseBody
	public ResultResponse getScheduleReport(HttpServletRequest request) {

//		String beginDate = (String) request.getAttribute("beginDate");
//		String endDate = (String) request.getAttribute("endDate");

		String beginDate = request.getParameter("beginDate");
		String endDate = request.getParameter("endDate");

		ResultResponse resultResponse = vailDateParam(beginDate, endDate);
		if (!ResultCode.HBEC_000000.getCode().equals(resultResponse.getStatus())) {
			return resultResponse;
		}

		Map<String, String> data = (Map<String, String>) resultResponse.getData();
		beginDate = data.get("beginDate");
		endDate = data.get("endDate");

		try {
			List<AcceptedSchedule> scheduleReport = acceptedScheduleService.getScheduleReport(beginDate, endDate);

			return ResultResponse.ok(scheduleReport);
		} catch (Exception e) {
			logger.error("获取用户开户进度报表统计失败", e);
			return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
		}
	}

	/**
	 * 校验处理时间
	 * @param beginDate
	 * @param endDate
	 * @return
	 * beginDate yyyy-MM-dd hh:mm:ss
	 * endDate yyyy-MM-dd hh:mm:ss
	 */
	private ResultResponse vailDateParam(String beginDate, String endDate) {

		Map<String, Object> map = new HashMap<>();

		if (StringUtils.isEmpty(beginDate) || StringUtils.isEmpty(endDate)) {
			return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
		}

		long betweenDate;
		try {
			//设置lenient为false. 否则SimpleDateFormat会比较宽松地验证日期
			SimpleDateFormat format = new SimpleDateFormat(Constants.FormateDate_yyyyMMdd);
			format.setLenient(false);
			Date begin = format.parse(beginDate);
			Date end = format.parse(endDate);
			betweenDate = (end.getTime() - begin.getTime()) / (3600 * 24 * 1000);

			SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
			map.put("beginDate", format1.format(begin) + " 00:00:00");
			map.put("endDate", format1.format(end) + " 23:59:59");
		} catch (Exception e) {
			return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
		}

		if (betweenDate > 31) {
			return ResultResponse.build(ResultCode.HBEC_001037.getCode(), ResultCode.HBEC_001037.getMemo());
		}

		return ResultResponse.ok(map);
	}
}
