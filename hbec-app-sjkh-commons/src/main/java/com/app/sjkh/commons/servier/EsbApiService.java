package com.app.sjkh.commons.servier;

import com.apex.fix.JFixComm;
import com.app.sjkh.commons.utils.JacksonUtil;
import com.app.sjkh.commons.utils.PropertiesUtils;
import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.commons.vo.EsbServiceEnum;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sun.misc.BASE64Encoder;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyStoreException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/11/30.
 */
@Service
public class EsbApiService {

    private static final Log logger = LogFactory.getLog(EsbApiService.class);

    private ObjectMapper MAPPER = new ObjectMapper();

    //登陆ESB系统sessionId
    public static String sessionId;

    private boolean isLogin = false;

    private static Long lastLoginTime = 0l;

    private static Long timeOut = 3600000l;

    //业务请求 location
    private static String SERVER_FILEUPLOAD = "upload";
    private static String SERVER_SERVICE = "service";
    private static String SERVER_FILEDOWNLOAD = "download";

    @Autowired
    private PropertiesUtils propertiesUtils;

    @Autowired
    private ApiService apiService;

    private void esbLogin() {
        logger.info("进入ESB登陆方法,isLogin = " + isLogin);
        String loginUrl = getEsbUrl("login");
        Map<String, String> map = new HashMap<String, String>();
        map.put("loginId", propertiesUtils.get("loginId"));
        map.put("loginPwd", propertiesUtils.get("loginPwd"));
        try {
            String s1 = JacksonUtil.toJSon(map);
            logger.info("进入ESB登陆方法,s1 = " + s1);
            String s = apiService.doPostJson(loginUrl, s1);
            logger.info("进入ESB登陆方法,s = " + s);
            if (StringUtils.isNotBlank(s)) {
                HashMap<String, String> hashMap = JacksonUtil.readValue(s, new TypeReference<HashMap<String, String>>() {
                });
                if ("1".equals(hashMap.get("code"))) {
                    logger.info("ESB登陆成功");
                    isLogin = true;
                    sessionId = hashMap.get("sessionId").toString();
                    lastLoginTime = System.currentTimeMillis();
                    timeOut = Long.parseLong(hashMap.get("timeout"));
                }
            } else {
                logger.info("调用ESB登陆失败");
            }
        } catch (IOException e) {
            logger.error("调用ESB登陆失败", e);
        }
    }

    public String esbBusinessService(String serviceId, Map<String, String> map) throws IOException {
        String result;

        String serviceUrl = getEsbUrl(SERVER_SERVICE);
        //超时标志
        Boolean timeout = false;
        //登陆超时循环次数
        int loginCount = 0;
        do {
            vailLogin();

            map.put("serviceId", serviceId);
            map.put("sessionId", sessionId);

            result = apiService.doPostJson(serviceUrl, JacksonUtil.toJSon(map));

            timeout = resultTimeOut(result, timeout);
            loginCount++;
        } while (Boolean.TRUE.equals(timeout) && loginCount < 5);
        return result;
    }

    public String esbBusinessUploadFile(String fileName, String filePath, Map<String, String> map) throws IOException {
        String result;

        String serviceUrl = getEsbUrl(SERVER_FILEUPLOAD);
        //超时标志
        Boolean timeout = false;
        //登陆超时循环次数
        int loginCount = 0;
        do {
            vailLogin();

            map.put("filename", fileName);
            map.put("serviceId", EsbServiceEnum.FILEUPLOAD.getServiceId());
            map.put("sessionId", sessionId);
            map.putAll(initPublicParam());

            result = apiService.doPostUploadFile(serviceUrl, filePath, map);

            timeout = resultTimeOut(result, timeout);
            loginCount++;
        } while (Boolean.TRUE.equals(timeout) && loginCount < 5);
        return result;
    }

