package com.app.sjkh.service;

import com.app.sjkh.commons.servier.EsbApiService;
import com.app.sjkh.commons.servier.RedisService;
import com.app.sjkh.commons.servier.ToukerApiService;
import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.commons.utils.NumberUtils;
import com.app.sjkh.commons.utils.PropertiesUtils;
import com.app.sjkh.commons.vo.Account;
import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.*;
import com.app.sjkh.service.example.*;
import com.app.sjkh.service.example.impl.AcceptedMediaUrlServiceImpl;
import com.app.sjkh.service.runnable.SynImgRunnable;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Administrator on 2017/3/1.
 */
@Service
public class ToukerServiceImpl implements ToukerService{

    private final Log logger = LogFactory.getLog(ToukerServiceImpl.class);


    @Autowired
    private EnumValueService enumValueService;

    @Autowired
    private AcceptedSmsLimitService acceptedSmsLimitService;

    @Autowired
    private BBusinessLogService bBusinessLogService;

    @Autowired
    private ToukerIdClientIdRelationService toukerIdClientIdRelationService;

    @Autowired
    private AcceptedCustomerInfoService acceptedCustomerInfoService;

    @Autowired
    private AcceptedScheduleService acceptedScheduleService;

    @Autowired
    private AcceptedCertInfoService acceptedCertInfoService;

    @Autowired
    private BPostService bPostService;

    @Autowired
    private OfficeHolidaysService officeHolidaysService;

    @Autowired
    private CustomerServiceBranchService customerServiceBranchService;

    @Autowired
    private BBranchService bBranchServiceImpl;

    @Autowired
    private AcceptedMediaUrlServiceImpl acceptedMediaUrlService;

    @Autowired
    private AcceptedRejectLogService acceptedRejectLogService;

    @Autowired
    private AcceptedCommissionService acceptedCommissionService;

    @Autowired
    private PropertiesUtils propertiesUtils;

    @Autowired
    private ToukerApiService toukerApiService;

    @Autowired
    private EsbApiService esbApiService;

    @Autowired
    private RedisService redisService;

    @Autowired
    private PromoterService promoterService;

    private final static String REDISSMSCODEKEY = "logincode_";

    /**
     * 发送短信
     *
     * @param mobileNo
     * @param ip
     * @param mac
     * @param opway
     * @return
     * @throws Exception
     */
    public ResultResponse sendSMSCode(String mobileNo, String ip, String mac, String opway) throws Exception {

        ResultResponse resultResponse = ResultResponse.ok();

        //缓存获取短信缓存
        String key = REDISSMSCODEKEY + mobileNo;
        logger.debug("从缓存中获取验证码，key：" + key);
        String saved_codetime = redisService.get(key);
        logger.error("saved_codetime=" + saved_codetime);

        //短信控制
        ResultResponse valiSmsTime = valiSmsTime(saved_codetime, mobileNo, ip);
        if (!ResultCode.HBEC_000000.getCode().equals(valiSmsTime.getStatus())) {
            return valiSmsTime;
        }
        String saved_code = (String) valiSmsTime.getData();

        //生成短信验证码
        String code = NumberUtils.generateCode(Constants.CODELENGTH);
        logger.info("【生成验证码】code=" + code);
        String code_time = code + "_" + DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date());
        redisService.set(key, code_time, NumberUtils.getIntegerValue(propertiesUtils.get("smsTimeOut"), Constants.SMSCODESAVE_TIME));
        logger.info("存入缓存服务器的" + key + "," + code_time);

        //是否是投客注册用户
        ResultResponse accountService = toukerApiService.accountServiceFindByPhone(mobileNo);

        if (ResultCode.HBEC_001003.getCode().equals(accountService.getStatus())) {
            //异常
            return accountService;
        }
        //短信模板名称
        String smsTemplete = "";
        if (ResultCode.HBEC_001011.getCode().equals(accountService.getStatus())) {
            smsTemplete = Constants.RegisterTemplete;
        } else if (ResultCode.HBEC_001012.getCode().equals(accountService.getStatus())) {
            smsTemplete = Constants.AccountLoginTemplete;
        }
        //记录操作日志
        ResultResponse setBusinessLog = setBusinessLog(smsTemplete, saved_code, mobileNo, ip, mac, opway);
        if (!ResultCode.HBEC_000000.getCode().equals(setBusinessLog.getStatus())) {
            return setBusinessLog;
        }
        String sequence = (String) setBusinessLog.getData();

        //发送短信
        logger.info("---发送短信开始---");
        Boolean bool = true;
        String sendFlag = propertiesUtils.get("smsValidateFlg");    //短信发送验证开关   0：不验证     1：验证
        if ("1".equals(sendFlag)) {
            if (Constants.MOBILE_REGIS_CODE.equals(smsTemplete))    //注册投客网
                bool = toukerApiService.sendSMSByMOBILE_REGIS_CODE(mobileNo, code);
            else if (Constants.MOBILE_OPENACC_CODE.equals(smsTemplete))    //手机开户
                bool = toukerApiService.sendSMSByMOBILE_OPENACC_CODE(mobileNo, code);
        }
        logger.info("---发送短信结束---");

        String err_no = "0";
        String err_msg = "发送短信成功";
        if (!bool) {
            err_no = "-1";
            err_msg = "发送短信失败";
        }

        //log4j记录发送短信成功失败日志
        logger.info("手机号码" + mobileNo + err_msg);

        //更新操作日志   短信日志  更新发送短信错误码和错误信息
        BBusinessLog bean1 = new BBusinessLog();
        bean1.setId(sequence);
        bean1.setErrNo(err_no);
        bean1.setErrMsg(err_msg);
        bBusinessLogService.updateSelective(bean1);

