package com.app.sjkh.biz.impl.business;

import com.alibaba.dubbo.config.annotation.Service;
import com.app.sjkh.commons.servier.RedisService;
import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.commons.utils.NumberUtils;
import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.facade.business.QianQianStockService;
import com.app.sjkh.pojo.local.AcceptedSchedule;
import com.app.sjkh.pojo.local.KhTask;
import com.app.sjkh.service.example.AcceptedScheduleService;
import com.app.sjkh.service.example.KhTaskService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/1.
 */
@Component("qianQianStockService")
@Service
public class QianQianStockServiceImpl implements QianQianStockService {

    private final Log logger = LogFactory.getLog(QianQianStockServiceImpl.class);

    @Autowired
    private KhTaskService khTaskService;

    @Autowired
    private AcceptedScheduleService acceptedScheduleService;

    @Autowired
    private RedisService redisService;

    /**
     * 生成和保存验证码，但不发送，供钱钱炒股使用
     *
     * @param mobileNo
     * @return 000000, 成功;data,code=短信验证码
     * @throws Exception
     */
    public ResultResponse genAndSaveSmsCode(String mobileNo) throws Exception {

        logger.info("【genAndSaveSmsCode】mobileno=" + mobileNo);

        //生成6位验证码
        String code = NumberUtils.generateCode(Constants.CODELENGTH);
        logger.info("【钱钱炒股验证码】smscode=" + code);

        String key = "logincode_" + mobileNo;
        String code_time = code + "_" + DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date());//saved_codetime:685214_2015-10-12 11:19:56
        redisService.set(key, code_time, Constants.SMSCODESAVE_TIME);
        logger.info("钱钱炒股存入缓存服务器的" + key + "," + code_time);

        return ResultResponse.ok(code);
    }

    /**
     * 根据手机号码查询开户开户状态
     *
     * @param mobileNo
     * @return 001029 钱钱数据校验,新开户(首次开户)
     * 001030 钱钱数据校验,未提交(继续开户)
     * 001031 钱钱数据校验,待审核正常")
     * 001032 钱钱数据校验,待审核已驳回")
     * 001033 钱钱数据校验,已开户(失败)")
     * 001034 钱钱数据校验,已开户(成功)")
     * @throws Exception
     */
    public ResultResponse getOpenStockState(String mobileNo) throws Exception {

        //返回结果集
        Map<String, String> resultMap = new HashMap<String, String>();
        //开户执行状态：0：新开户（首次开户）    1：未提交（继续开户）  2：待审核正常    3：待审核已驳回   4：已开户（失败）     5：已开户（成功）
        //开户失败的步骤：doOpenCaptialAcct doUploadImg doSaveRiskSurveyAnswer doBindTpBank openStockAccount

        //已开户（成功、失败）
        List<KhTask> succOrFailList = khTaskService.getSuccOrFailList(mobileNo);

        //说明是已经走开户跑批程序了
        if (succOrFailList != null && succOrFailList.size() > 0) {
            int execResult = 0;
            for (int i = 0; i < succOrFailList.size(); i++) {
                //0:未处理 1:处理中	2:处理完成 	3:处理失败
                KhTask khTask = succOrFailList.get(i);
                if (KhTask.stauts_3.equals(khTask.getStatus())) {    //这里是按照任务表中的状态来判断 回头可以根据任务流水表来判断
                    return ResultResponse.build(ResultCode.HBEC_001033.getCode(), ResultCode.HBEC_001033.getMemo());
                }
                execResult += Integer.parseInt(khTask.getStatus());  //失败:3或者6  	 成功：4
            }

            logger.debug("mobileNo" + mobileNo + " execResult=" + execResult);
            if (execResult == 4) {
                //开户成功
                return ResultResponse.build(ResultCode.HBEC_001034.getCode(), ResultCode.HBEC_001034.getMemo());
            } else {
                //待审核之后10秒之内进行跑批处理，这个状态暂时置为待审核状态
                return ResultResponse.build(ResultCode.HBEC_001031.getCode(), ResultCode.HBEC_001031.getMemo());
            }
        }

        //待审核	(2：待审核正常/已修复    3：待审核已驳回)
        AcceptedSchedule auditInfo = acceptedScheduleService.getAuditInfo(mobileNo);
        if (auditInfo != null) {
            String auditstate = auditInfo.getState();//0:(0：正常   4已修复)    1：已驳回
            if (AcceptedSchedule.state_0.equals(auditstate) || AcceptedSchedule.state_4.equals(auditstate)) {
                return ResultResponse.build(ResultCode.HBEC_001031.getCode(), ResultCode.HBEC_001031.getMemo());
            }
            if (AcceptedSchedule.state_1.equals(auditstate)) {
                return ResultResponse.build(ResultCode.HBEC_001032.getCode(), ResultCode.HBEC_001032.getMemo());
            }
        }

        //未提交
        AcceptedSchedule unSubmitInfo = acceptedScheduleService.getUnSubmitInfo(mobileNo);
        if (unSubmitInfo != null) {
            return ResultResponse.build(ResultCode.HBEC_001030.getCode(), ResultCode.HBEC_001030.getMemo());
        }

        //新开户
        return ResultResponse.build(ResultCode.HBEC_001029.getCode(), ResultCode.HBEC_001029.getMemo());
    }
}