    public String esbBusinessUploadFile(String fileName, byte[] bytes, Map<String, String> map) throws IOException {
        String result;

        String serviceUrl = getEsbUrl(SERVER_FILEUPLOAD);
        //超时标志
        Boolean timeout = false;
        //登陆超时循环次数
        int loginCount = 0;
        do {
            vailLogin();

            map.put("serviceId", EsbServiceEnum.FILEUPLOAD.getServiceId());
            map.put("sessionId", sessionId);
            map.putAll(initPublicParam());

            result = apiService.doPostUploadFile(serviceUrl, bytes, fileName, map);

            timeout = resultTimeOut(result, timeout);
            loginCount++;
        } while (Boolean.TRUE.equals(timeout) && loginCount < 5);
        return result;
    }

    public void esbBusinessDownloadFile(Map<String, String> map) throws IOException, URISyntaxException, KeyStoreException {

        String serviceUrl = getEsbUrl(SERVER_FILEDOWNLOAD);
        //超时标志
        Boolean timeout = false;
        //登陆超时循环次数
        int loginCount = 0;
        do {
            vailLogin();

            map.put("serviceId", EsbServiceEnum.FILEDOWNLOAD.getServiceId());
            map.put("sessionId", sessionId);

            apiService.doPostDownloadFile(serviceUrl, JacksonUtil.toJSon(map));

            loginCount++;
        } while (Boolean.TRUE.equals(timeout) && loginCount < 5);
    }

    /**
     * 拼接Esb请求
     *
     * @param business(请求业务业务)
     * @return
     */
    public String getEsbUrl(String business) {
        StringBuffer sb = new StringBuffer();
        sb.append("https://");
        sb.append(propertiesUtils.get("esbUrl"));
        sb.append("/");
        sb.append(business);
        return sb.toString();
    }

    /**
     * 参数初始化
     *
     * @return
     */
    public Map<String, String> initPublicParam() {
        Map<String, String> map = new HashMap<String, String>();
        map.put("fqqd", Constants.CunGuan_fqqd);
        map.put("fqr", Constants.CunGuan_fqr);
        map.put("ywxt", Constants.CunGuan_ywxt);
        map.put("fqgydm", Constants.CunGuan_fqgydm);
        map.put("khfs", Constants.CunGuan_khfs);
        return map;
    }

    /**
     * 处理请求timeout,重新登陆
     *
     * @param result
     * @param timeout
     * @return
     */
    public Boolean resultTimeOut(String result, Boolean timeout) {
        if (StringUtils.isNotBlank(result)) {
            HashMap<String, Object> hashMap = JacksonUtil.readValue(result, new TypeReference<HashMap<String, Object>>() {
            });
            String timeOut = (String) hashMap.get("timeout");
            if (Boolean.TRUE.equals(timeOut)) {
                isLogin = false;
                esbLogin();
                timeout = true;
            } else {
                timeout = false;
            }
        }
        return timeout;
    }