        if (!bool) {
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "短信发送失败");
        }

        //累加短信发送次数
        AcceptedSmsLimit smsLimit = new AcceptedSmsLimit();
        smsLimit.setClientSource(ip);
        smsLimit.setMobile(mobileNo);
        AcceptedSmsLimit smsLog = acceptedSmsLimitService.getSmsLog(smsLimit);

        smsLimit.setSendCount(smsLog.getSendCount() + 1);
        smsLimit.setSendDate(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
        acceptedSmsLimitService.updateSendCount(smsLimit);

        return resultResponse;
    }

    /**
     * @param mobileNo
     * @param mobileCode
     * @return 001038, 短信已过期
     * 001039,短信错误
     * 000000,校验成功
     */
    public ResultResponse checkSMSCode(String mobileNo, String mobileCode, String source, String ip, String mac) {

        String redisSmsCode = redisService.get("REDISSMSCODEKEY" + mobileNo);

        //记录登陆日志
        BBusinessLog bean = new BBusinessLog();
        bean.setBegintime(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
        String input = "{mobileNo = " + mobileNo + ",mobileCode = " + mobileCode + "}";
        bean.setInputParam(input);
        bean.setIp(ip);
        bean.setMac(mac);
        bean.setLogType(Constants.BUSINESS_LOGTYPE_LOGIN);
        bean.setOpway(source);
        bean.setOperatorId(mobileNo);
        bean.setOperatorName(mobileCode);
        bean.setErrNo("chakeSMSCode");
        //短信验证标示
        String smsValidateFlg = propertiesUtils.get("smsValidateFlg");
        //测试环境不校验短信
        if (!"0".equals(smsValidateFlg)) {
            if (StringUtils.isBlank(redisSmsCode)) {

                bean.setErrMsg(ResultCode.HBEC_001038.getMemo());
                bBusinessLogService.saveSelective(bean);
                return ResultResponse.build(ResultCode.HBEC_001038.getCode(), ResultCode.HBEC_001038.getMemo());
            }
            if (mobileCode.equals(redisSmsCode)) {
                bean.setErrMsg(ResultCode.HBEC_001039.getMemo());
                bBusinessLogService.saveSelective(bean);
                return ResultResponse.build(ResultCode.HBEC_001039.getCode(), ResultCode.HBEC_001039.getMemo());
            }
        }
        bean.setErrMsg(ResultCode.HBEC_000000.getMemo());
        bBusinessLogService.saveSelective(bean);

        return ResultResponse.ok();
    }

    /**
     * @param mobileNo
     * @param mobileCode
     * @param source
     * @param ip
     * @param mac
     * @return
     */
    public ResultResponse valiSmsCheckUserInfo(String mobileNo, String mobileCode, String source, String ip, String mac) {
        ResultResponse resultResponse = checkSMSCode(mobileNo, mobileCode, source, ip, mac);
        if (ResultCode.HBEC_000000.getCode().compareTo(resultResponse.getStatus()) != 0) {
            return resultResponse;
        }
        return valiUserInfo(mobileNo, Integer.valueOf(source));
    }

    /**
     * 获取用户信息
     *
     * @param mobileNo
     * @return 000000, 正常
     * 001040,有驳回
     */
    public ResultResponse valiUserInfo(String mobileNo, Integer source) {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            //获取用户数据
            AcceptedCertInfo certInfo = acceptedCertInfoService.getCertInfo(mobileNo, source);
            resultMap.put("acceptedCertInfo", certInfo);
            //获取用户流程
            AcceptedSchedule acceptedSchedule = acceptedScheduleService.getSchedule(certInfo.getId().toString());
            resultMap.put("acceptedSchedule", acceptedSchedule);
            //获取用户开户信息
            AcceptedCustomerInfo acceptedCustomerInfo = acceptedCustomerInfoService.queryById(certInfo.getId());

            if (acceptedCustomerInfo != null) {
                resultMap.put("acceptedCustomerInfo", acceptedCustomerInfo);
                String branchno = acceptedCustomerInfo.getBranchno();
                String commission = acceptedCustomerInfo.getCommission();
                if (StringUtils.isNotBlank(branchno)) {
                    //获取营业部信息
                    BBranch branchInfo = bBranchServiceImpl.getBranchInfo(branchno);

                    resultMap.put("branchInfo", branchInfo);
                    /*if (StringUtils.isNotBlank(commission)) {
                        AcceptedCommission queryBean = new AcceptedCommission();
                        queryBean.setBranchNo(branchno);
                        queryBean.setSortNo(commission);
                        //获取营业部佣金
                        AcceptedCommission acceptedCommission = acceptedCommissionService.queryOneByWhere(queryBean);

                        resultMap.put("acceptedCommission", acceptedCommission);
                    }*/
                }
                //获取用户驳回信息
                List<AcceptedRejectLog> acceptedRejectLogs = acceptedRejectLogService.getReject(certInfo.getId());
                if (acceptedRejectLogs != null && !acceptedRejectLogs.isEmpty()) {
                    Map<String, Object> beanMap = new HashMap<>();
                    for (AcceptedRejectLog acceptedRejectLog : acceptedRejectLogs) {
                        beanMap.put(acceptedRejectLog.getFieldenname(), acceptedRejectLog);
                    }
                    resultMap.put("acceptedRejectLogs", beanMap);
                    return ResultResponse.build(ResultCode.HBEC_001040.getCode(), null, resultMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResultResponse.ok(resultMap);
    }

    /**
     * 为已注册投客网用户,手机号和投客网ID关联
     *
     * @param mobileNo 手机号
     * @param channel  渠道
     * @throws Exception
     */
    public ResultResponse mobileRelationUserId(String mobileNo, String channel) throws Exception {
        logger.info("mobileno=" + mobileNo + "channel=" + channel);

        ResultResponse resultResponse = toukerApiService.accountServiceFindByPhone(mobileNo);
        //获取手机号在投客信息
        if (!ResultCode.HBEC_001012.getCode().equals(resultResponse.getStatus())) {
            logger.info("获取用户信息失败或者用户未注册,mobileNo:" + mobileNo + "status=" + resultResponse.getStatus());
            return resultResponse;
        }
        //手机已注册,判断用户是否已经开出客户号
        Account data = (Account) resultResponse.getData();
        String customerId = data.getCustomerId();
        logger.debug("投客客户号=" + customerId);
        if (StringUtils.isBlank(customerId)) {
            //将手机号码和投客id关联
            //首先判断数据是否存在关联
            ToukerIdClientIdRelation bean = new ToukerIdClientIdRelation();
            bean.setMobileno(mobileNo);
            bean = toukerIdClientIdRelationService.queryOneByWhere(bean);
            if (bean == null) {
                //插入记录
                Long toukerId = data.getId();
                bean = new ToukerIdClientIdRelation();
                String sequence = toukerIdClientIdRelationService.querySequence();
                if (StringUtils.isBlank(sequence)) {
                    logger.info("toukerIdClientIdRelationService获取序列失败");
                    return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
                }
                bean.setId(Long.parseLong(sequence));
                bean.setMobileno(mobileNo);
                bean.setToukerId(toukerId.toString());
                bean.setCreatetime(DateUtils.convertDate(Constants.FormateDate_yyyyMMddHHmmss));
                bean.setUpdatetime(DateUtils.convertDate(Constants.FormateDate_yyyyMMddHHmmss));
                bean.setSource(channel);
                bean.setSynchFlag(ToukerIdClientIdRelation.SyncNo);
                toukerIdClientIdRelationService.save(bean);
            } else {
                //更新最后操作时间记录
                bean.setUpdatetime(DateUtils.convertDate(Constants.FormateDate_yyyyMMddHHmmss));
                toukerIdClientIdRelationService.updateSelective(bean);
            }
        } else {
            logger.info("手机号" + mobileNo + "之前已经与账户系统客户号" + customerId + "关联,不必再次关联");
        }

        return ResultResponse.ok();
    }

    /**
     * 注册投客网，将toukerId与手机号码关联
     *
     * @param mobileNo
     * @param loginPass
     * @param channel
     * @return 001003:系统异常
     * 001013:注册成功
     * 000000:成功
     * @throws Exception
     */
    public ResultResponse registerTouker(String mobileNo, String loginPass, String channel) throws Exception {

        ResultResponse resultResponse = toukerApiService.accountServiceRegistService(mobileNo, loginPass);
        if (!ResultCode.HBEC_001013.getCode().equals(resultResponse.getStatus())) {
            logger.info("touker注册失败,mobileNo=" + mobileNo);
            return resultResponse;
        }

        Account data = (Account) resultResponse.getData();
        ToukerIdClientIdRelation bean = new ToukerIdClientIdRelation();
        String sequence = toukerIdClientIdRelationService.querySequence();
        if (StringUtils.isBlank(sequence)) {
            logger.info("toukerIdClientIdRelationService获取序列失败");
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
        bean.setId(Long.parseLong(sequence));
        bean.setMobileno(mobileNo);
        bean.setToukerId(data.getId().toString());
        bean.setCreatetime(DateUtils.convertDate(Constants.FormateDate_yyyyMMddHHmmss));
        bean.setUpdatetime(DateUtils.convertDate(Constants.FormateDate_yyyyMMddHHmmss));
        bean.setSource(channel);
        bean.setSynchFlag(ToukerIdClientIdRelation.SyncNo);    //未同步
        toukerIdClientIdRelationService.save(bean);
        logger.info("手机号与投客id关联成功" + mobileNo + "-" + data.getId().toString());

        return ResultResponse.ok();
    }

    /**
     * 判断手机号码和ip地址是否锁住
     *
     * @param mobile
     * @param loginip
     * @return
     * @throws Exception
     */
    private Map<String, Object> isSmsLocked(String mobile, String loginip) throws Exception {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        EnumValue bean = new EnumValue();
        bean.setEnumType(Constants.SmsLockTime);
        EnumValue smsLockTime = enumValueService.queryOneByWhere(bean);
        int sms_lock_time = Integer.parseInt(smsLockTime.getItemValue());//120s
        bean.setEnumType(Constants.MaxSmsNum);
        EnumValue maxSmsNum = enumValueService.queryOneByWhere(bean);
        int max_sms_num = Integer.parseInt(maxSmsNum.getItemValue());//20s
        bean.setEnumType(Constants.SmsLimitRecycle);
        EnumValue smsLimitRecycle = enumValueService.queryOneByWhere(bean);
        int sms_limit_recycle = Integer.parseInt(smsLimitRecycle.getItemValue());//120s

        AcceptedSmsLimit acceptedSmsLimit = new AcceptedSmsLimit();
        acceptedSmsLimit.setClientSource(loginip);
        acceptedSmsLimit.setMobile(mobile);
        AcceptedSmsLimit smsLog = acceptedSmsLimitService.getSmsLog(acceptedSmsLimit);

        Boolean isLocked = true;
        String msg = "";
        if (smsLog != null && smsLog.getSendCount() > max_sms_num) {
            SimpleDateFormat format = new SimpleDateFormat(Constants.FormateDate);
            Date date = format.parse(smsLog.getSendDate());
            Date now = format.parse(DateUtils.convertDate(Constants.FormateDate));
            long l = now.getTime() - date.getTime();
            int times = (int) (l / 1000L);
            if (times < sms_lock_time && times < sms_limit_recycle) {
                isLocked = false;
                msg = "发送的短信数量超过限制,请" + sec2cn(sms_lock_time - times) + "后再试";
            } else {
                //短信验证码解除锁定,修改发送条数
                smsLog.setSendCount(0);
                acceptedSmsLimitService.updateSendCount(smsLog);
            }
        }
        resultMap.put("islocked", isLocked);
        resultMap.put("msg", msg);
        return resultMap;
    }

    /**
     * 短信时间处理
     *
     * @param i
     * @return
     */
    private static String sec2cn(int i) {
        int hour = i / 3600;
        int min = (i - hour * 3600) / 60;
        int sec = i - hour * 3600 - min * 60;
        String result = "";
        if (hour > 0) {
            result = hour + "小时";
        }
        if (min > 0) {
            result = result + min + "分钟";
        }
        if (sec > 0) {
            result = result + sec + "秒";
        }
        return result;
    }

    /**
     * 检验用户发送短信时间控制
     *
     * @param savedCodetime
     * @param mobileNo
     * @param ip
     * @return
     */
    private ResultResponse valiSmsTime(String savedCodetime, String mobileNo, String ip) {

        String saved_code = "";

        if (!StringUtils.isBlank(savedCodetime)) {
            String[] codetime = savedCodetime.split("_");
            saved_code = codetime[0];
            String sendTime = codetime[1];
            int sms_sendtime = Constants.SMSCODESEND_TIME;
            String current_time = DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date());
            Date sendDate = DateUtils.parseDate(sendTime, Constants.FormateDate);
            Date date = new Date();
            logger.error("date=" + current_time);
            long time_space = (date.getTime() - sendDate.getTime()) / 1000L;
            logger.error("time_space=" + time_space);
            if (time_space < sms_sendtime) {
                return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "您的验证码已经通过短信发送,请勿频繁点击发送按钮");
            }
        }

        //限制短信发送
        try {
            Map<String, Object> resultMap = isSmsLocked(mobileNo, ip);
            if (!resultMap.isEmpty()) {
                Boolean islocked = (Boolean) resultMap.get("islocked");
                String lockMsg = (String) resultMap.get("msg");
                if (!islocked) {
                    logger.info("短信限制：lockMsg=" + lockMsg + ",mobileNo=" + mobileNo + ",ip=" + ip);
                    return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "短信限制：" + lockMsg);
                }
            }
        } catch (Exception e) {
            logger.error("判断手机号码和ip地址是否锁住失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常,请稍后再试!");
        }

        return ResultResponse.ok(saved_code);
    }

    /**
     * 记录操作日志,短信日志
     *
     * @param smsTemplete
     * @param savedCode
     * @param mobileNo
     * @param ip
     * @param mac
     * @param opway
     * @return
     */
    private ResultResponse setBusinessLog(String smsTemplete, String savedCode, String mobileNo, String ip, String mac, String opway) throws Exception {

        //拼接短信内容，记录日志
        String content = "";
        if (Constants.MOBILE_REGIS_CODE.equals(smsTemplete))        //注册投客网
            content = toukerApiService.getSmsRegiste(savedCode);
        else if (Constants.MOBILE_OPENACC_CODE.equals(smsTemplete))    //手机开户
            content = toukerApiService.getSmsOpenAcc(savedCode);

        //记录操作日志   短信日志
        String input_param = "{mobile_no=" + mobileNo + ", content=" + content + "}";

        BBusinessLog bBusinessLog = new BBusinessLog();
        String sequence = bBusinessLogService.querySequence();
        if (StringUtils.isBlank(sequence)) {
            logger.info("获取序列失败");
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
        bBusinessLog.setId(sequence);
        bBusinessLog.setOperatorId(mobileNo);
        bBusinessLog.setLogType(BBusinessLog.LogTypeSms);
        bBusinessLog.setInputParam(input_param);
        bBusinessLog.setIp(ip);
        bBusinessLog.setMac(mac);
        bBusinessLog.setOpway(opway);
        bBusinessLog.setOperatorName(mobileNo);
        bBusinessLog.setBegintime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));

        try {
            bBusinessLogService.save(bBusinessLog);
        } catch (Exception e) {
            logger.error("记录操作日志,短信日志失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }

        return ResultResponse.ok(sequence);
    }

    /**
     * 查询用户绑卡信息
     *
     * @param customerId
     * @return 001015, 已绑三方存管
     * 001017,已绑三方支付
     * 001020,未绑三方存管,未绑三方支付
     * @throws Exception
     */
    public ResultResponse queryInfoBank(String customerId) {
        logger.info("【queryInfoBank】customerId=" + customerId);
        if (!StringUtils.isBlank(customerId)) {
            //查询开通的三方存管信息
            ResultResponse resultResponse = esbApiService.queryBankInfoByDingDian(customerId);
            if (ResultCode.HBEC_001015.getCode().equals(resultResponse.getStatus())) {
                return resultResponse;
            }

            //查询是否绑定的三方支付信息
            /*ResultResponse resultResponse1 = esbApiService.queryQuickBankCard(customerId);
            if (ResultCode.HBEC_001017.getCode().equals(resultResponse1.getStatus())) {
                return resultResponse1;
            }*/
        }
        return ResultResponse.build(ResultCode.HBEC_001020.getCode(), ResultCode.HBEC_001020.getMemo());
    }

    /**
     * 前提： 该手机号已在账户系统存在客户号
     * 思路：
     * 如果该手机号在思迪系统中客户信息表中存在记录
     * 查询是否已经开出客户号
     * 是：提示已经开户
     * 否：
     * 查询开户状态是否是待审核状态
     * 是：提示已经申请开户
     * 否：
     * 查询思迪中对应的身份证号是否与顶点中已绑定的客户号的身份证一致
     * 否：重新上传身份证，清除客户表、证书表数据，重置营业部
     * 是：走后续开户流程
     * <p/>
     * 如果该手机号在思迪系系统中客户信息表中不存在记录
     * 查询该手机号在思迪系系统中证书信息表是否存在记录
     * 是：查询思迪中对应的身份证号是否与顶点中已绑定的客户号的身份证一致
     * 否：重新上传身份证，清除证书表、重置营业部
     * 是：走后续开户流程
     * 否：
     * 新开户，设置默认营业部
     *
     * @param mobileNo
     * @param customerId
     * @param opway
     * @return 000000, 用户信息正常
     * 001004,参数异常
     * 001025,不需要重新上传身份证
     * 001026,已在投客上传身份证
     * 001024,需要重新上传身份证
     * 001003,系统异常
     * @throws Exception
     */
    public ResultResponse validateCustInfo(String mobileNo, String customerId, Integer opway) throws Exception {
        Map<String, String> resultMap = new HashMap<>();
        String idnoDD;    //顶点客户号对应身份证号
        logger.info("validateCustInfo:mobileno=" + mobileNo + " khh=" + customerId);
        if (StringUtils.isBlank(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }

        //查询客户信息表中数据（T_Accepted_Customer_Info）
        AcceptedCustomerInfo acceptedCustomerInfo = acceptedCustomerInfoService.queryOneByMoblie(mobileNo);

        if (StringUtils.isNotBlank(customerId)) {
            //顶点系统已经存在客户号的流程

            ResultResponse resultResponse = esbApiService.queryCustomerInfoByDingDian(Constants.BSLX_KHH, customerId);//获取顶点用户信息
            if (!ResultCode.HBEC_000000.getCode().equals(resultResponse.getStatus())) {
                logger.info("根据用户客户号查询用户信息失败");
                return resultResponse;
            }
            HashMap<String, String> customerInfo = (HashMap<String, String>) resultResponse.getData();
            //本地没有用户信息
            idnoDD = customerInfo.get("zjbh").trim();
            String yyb = customerInfo.get("yyb");
            logger.info("手机号" + mobileNo + "在顶点系统客户号" + customerId + "对应的身份证号：" + idnoDD + " 营业部:" + yyb);

            //手机号在本地客户信息表中存在记录
            if (acceptedCustomerInfo != null) {

                String clientId = acceptedCustomerInfo.getClientId();
                if (StringUtils.isBlank(clientId)) {
                    //已开出客户号来  直接提示客户
                    logger.info("手机号" + mobileNo + "已经开出客户号,请您输入新的手机号！");
                    return ResultResponse.build(ResultCode.HBEC_001025.getCode(), ResultCode.HBEC_001025.getMemo(), resultMap);
                }
                //本地系统没有客户号

                String branchno = acceptedCustomerInfo.getBranchno();//本地记录营业部

                //是否进入待审核或者回访状态
                Long userid = acceptedCustomerInfo.getUserid();
                AcceptedSchedule schedule = new AcceptedSchedule();
                schedule.setUserId(userid.toString());
                schedule = acceptedScheduleService.queryOneByWhere(schedule);
                String backStep = schedule.getBackStep();
                if ("a".equals(backStep) || "e".equals(backStep)) {
                    //开户状态进入到待审核或者回访阶段
                    //待审状态或者回访，不去判断身份证是否一致，不准修改身份信息
                    logger.info("手机号" + mobileNo + "的开户资料已提交，处于待审核或者回访状态");
                    return ResultResponse.build(ResultCode.HBEC_001025.getCode(), ResultCode.HBEC_001025.getMemo(), resultMap);
                }

                //开户状态未进入到待审核阶段，需要校验顶点身份证与思迪库表中的身份证是否一致

                //本地系统中的身份证号
                String idnoSD = acceptedCustomerInfo.getIdno();

                logger.info("手机号=" + mobileNo + "在思迪身份证=" + idnoSD + " 营业部=" + branchno);
                if (StringUtils.isBlank(idnoDD) || StringUtils.isBlank(idnoSD)) {
                    logger.info("思迪系统或者顶点接口返回的的客户身份证号为空");
                    return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo(), resultMap);
                }

                //本地库表中身份证号与顶点客户号绑定身份证号不一致
                if (!idnoDD.equals(idnoSD)) {
                    //用顶点系统的营业部替换掉思迪系统中的营业部
                    //清除客户身份证信息 客户信息表、更新证书信息表、重置营业部
                    acceptedCustomerInfoService.deleteByMobileNo(mobileNo);

                    //更新证书信息表
                    AcceptedCertInfo updateCertInfo = new AcceptedCertInfo();
                    updateCertInfo.setBranchno(yyb);    //重置营业部
                    updateCertInfo.setCreatedate(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
                    updateCertInfo.setMobileno(mobileNo);
                    acceptedCertInfoService.updateByMoblieNoSelective(updateCertInfo);

                    logger.info("手机号" + mobileNo + "的身份证信息与投客网绑定身份证信息不一致，请重新上传身份证信息");

                    //判断是否需要拉取身份证（如果客户已经在投客网上传过身份证则直接拉去过来）
                    ResultResponse imgFromTouker = getImgFromTouker(mobileNo, acceptedCustomerInfo.getUserid().toString(), customerInfo);
                    Object obj = imgFromTouker.getData();
                    if (obj != null) {
                        resultMap.putAll((HashMap<String, String>) obj);
                    }
                    imgFromTouker.setData(resultMap);
                    return imgFromTouker;
                }

                //本地的身份与顶点客户号对应的身份证一致，走继续开户流程，重置营业部
                if (!yyb.equals(branchno)) {
                    //将顶点客户号对应的的营业部替换掉思迪中的营业部
                    //证书信息表
                    AcceptedCertInfo certTmp = new AcceptedCertInfo();
                    certTmp.setBranchno(yyb);
                    certTmp.setUpdatedate(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
                    certTmp.setMobileno(mobileNo);
                    acceptedCertInfoService.updateByMoblieNoSelective(certTmp);
                    //客户信息表
                    AcceptedCustomerInfo custTmp = new AcceptedCustomerInfo();
                    custTmp.setBranchno(yyb);
                    custTmp.setMobileno(mobileNo);
                    custTmp.setId(acceptedCustomerInfo.getId());
                    acceptedCustomerInfoService.updateSelective(custTmp);
                }
                //继续后续开户流程
                //已经视频见证过了，不需要去投客网判断是否上传了身份证影像和拉取影像
                return ResultResponse.ok(resultMap);
            }

            //查询证书信息表
            AcceptedCertInfo certInfo = new AcceptedCertInfo();
            certInfo.setMobileno(mobileNo);
            certInfo = acceptedCertInfoService.queryOneByWhere(certInfo);

            String idnoSD = certInfo.getIdno();
            logger.info("思迪系统证书表中身份号：" + idnoSD);
            if (StringUtils.isBlank(idnoSD)) {    //从未在app上传身份证
                certInfo.setBranchno(yyb);    //重置营业部
                certInfo.setMobileno(mobileNo);
                acceptedCertInfoService.updateByMoblieNoSelective(certInfo);
                //判断是否需要拉去身份证
                ResultResponse imgFromTouker = getImgFromTouker(mobileNo, certInfo.getId().toString(), customerInfo);
                Object obj = imgFromTouker.getData();
                if (obj != null) {
                    resultMap.putAll((HashMap<String, String>) obj);
                }
                imgFromTouker.setData(resultMap);
                return imgFromTouker;
            }

            //已经在app上传过身份证信息
            if (!idnoDD.equals(idnoSD)) {    //身份证号不一致
                logger.info("手机号" + mobileNo + "的身份证信息与投客网绑定身份证信息不一致，请重新上传身份证信息");
                //更新开户记录
                AcceptedCertInfo updateCertInfo = new AcceptedCertInfo();
                updateCertInfo.setId(certInfo.getId());
                updateCertInfo.setMobileno(mobileNo);
                updateCertInfo.setOpacctkindFlag("0");
                updateCertInfo.setAccessChannel(opway);
                updateCertInfo.setState(AcceptedCertInfo.State_0);
                updateCertInfo.setBranchno(yyb);    //重置营业部
                updateCertInfo.setCreatedate(DateUtils.convertDate(Constants.RegisterTemplete));
                acceptedCertInfoService.updateByMoblieNoSelective(updateCertInfo);

                //判断是否需要拉取身份证
                ResultResponse imgFromTouker = getImgFromTouker(mobileNo, certInfo.getId().toString(), customerInfo);
                Object obj = imgFromTouker.getData();
                if (obj != null) {
                    resultMap.putAll((HashMap<String, String>) obj);
                }
                imgFromTouker.setData(resultMap);
                return imgFromTouker;
            }
            //身份证号一致
            AcceptedCertInfo certTmp = new AcceptedCertInfo();
            certTmp.setBranchno(yyb); //重置营业部
            certTmp.setMobileno(mobileNo);
            acceptedCertInfoService.updateByMoblieNoSelective(certTmp);
            //说明已经上传过了身份证也不需要去投客网查询影像并拉取
            return ResultResponse.ok(resultMap);
        }

        //客户信息表不为空	步骤肯定已经在身份证信息确认之后
        if (acceptedCustomerInfo != null) {
            String clientId = acceptedCustomerInfo.getClientId();
            if (!StringUtils.isBlank(clientId)) {
                //思迪系统已经开出客户号
                logger.info("手机号" + mobileNo + "的手机号已经开出客户号,请您输入新的手机号！");
                return ResultResponse.build(ResultCode.HBEC_001025.getCode(), ResultCode.HBEC_001025.getMemo(), resultMap);
            }
            //思迪系统未开出客户号
            //查询是否进入待审核或者回访状态
            Long userid = acceptedCustomerInfo.getUserid();
            AcceptedSchedule schedule = new AcceptedSchedule();
            schedule.setUserId(userid.toString());
            schedule = acceptedScheduleService.queryOneByWhere(schedule);
            String backStep = schedule.getBackStep();
            if ("a".equals(backStep) || "e".equals(backStep)) {//开户状态进入到待审核或者回访阶段
                //如果是待审状态，不去判断身份证是否一致，不准修改身份信息
                logger.info("手机号" + mobileNo + "的开户资料已提交，处于待审核或者回访状态");
                return ResultResponse.build(ResultCode.HBEC_001025.getCode(), ResultCode.HBEC_001025.getMemo(), resultMap);
            }
        }
        return ResultResponse.ok(resultMap);
    }

    /**
     * 校验用户数据
     *
     * @param mobileNo   手机号码(必传)
     * @param customerId 客户号(非必传)
     * @param opway      渠道(传客户号必传)
     * @return 001004:参数为空
     * 001003:系统异常
     * 001006:查询结果为空
     * 001041:已走完开户流程
     * 001042:未走完开户流程
     * @throws Exception
     */
    public ResultResponse validateCustomerInfo(String mobileNo, String customerId, Integer opway) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        if (StringUtils.isBlank(mobileNo)) {
            return ResultResponse.build(ResultCode.HBEC_001004.getCode(), ResultCode.HBEC_001004.getMemo());
        }

        AcceptedCustomerInfo acceptedCustomerInfo = acceptedCustomerInfoService.queryOneByMoblie(mobileNo);
        resultMap.put("acceptedCustomerInfo", acceptedCustomerInfo);

        AcceptedCertInfo queryCertInfo = new AcceptedCertInfo();
        queryCertInfo.setMobileno(mobileNo);
        AcceptedCertInfo acceptedCertInfo = acceptedCertInfoService.getCertInfo(mobileNo, opway);
        resultMap.put("acceptedCertInfo", acceptedCertInfo);

        //用户输入手机号查询用户信息表,已存在客户号则返回
        if (acceptedCustomerInfo != null && StringUtils.isNotBlank(acceptedCustomerInfo.getClientId())) {
            return ResultResponse.build(ResultCode.HBEC_001041.getCode(), ResultCode.HBEC_001041.getMemo(), resultMap);
        }

        AcceptedSchedule acceptedSchedule = acceptedScheduleService.getSchedule(acceptedCertInfo.getId().toString());
        resultMap.put("acceptedSchedule", acceptedSchedule);

        String backStep = acceptedSchedule.getBackStep();
        //用户处于开户流程已走完或者有驳回记录,直接返回
        if ("a".equals(backStep) || "e".equals(backStep)) {
            logger.info("手机号" + mobileNo + "的开户资料已提交，处于待审核或者回访状态");
            //获取用户驳回信息
            List<AcceptedRejectLog> acceptedRejectLogs = acceptedRejectLogService.getReject(acceptedCertInfo.getId());
            if (acceptedRejectLogs != null && !acceptedRejectLogs.isEmpty()) {
                Map<String, Object> beanMap = new HashMap<>();
                for (AcceptedRejectLog acceptedRejectLog : acceptedRejectLogs) {
                    beanMap.put(acceptedRejectLog.getFieldenname(), acceptedRejectLog);
                }
                resultMap.put("acceptedRejectLogs", beanMap);
            }
            return ResultResponse.build(ResultCode.HBEC_001041.getCode(), ResultCode.HBEC_001041.getMemo(), resultMap);
        }

        //当用户客户号和营业部都为空时,给用户设置默认营业部
        /*if (StringUtils.isBlank(acceptedCertInfo.getBranchno()) && StringUtils.isBlank(customerId)) {
            resultMap.putAll(updateBranchNo(acceptedCertInfo, acceptedCustomerInfo, propertiesUtils.get("branchNo"), mobileNo, opway));
        }*/

        if (StringUtils.isNotBlank(customerId)) {
            ResultResponse resultResponse = esbApiService.queryCustomerInfoByDingDian(Constants.BSLX_KHH, customerId);

            if (ResultCode.HBEC_000000.getCode().compareTo(resultResponse.getStatus()) != 0) {
                logger.error("顶点查询用户信息异常");
                return resultResponse;
            }

            Map<String, String> customrtInfo = (Map<String, String>) resultResponse.getData();

            String zjbh = customrtInfo.get("zjbh");
            resultMap.put("idnoDD", zjbh);
            String yyb = customrtInfo.get("yyb");

            if (StringUtils.isBlank(zjbh) || StringUtils.isBlank(yyb)) {
                logger.info("查询用户信息为空,顶点:customrtInfo:" + customrtInfo);
                return ResultResponse.build(ResultCode.HBEC_001006.getCode(), ResultCode.HBEC_001006.getMemo());
            }

            //本地记录身份证号码与顶点记录身份证号码不一致,删除用户信息表数据
            if (acceptedCustomerInfo != null && StringUtils.isNotBlank(acceptedCustomerInfo.getIdno()) && !StringUtils.equals(acceptedCustomerInfo.getIdno(), zjbh)) {
                acceptedCustomerInfoService.deleteByMobileNo(mobileNo);
            }

            //本地记录用户的开户营业部与顶点查询的开户营业部不一致,更新本地开户营业部,和佣金费率
            /*if (!StringUtils.equals(acceptedCertInfo.getBranchno(), yyb)) {
                resultMap.putAll(updateBranchNo(acceptedCertInfo, acceptedCustomerInfo, yyb, mobileNo, opway));
            }*/
        }

        //获取经纪人推荐关系
        getAgentByPhone(mobileNo);

        return ResultResponse.build(ResultCode.HBEC_001042.getCode(), ResultCode.HBEC_001042.getMemo(), resultMap);
    }

    /**
     * 如果客户已经在投客网上传过身份证影像资料，则直接去获取
     * 1、前提
     * 	存在客户号
     *
     * @params:
     * @author: xujianhua@touker.com
     * @throws Exception
     * @datetime:2016-1-4 下午04:34:24
     */

    /**
     * @param mobileno 手机号码
     * @param userId   用户Id
     * @param data     queryCustomerInfoByDingDian顶点查询的用户信息
     * @return 001024, 需重新上传
     * 001026,身份证影像已在投客上传
     * 001003,系统异常
     * @throws Exception
     */
    public ResultResponse getImgFromTouker(String mobileno, String userId, Map<String, String> data) throws Exception {
        Map<String, String> resultMap = new HashMap<String, String>();

        //zjjzrq  证件截止日期,格式：YYYYMMDD(30001231代表"长期")
        String idenddate = data.get("zjjzrq");        //顶点记录的身份证截止日期
        SimpleDateFormat format = new SimpleDateFormat(Constants.FormateDate_yyyyMMdd);
        String nowDate = format.format(new Date());
        if (Integer.parseInt(idenddate) < Integer.parseInt(nowDate)) {    //身份证过期，强制重新上传身份证
            logger.info("身份证已过期,idenddate=" + idenddate);
            return ResultResponse.build(ResultCode.HBEC_001024.getCode(), ResultCode.HBEC_001024.getMemo());
        }

        //根据手机号查询投客id
        ResultResponse resultResponse = toukerApiService.accountServiceFindByPhone(mobileno);
        if (!ResultCode.HBEC_001012.getCode().equals(resultResponse.getStatus())) {
            resultResponse.setStatus(ResultCode.HBEC_001003.getCode());
            return resultResponse;
        }

        Account account = (Account) resultResponse.getData();
        //查询是否上传过影像
        Integer certUploadState = account.getCertUploadState();
        String toukerId = account.getId().toString();

        if (2 == certUploadState) {
            //已经上传过身份证并通过审核
            //如果已经在投客网有身份证影像信息，则直接拉过来存储到数据库当中
            SynImgRunnable front = new SynImgRunnable(userId, toukerId, Constants.CERT_PIC_FRONT, toukerApiService, acceptedMediaUrlService);
            SynImgRunnable back = new SynImgRunnable(userId, toukerId, Constants.CERT_PIC_BACK, toukerApiService, acceptedMediaUrlService);
            Thread frontThread = new Thread(front);
            Thread backThread = new Thread(back);
            frontThread.start();
            backThread.start();

            //从顶点获取身份证信息，在身份信息确认页面进行显示
            resultMap.put("idno", data.get("zjbh"));
            resultMap.put("custname", data.get("khmc"));
            resultMap.put("policeorg", data.get("zjfzjg"));    //证件发证机关
            resultMap.put("natives", data.get("zjdz"));        //证件地址
            resultMap.put("addr", data.get("jtdz"));            //联系地址

            //解决没有起始日期无法开户的问题
            String idbegindate = Constants.IdbeginDate;
            if (StringUtils.isNotBlank(data.get("zjqsrq")))
                idbegindate = data.get("zjqsrq");
            resultMap.put("idbegindate", idbegindate);
            logger.info("************[idbegindate]:" + idbegindate);

            resultMap.put("idenddate", data.get("zjjzrq"));
            resultMap.put("profession_code", data.get("zydm"));    //职业
            resultMap.put("edu", data.get("xl"));

            String postid = data.get("jtyb");
            if (StringUtils.isBlank(postid)) {
                try {
                    postid = bPostService.queryPostId(data.get("zjdz"));
                } catch (Exception e) {
                    logger.error("城市名称查询邮编异常" + data.get("zjdz"), e);
                }
            }
            resultMap.put("postid", postid);
            //已经从投客网拉去了身份证，app上跳转到身份信息确认页面
            return ResultResponse.build(ResultCode.HBEC_001026.getCode(), ResultCode.HBEC_001026.getMemo(), resultMap);
        }

        //未在投客网上传或者已上传但审核未通过,需要重新上传
        return ResultResponse.build(ResultCode.HBEC_001024.getCode(), ResultCode.HBEC_001024.getMemo());
    }

    public ResultResponse clearUnSubmitUserInfo(String idno, String userId) throws Exception {

        List<AcceptedCertInfo> certInfoAcceptedSchedule = acceptedCertInfoService.getCertInfoAcceptedSchedule(idno, userId);

        if (certInfoAcceptedSchedule != null && certInfoAcceptedSchedule.size() > 0) {
            //该身份证信息之前已经被占用
            AcceptedCertInfo acceptedCertInfo = certInfoAcceptedSchedule.get(0);
            Long deleteId = acceptedCertInfo.getId();
            //判断占用着的开户流程是否是待审核状态了,如果未到待审核需要删除占用者信息，否则不能删除
            AcceptedSchedule schedule = new AcceptedSchedule();
            schedule.setUserId(deleteId.toString());

            schedule = acceptedScheduleService.queryOneByWhere(schedule);
            if (schedule != null && schedule.getBackStep().equals("0")) {    //如果未到待审核就删除占用着信息 否则
                logger.error("客户信息已经被占用,需要清理被占用客户信息,占用着userid=" + deleteId);
                //清除之前占用者的信息记录
                acceptedCertInfoService.deleteById(deleteId);
                acceptedCustomerInfoService.deleteByuserId(deleteId);
                return ResultResponse.ok();
            }

            logger.info("该身份证信息已经被使用，请使用其他身份证  占用者id为" + deleteId);
            return ResultResponse.build(ResultCode.HBEC_001023.getCode(), ResultCode.HBEC_001023.getMemo());
        }

        return ResultResponse.ok();
    }

    /**
     * 判断是当前时间是否是交易时间
     * <p/>
     * 经过确认，手机开户功能，在交易日的可用时间为： 9:00-20:00，双休日的可用时间为:9：00-17:00，节假日均不可用。
     * 现在需要在不可用时间段内给出相关提示，
     * 提示内容如下:“ 很抱歉！目前开户系统为非服务时间，请您在交易日9:00-20:00及双休日9：00-17:00（节假日休息）进行开户操作，感谢您对华宝证券的支持！”)
     *
     * @return 001035, 非交易时间
     * 001036,交易时间
     */
    public ResultResponse getTradeDate() {

        Date date = new Date();
        int hour = date.getHours();
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        String currDate = format.format(date);

        OfficeHolidays bean = new OfficeHolidays();
        bean.setCurrentday(currDate);
        List<OfficeHolidays> officeHolidayses = officeHolidaysService.queryByWhere(bean);

        if (null == officeHolidayses || officeHolidayses.size() == 0) {    //非法定节假日
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            if (cal.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY || cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY) {
                //非法定节假日   周末  双休日的可用时间为:9：00-17:00
                Integer noTradeStartTime = Integer.valueOf(propertiesUtils.get("noTradeStartTime", "9"));
                Integer noTradeEndTime = Integer.valueOf(propertiesUtils.get("noTradeEndTime", "20"));
                if (hour < noTradeStartTime || hour >= noTradeEndTime) {
                    return ResultResponse.build(ResultCode.HBEC_001035.getCode(), ResultCode.HBEC_001035.getMemo());
                }
            } else {
                Integer tradeStartTime = Integer.valueOf(propertiesUtils.get("tradeStartTime", "9"));
                Integer tradeEndTime = Integer.valueOf(propertiesUtils.get("tradeEndTime", "17"));
                //非法定节假日   非周末	    交易日的可用时间为： 9:00-20:00
                if (hour < tradeStartTime || hour >= tradeEndTime) {
                    return ResultResponse.build(ResultCode.HBEC_001035.getCode(), ResultCode.HBEC_001035.getMemo());
                }
            }
        } else {    //法定假日
            return ResultResponse.build(ResultCode.HBEC_001035.getCode(), ResultCode.HBEC_001035.getMemo());
        }

        return ResultResponse.build(ResultCode.HBEC_001036.getCode(), ResultCode.HBEC_001036.getMemo());
    }

    /**
     * 查询客户是否关联经纪人如果关联，返回经纪人营业部，并再客户开户营业部页面默认选择该营业部
     * @params:@return
     * @params:@throws Exception
     * @author: xujianhua@touker.com
     * @datetime:2016-3-14 下午03:40:44
     */
    public ResultResponse getBranchInfo(String mobileNo) throws Exception {
        String branchNo = propertiesUtils.get("branchNo");    //默认营业部编号  上海自贸区营业部
        Map<String, String> resultMap = new HashMap<String, String>();

        CustomerServiceBranch bean = new CustomerServiceBranch();
        bean.setMobileno(mobileNo);
        bean.setChannel(Constants.MOBILEOPENACCOUNT_CHANNEL);

        List<CustomerServiceBranch> customerServiceBranches = customerServiceBranchService.queryByWhere(bean);
        //查询是否是经纪人推荐开户
        if (null != customerServiceBranches && customerServiceBranches.size() > 0) {//通过经纪人推荐开户
            //理论上跟经济人关联的记录的营业部不为空
            branchNo = customerServiceBranches.get(0).getBranchno();    //经济人营业部编号
        }
        String branchName = bBranchServiceImpl.getBranchName(branchNo);
        resultMap.put("branchNo", branchNo);
        resultMap.put("branchName", branchName);

        return ResultResponse.ok(resultMap);
    }

    public void bindServiceBranch(String mobileNo, String branchNo) throws Exception {
        String defaultbranchNo = propertiesUtils.get("branchNo");            //默认营业部编号
        logger.info("bindServiceBranch:mobileNo=" + mobileNo + " branchno=" + branchNo);

        CustomerServiceBranch customerServiceBranch = new CustomerServiceBranch();
        customerServiceBranch.setMobileno(mobileNo);
        customerServiceBranch.setSynclientidflg("0");
        customerServiceBranch.setSyncrmflg("0");

        List<CustomerServiceBranch> customerServiceBranches = customerServiceBranchService.queryByWhere(customerServiceBranch);
        if (customerServiceBranches == null || customerServiceBranches.size() == 0) {
            //如果上送过来的营业部为默认营业部（自贸区营业部）则需要平均分配
            if (defaultbranchNo.equals(branchNo)) {
                LinkedList<String> branchNoList = bBranchServiceImpl.getBranchNo();
                branchNo = branchNoList.peek();    //平均分配服务营业部
                branchNoList.remove(branchNo);
                branchNoList.add(branchNo);
            }
            customerServiceBranch.setChannel(Constants.QIANQIANSTOCK_CHANNEL);
            customerServiceBranch.setBranchno(branchNo);
            customerServiceBranch.setReqtime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            customerServiceBranch.setUpdatetime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            customerServiceBranchService.save(customerServiceBranch);
        } else {
            CustomerServiceBranch tmp = customerServiceBranches.get(0);
            String channel = tmp.getChannel();
            if (Constants.QIANQIANSTOCK_CHANNEL.equals(channel)) {        //如果是自行开户的需要更新服务营业部，推荐开户的不允许更新服务营业部
                tmp.setBranchno(branchNo);
                tmp.setUpdatetime(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));

                customerServiceBranchService.updateSelective(tmp);
            }
        }
    }

    public ResultResponse getPhoto(AcceptedMediaUrl bean) throws Exception {
        List<AcceptedMediaUrl> acceptedMediaUrls = acceptedMediaUrlService.queryByWhere(bean);
        AcceptedCertInfo queryBean = new AcceptedCertInfo();
        queryBean.setId(Long.valueOf(bean.getUserid()));
        AcceptedCertInfo acceptedCertInfo = acceptedCertInfoService.queryOneByWhere(queryBean);
        if (acceptedMediaUrls == null || acceptedMediaUrls.isEmpty() || acceptedCertInfo == null) {
            return ResultResponse.build(ResultCode.HBEC_001006.getCode(), null);
        } else {
            Map<String, Object> result = new HashMap<>();
            result.put("acceptedMediaUrls", acceptedMediaUrls);
            result.put("acceptedCertInfo", acceptedCertInfo);
            return ResultResponse.build(ResultCode.HBEC_000000.getCode(), null, result);
        }
    }

    public ResultResponse getCertInfo(AcceptedCertInfo bean) throws Exception {

        AcceptedCertInfo acceptedCertInfo = acceptedCertInfoService.queryOneByWhere(bean);

        if (acceptedCertInfo == null) {
            return ResultResponse.build(ResultCode.HBEC_001006.getCode(), null, ResultCode.HBEC_001006.getMemo());
        } else {
            ResultResponse resultResponse = toukerApiService.accountServiceFindByPhone(acceptedCertInfo.getMobileno());
            if (ResultCode.HBEC_000000.getCode().compareTo(resultResponse.getStatus()) == 0) {
                Account account = (Account) resultResponse.getData();
            }
            return ResultResponse.build(ResultCode.HBEC_000000.getCode(), null, acceptedCertInfo);
        }
    }

    public void getAgentByPhone(String phone) {

        ResultResponse resultResponse = toukerApiService.stockReferralFacadeFindByPhone(phone);

        if (ResultCode.HBEC_000000.getCode().compareTo(resultResponse.getStatus()) != 0) {
            logger.info("获取touker用户推荐经纪人信息异常,code:" + resultResponse.getStatus() + ";msg:" + resultResponse.getMsg());
            return;
        }

        Map<String, String> map = (Map<String, String>) resultResponse.getData();

        String agentId = map.get("refAgentId");//推荐经纪人ID
        String refYyb = map.get("refYyb");//推荐营业部

        if (StringUtils.isBlank(agentId) && StringUtils.isBlank(refYyb)) {
            logger.info("查询touker用户推荐经纪人信息为空,agentId:" + agentId + ";refYyb:" + refYyb);
            return;
        }

        Map<String, String> recommendBranchList = propertiesUtils.getMap("recommendBranchList");

        if (recommendBranchList.containsKey(refYyb)) {
            String yyb = recommendBranchList.get("refYyb");
            logger.info("touker用户推荐经纪人营业部,phone:" + phone + ";refYyb:" + refYyb + ",yyb:" + yyb);
            if (StringUtils.isNotBlank(yyb)) {
                CustomerServiceBranch bean = new CustomerServiceBranch();
                bean.setMobileno(phone);
                bean.setBranchno(yyb);
                bean.setRecommendbranchno(yyb);
                customerServiceBranchService.saveSelective(bean);
            }
        } else {
            promoterService.addPromoteCust(phone, agentId, null);
            promoterService.addCustServiceBranch(phone, agentId);
        }
    }

    /**
     * 修改用户营业部信息
     *
     * @param acceptedCertInfo     证书表用户信息
     * @param acceptedCustomerInfo 开户表用户信息
     * @param yyb                  营业部
     * @param mobileNo             手机号
     * @param opway                渠道
     * @return
     * @throws Exception
     */
    private Map<String, Object> updateBranchNo(AcceptedCertInfo acceptedCertInfo, AcceptedCustomerInfo acceptedCustomerInfo, String yyb, String mobileNo, Integer opway) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        AcceptedCommission queryAcceptedCommission = new AcceptedCommission();
        queryAcceptedCommission.setBranchNo(yyb);
        AcceptedCommission acceptedCommission = acceptedCommissionService.queryOneByWhere(queryAcceptedCommission);

        AcceptedCertInfo updateAcceptedCertInfo = new AcceptedCertInfo();
        updateAcceptedCertInfo.setBranchno(yyb);
        updateAcceptedCertInfo.setCommission(acceptedCommission.getCommission().doubleValue());
        updateAcceptedCertInfo.setMobileno(mobileNo);
        updateAcceptedCertInfo.setOpacctkindFlag(AcceptedCertInfo.State_0);
        updateAcceptedCertInfo.setAccessChannel(opway);
        updateAcceptedCertInfo.setState("0");
        updateAcceptedCertInfo.setCreatedate(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
        acceptedCertInfoService.updateByMoblieNoSelective(updateAcceptedCertInfo);

        if (acceptedCustomerInfo != null) {
            AcceptedCustomerInfo updateAcceptedCustomerInfo = new AcceptedCustomerInfo();
            updateAcceptedCertInfo.setBranchno(yyb);
            updateAcceptedCustomerInfo.setCommission(acceptedCommission.getCommission().toString());
            updateAcceptedCustomerInfo.setId(acceptedCustomerInfo.getId());
            updateAcceptedCustomerInfo.setCreatedate(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
            acceptedCustomerInfoService.updateSelective(updateAcceptedCustomerInfo);

            acceptedCustomerInfo.setBranchno(yyb);
            acceptedCustomerInfo.setCommission(acceptedCommission.getCommission().toString());
            resultMap.put("acceptedCustomerInfo", acceptedCustomerInfo);
        }

        acceptedCertInfo.setBranchno(yyb);
        acceptedCertInfo.setCommission(acceptedCommission.getCommission().doubleValue());
        resultMap.put("acceptedCertInfo", acceptedCertInfo);

        BBranch branchInfo = bBranchServiceImpl.getBranchInfo(yyb);
        resultMap.put("branchInfo", branchInfo);

        return resultMap;
    }

    /**
     * 设置用户开户营业部
     *
     * @param userId
     * @param idcardNo
     * @param mobileNo
     * @return
     * @throws Exception
     */
    public ResultResponse updateOpenAccBranchNo(Long userId, String idcardNo, String mobileNo) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        String yybDD = "";
        String yyb;
        ResultResponse resultResponse = esbApiService.queryCustomerInfoByDingDian(Constants.BSLX_ZJBH, idcardNo);
        if (ResultCode.HBEC_000000.getCode().compareTo(resultResponse.getStatus()) == 0) {
            Map<String, String> customrtInfo = (Map<String, String>) resultResponse.getData();
            yybDD = customrtInfo.get("yyb");
        }

        AcceptedCertInfo acceptedCertInfo = acceptedCertInfoService.queryById(userId);
        AcceptedCustomerInfo acceptedCustomerInfo = acceptedCustomerInfoService.queryOneByMoblie(mobileNo);

        String yybLocal = acceptedCertInfo.getBranchno();

        if (StringUtils.isBlank(yybLocal)) {
            yyb = propertiesUtils.get("branchNo");
        } else {
            if (yybLocal.equals(yybDD)) {
                resultResponse.setStatus(ResultCode.HBEC_000000.getCode());
                return resultResponse;
            }
            yyb = yybLocal;
        }

        if (StringUtils.isNotBlank(yybDD) && !yybDD.equals(yybLocal)) {
            yyb = yybDD;
        }

        AcceptedCommission queryAcceptedCommission = new AcceptedCommission();
        queryAcceptedCommission.setBranchNo(yyb);
        AcceptedCommission acceptedCommission = acceptedCommissionService.queryOneByWhere(queryAcceptedCommission);
        resultMap.put("acceptedCommission", acceptedCommission);
        BBranch branchInfo = bBranchServiceImpl.getBranchInfo(yyb);
        resultMap.put("branchInfo", branchInfo);

        AcceptedCertInfo updateAcceptedCertInfo = new AcceptedCertInfo();
        updateAcceptedCertInfo.setBranchno(yyb);
        updateAcceptedCertInfo.setCommission(acceptedCommission.getCommission().doubleValue());
        updateAcceptedCertInfo.setMobileno(mobileNo);
        updateAcceptedCertInfo.setCreatedate(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
        acceptedCertInfoService.updateByMoblieNoSelective(updateAcceptedCertInfo);

        if (acceptedCustomerInfo != null) {
            AcceptedCustomerInfo updateAcceptedCustomerInfo = new AcceptedCustomerInfo();
            updateAcceptedCertInfo.setBranchno(yyb);
            updateAcceptedCustomerInfo.setCommission(acceptedCommission.getCommission().toString());
            updateAcceptedCustomerInfo.setId(acceptedCustomerInfo.getId());
            updateAcceptedCustomerInfo.setCreatedate(DateUtils.convertDate("yyyy-MM-dd HH:mm:ss"));
            acceptedCustomerInfoService.updateSelective(updateAcceptedCustomerInfo);
        }

        resultResponse.setStatus(ResultCode.HBEC_000000.getCode());
        resultResponse.setData(resultMap);
        return resultResponse;
    }
}