    /**
     * 根据客户号到顶点查询用户三方存管绑卡信息
     *
     * @param customerId 客户号
     * @return 001003, 查询绑卡信息异常
     * 001015,已绑定三方存管
     * 001016,未绑定三方存管
     * //未绑三方存管
     * {"clzt":8,"code":1,"count":0,"duration":"178.62099ms","note":"银行账号信息查询成功！","records":[]}
     * 已绑三方存管
     * {"clzt":8,"code":1,"count":1,"duration":"248.33101ms","note":"银行账号信息查询成功！","records":[{"bz":"1","cgbz":"1","cgzdbz":"2","gtzjzh":"01000006167501",
     * "khrq":"20150730","yhcgzh":"6225220112487715","yhdm":"PFYH","yhdmmc":"浦发银行","yhzh":"01000006167501","ywxt":"1000","ywzh":"010000061675","zhlb":"1","zhzt":"0",
     * "zjzh":"0100000616750101","zzbs":"","zzhbz":"1"}]}
     */
    public ResultResponse queryBankInfoByDingDian(String customerId) {
        try {
            Map<String, String> params = new HashMap<String, String>();
            params.put("fqqd", Constants.CunGuan_fqqd);
            params.put("fqr", Constants.CunGuan_fqr);
            params.put("khh", customerId);
            String s = esbBusinessService(EsbServiceEnum.CXYHZHXX.getServiceId(), params);
            logger.info("查询三方存管返回：" + s);

            JsonNode jsonNode = MAPPER.readTree(s);
            if ("0".equals(jsonNode.get("count"))) {
                return ResultResponse.build(ResultCode.HBEC_001016.getCode(), ResultCode.HBEC_001016.getMemo());
            }

            List<Map<String, String>> data = MAPPER.readValue(
                    jsonNode.get("records").traverse(), MAPPER.getTypeFactory().constructCollectionType(List.class, Map.class));
            for (int i = 0; i < data.size(); i++) {
                String cgzdbz = data.get(i).get("cgzdbz");
                if (!Constants.CunGuan_cgzdbz_wzd.equals(cgzdbz)) {
                    //cgzdbz 未指定 = "0" 预指定 = "1"  已指定 = "2"
                    return ResultResponse.build(ResultCode.HBEC_001015.getCode(), ResultCode.HBEC_001015.getMemo());
                }
            }
            return ResultResponse.build(ResultCode.HBEC_001016.getCode(), ResultCode.HBEC_001016.getMemo());
        } catch (Exception e) {
            logger.error("客户号顶点查询用户三方存管绑卡信息失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     *
     * @param bslx 查询标示
     * @param srbs 标示值
     * @return 000000, 成功;data,用户信息
     * 001003,系统异常
     * 001006,结果为空
     * {"clzt":8,"code":1,"count":1,"duration":"10.75ms","note":"查询成功","records":[{"csrq":"19881001","cz":"","dh":"110","dwdh":"",
     * "dwdz":"","dwyb":"","dz":"地球－中国","email":"","fxcsnl":"1","fxjb":"","gj":"156","hyzk":"","jg":"","jgbz":"0","jtdh":"","jtdz":"","jtyb":"",
     * "khh":"010000061675","khjc":"XXX","khlb":"0","khmc":"XXX","khqz":"","khrq":"20150615","khzt":"0","mzdm":"1","sj":"13800138000","srbs":"010000061675",
     * "wtfs":"1;4;6;7;10","xb":"1","xl":"3","ymth":"","yyb":"100","yybbm":"0100","yybmc":"上海营业部","yzbm":"200000","zjbh":"888888888888888888","zjdz":"地球－中国",
     * "zjdzyb":"","zjfzjg":"","zjjzrq":"30001231","zjlb":"0","zjqsrq":"20150615","zydm":"99"}]}
     */
    public ResultResponse queryCustomerInfoByDingDian(String bslx,String srbs) {
        try {
            Map<String, String> params = new HashMap<String, String>();
            params.put("bslx", bslx);
            params.put("fqqd", Constants.QuickBind_fqqd);
            params.put("srbs", srbs);
            String json = esbBusinessService(EsbServiceEnum.CXKHXX.getServiceId(), params);
            logger.info("CXKHXX返回" + json);
            JsonNode jsonNode = MAPPER.readTree(json);

            List<Map<String, String>> data = MAPPER.readValue(
                    jsonNode.get("records").traverse(), MAPPER.getTypeFactory().constructCollectionType(List.class, Map.class));

            return data.size() == 0 ? ResultResponse.build(ResultCode.HBEC_001006.getCode(), ResultCode.HBEC_001006.getMemo()) : ResultResponse.ok(data.get(0));
        } catch (Exception e) {
            logger.error("顶点查询用户信息失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * 交易密码校验
     *
     * @param customerId
     * @param password
     * @param ip
     * @return 001027, 验证通过
     * 001028,验证失败
     * 客户交易密码验证{"clzt":0,"code":1,"count":0,"duration":"84.529ms","note":"密码效验通过"}
     * 接口[esb.ygt.khgl.khjymmyz][客户资金密码验证]调用失败:资金密码有误
     */
    public ResultResponse vaildataTradePwd(String customerId, String password, String ip) {
        try {
            Map<String, String> params = new HashMap<String, String>();
            params.put("fqqd", Constants.CunGuan_fqqd);
            params.put("fqr", Constants.CunGuan_fqr);
            params.put("jmlx", Constants.CunGuan_jmlx);
            params.put("czzd", ip);
            params.put("khh", customerId);
            params.put("ymm", JFixComm.encrptPwd(password));
            String json = esbBusinessService(EsbServiceEnum.KHJYMMYZ.getServiceId(), params);
            logger.info("validatePwd方法返回" + json);
            return ResultResponse.build(ResultCode.HBEC_001027.getCode(), ResultCode.HBEC_001027.getMemo(), json);
        } catch (Exception e) {
            logger.error("交易密码验证失败", e);
            return ResultResponse.build(ResultCode.HBEC_001028.getCode(), ResultCode.HBEC_001028.getMemo());
        }
    }

    /**
     * 根据经纪人id查询经纪人信息
     * {"code":1,"count":1,"duration":"269.69403ms","note":"成功","records":[{"ID":110,"JJRXM":"姜红军","YYB":500,"YYBMC":"华宝证券北京分公司"}],"total":1}
     * {"code":1,"count":0,"duration":"121.274ms","note":"成功","records":[],"total":0}
     *
     * @param jjrId
     * @return 000000, 成功;data,顶点营业部数据
     * 001003,系统异常
     */
    public ResultResponse cxfwryyyb(String jjrId) {
        String referbranchno = "0";
        try {
            Map<String, String> map = new HashMap<String, String>();
            map.put("JJR", jjrId);
            String result = esbBusinessService(EsbServiceEnum.CXFWRYYYB.getServiceId(), map);

            JsonNode jsonNode = MAPPER.readTree(result);
            int total = jsonNode.get("total").intValue();
            if (total > 0) {
                jsonNode.get("records");
                List<Map<String, String>> records = MAPPER.readValue(
                        jsonNode.get("records").traverse(), MAPPER.getTypeFactory().constructCollectionType(List.class, Map.class));

                Map<String, String> stringStringMap = records.get(0);
                referbranchno = stringStringMap.get("YYB");
            }
            return ResultResponse.ok(referbranchno);
        } catch (Exception e) {
            logger.error("查询经纪人信息失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * 查询顶点三方支付绑卡信息
     * @param customerId
     * @return
     * 001018,未绑定三方支付
     * 001017,已绑定三方支付;obj:List<Map<String, String>>
     * 001003,系统异常
     */
    public ResultResponse queryQuickBankCard (String customerId){
        try {
            Map<String, String> params = new HashMap<String, String>();
            params.put("pay_channel_id", Constants.CunGuan_ywxt);
            params.put("pay_sign_status", Constants.QuickBind_bslx);
            params.put("pay_cust_num", customerId);
            String s = esbBusinessService(EsbServiceEnum.LCQYXXCX.getServiceId(), params);
            logger.info("查询三方支付返回：" + s);

            JsonNode jsonNode = MAPPER.readTree(s);
            if ("0".equals(jsonNode.get("count")) || "-1".equals(jsonNode.get("code"))) {
                return ResultResponse.build(ResultCode.HBEC_001018.getCode(), ResultCode.HBEC_001018.getMemo());
            }

            List<Map<String, String>> data = MAPPER.readValue(
                    jsonNode.get("records").traverse(), MAPPER.getTypeFactory().constructCollectionType(List.class, Map.class));
            return ResultResponse.build(ResultCode.HBEC_001017.getCode(), ResultCode.HBEC_001017.getMemo(),data);
        } catch (Exception e) {
            logger.error("客户号顶点查询用户三方支付绑卡信息失败", e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * 校验ESB登陆,超时重新登陆
     */
    private synchronized void vailLogin() {
        long thisTime = System.currentTimeMillis();
        if (!isLogin) {
            esbLogin();
        } else if (thisTime - lastLoginTime >= timeOut * 4L / 5L) {
            esbLogin();
        }
    }
}
