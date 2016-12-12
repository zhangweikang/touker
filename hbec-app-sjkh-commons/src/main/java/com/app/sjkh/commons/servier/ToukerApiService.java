package com.app.sjkh.commons.servier;

import com.app.sjkh.commons.utils.EncryptionUtils;
import com.app.sjkh.commons.utils.JacksonUtil;
import com.app.sjkh.commons.utils.PropertiesUtils;
import com.app.sjkh.commons.vo.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * ToukerApi请求
 * Created by Administrator on 2016/12/1.
 */
@Service
public class ToukerApiService {

    private static final Log logger = LogFactory.getLog(ToukerApiService.class);

    @Autowired
    private ApiService apiService;

    @Autowired
    private PropertiesUtils propertiesUtils;

    private ObjectMapper MAPPER = new ObjectMapper();

    /**
     * 请求ToukerApi
     * 参数加密请求
     *
     * @param url
     * @param params
     * @return
     */
    public String sendApi(String url, Map<String, String> params) throws IOException {

        Set<Map.Entry<String, String>> paramSet = params.entrySet();
        StringBuilder sbuilder = new StringBuilder();
        if (paramSet != null && paramSet.size() > 0) {
            for (Map.Entry<String, String> entry : paramSet) {
                String key = entry.getKey();
                String val = entry.getValue();
                sbuilder.append(key + "=" + val + "&");
            }
        }
        String _url_params;
        _url_params = sbuilder.substring(0, sbuilder.length() - 1);
        String _appSign_ = EncryptionUtils.shaEncryption(_url_params);
        String _appCrypt_ = EncryptionUtils.encryptThreeDESECB(_url_params);
        params.clear();
        params.put("_appSign_", _appSign_);
        params.put("_appCrypt_", _appCrypt_);
        return apiService.doPost(url, params);
    }

    /**
     * 通用短信发送通道
     *
     * @param tplName      模板编号
     * @param mobileNumber 手机号码
     * @param tplParams    模板动态参数（格式：{"参数1":"参数值1","参数2":"参数值2","参数3":"参数值3"...}）
     * @return
     * @throws Exception
     */
    public String sendSmsApi(String tplName, String mobileNumber, String tplParams) throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("tplName", tplName);
        params.put("tplParams", tplParams);
        params.put("mobileNumber", mobileNumber);

        return sendApi(Constants.SMS_API, params);
    }

    /**
     * @describe: TODO(账户整合：注册投客网发送短信)
     * @params:@param mobileNumber
     * @params:@param code
     * @params:@return
     * @params:@throws Exception
     * @author: xujianhua@touker.com
     * @datetime:2015-10-27 上午10:19:26
     */
    public boolean sendSMSByMOBILE_REGIS_CODE(String mobileNumber, String code) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("vCode", code);

        String smsApi = sendSmsApi(Constants.MOBILE_REGIS_CODE, mobileNumber, JacksonUtil.toJSon(map));
        return sendSmsResult(smsApi);
    }


    /**
     * @describe: TODO(账户整合：手机开户发送短信)
     * @params:@param mobileNumber
     * @params:@param code
     * @params:@return
     * @params:@throws Exception
     * @author: xujianhua@touker.com
     * @datetime:2015-10-27 上午10:19:46
     */
    public boolean sendSMSByMOBILE_OPENACC_CODE(String mobileNumber, String code) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("vCode", code);

        String smsApi = sendSmsApi(Constants.MOBILE_OPENACC_CODE, mobileNumber, JacksonUtil.toJSon(map));
        return sendSmsResult(smsApi);
    }


    /**
     * 手机开户客户号开立后短信发送
     *
     * @param mobileNumber 手机号码
     * @param custName     客户名称
     * @param client_id    客户号
     * @param fund_account 资金账户
     * @return
     * @throws Exception
     */
    public boolean sendSMSByMOBILE_FUNDACC_RETMSG(String mobileNumber, String custName, String client_id, String fund_account) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("cusname", custName);
        map.put("cusno", client_id);
        map.put("fundaccno", fund_account);

        String smsApi = sendSmsApi(Constants.MOBILE_FUNDACC_RETMSG, mobileNumber, JacksonUtil.toJSon(map));
        return sendSmsResult(smsApi);
    }


    /**
     * 手机开户发送短信验证码
     *
     * @param mobileNumber
     * @param code
     * @return
     * @throws Exception
     */
    public boolean sendSMSByMOBILE_OPENACC_VALCODE(String mobileNumber, String code) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("vCode", code);

        String smsApi = sendSmsApi(Constants.MOBILE_OPENACC_VALCODE, mobileNumber, JacksonUtil.toJSon(map));
        return sendSmsResult(smsApi);
    }

    /**
     * 处理发送短信后的结果
     *
     * @param jsonResult
     * @return
     */
    private boolean sendSmsResult(String jsonResult) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(jsonResult);
        JsonNode result = jsonNode.get("result");
        int i = result.intValue();
        return i == 1 ? true : false;
    }

    /**
     * Api调用AccountService
     * <p/>
     * 根据手机号查询投客网用户信息
     *
     * @param mobileno
     * @return code:001011,未注册 code:001012,已注册;data:注册用户信息
     * @throws Exception
     */
    public ResultResponse accountServiceFindByPhone(String mobileno) throws Exception {
        Map<String, String> map = new HashMap<>();
        map.put("phone", mobileno);
        String response = sendApi(propertiesUtils.get("apiUrl") + "accountService.findByPhone", map);
        logger.info("【accountServiceFindByPhone-响应】" + response);
        JsonNode jsonNode = MAPPER.readTree(response).get("result");    //result:	1:成功    		 其他：失败
        if (Constants.ApiSuccess.equals(jsonNode.asText())) {        //调用成功
            JsonNode data = MAPPER.readTree(response).get("data");
            if (data.isNull()) {
                return ResultResponse.build(ResultCode.HBEC_001011.getCode(), ResultCode.HBEC_001011.getMemo());
            }
            return ResultResponse.build(ResultCode.HBEC_001012.getCode(), ResultCode.HBEC_001012.getMemo(), MAPPER.readValue(data.traverse(), Account.class));
        } else {
            logger.error("Api查询touker用户信息失败,phone = " + mobileno);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), "系统异常,请稍后重试");
        }
    }

    /**
     * 账户整合：组装注册投客网短信验证码内容
     *
     * @param smsCode
     * @return
     */
    public String getSmsRegiste(String smsCode) {
        String content = smsCode + "您正在注册“投客网”新会员，10分钟内有效。注册完成后，将继续开户操作。请确保之后的操作由您本人完成。客服热线4008209898";
        logger.error("调用短信发送：" + content);
        return content;
    }

    /**
     * 账户整合：组装手机开户短信验证码内容
     *
     * @param smsCode
     * @return
     */
    public String getSmsOpenAcc(String smsCode) {
        String content = smsCode + "10分钟内有效。验证通过后，将进行开户操作（若之前开户未完成，将继续之前的步骤进行）。请确保之后的操作由您本人完成，如有疑问详询4008209898";
        logger.error("调用短信发送：" + content);
        return content;
    }

    /**
     * 注册投客网
     *
     * @param mobileno
     * @param loginPass
     * @return 001013, 注册成功, data, 注册用户信息
     * 001014,注册失败
     * @throws Exception {"message":"","result":"1","data":
     *                   {"id":640179,"customerId":"","phone":15618800000,"email":"","nickname":"投客640179",
     *                   "loginPas":"CDEC0EEDDC133BEDC85695B947E45C29","state":0,"idcardNo":"","realName":"","createTime":null,
     *                   "modifyTime":null,"address":"","qq":0,"weixin":"","signature":"","headPicKey":"","riskLevel":0,"remark":"","province":"","city":"","area":"","transPas":""}}
     *                   {"result":"-2","data":null}		//接口调用失败
     */
    public ResultResponse accountServiceRegistService(String mobileno, String loginPass) throws Exception {
        Account regAccount = new Account();
        regAccount.setPhone(Long.parseLong(mobileno));
        regAccount.setLoginPas(loginPass);
        regAccount.setRegSource(Constants.MOBILE_KH);
        Map<String, String> map = new HashMap<String, String>();
        map.put("acc", JacksonUtil.toJSon(regAccount));

        String response = sendApi(propertiesUtils.get("apiUrl") + "accountService.registService", map);
        logger.info("手机号" + mobileno + "【注册投客网返回】:" + response);
        JsonNode jsonNode = MAPPER.readTree(response);
        JsonNode data = jsonNode.get("data");
        Account account = MAPPER.readValue(data.traverse(), Account.class);
        if (Constants.ApiSuccess.equals(jsonNode.get("result").textValue())) {
            return ResultResponse.build(ResultCode.HBEC_001013.getCode(), ResultCode.HBEC_001013.getMemo(), account);
        } else {
            return ResultResponse.build(ResultCode.HBEC_001014.getCode(), ResultCode.HBEC_001014.getMemo());
        }
    }

    /**
     * @param customerId
     * @return 001017, 已绑定三方支付
     * 001018,未绑定三方支付
     * 001003,系统异常
     * @throws Exception //未绑
     *                   {"message":"","result":"1","data":null}
     *                   已绑
     *                   {"message":"","result":"1","data":[{"yhzh":"","wjlm":"","xm":"","zjdz":"","score":"","qybz":"","jymm":"","cpdm":"","gjdm":0,"city":"","wx":"","wtfs":"",
     *                   "loginpwd":"","zhlx":"","province":"","zjjzrq":"","xb":0,"mzdm":"","yyb":"","zjlb":"","gzdw":"","xymc":"","fxcsnl":"","qylx":"1","zydm":"","yhbm":"01040000",
     *                   "zjbh":"440683198909071129","flag":"","xylx":"","email":"","wjlz":"","csz":"","zjlx":"1","jgdm":"","yhmm":"","mobile":"","yzbm":"","dz":"","qyrq":"20150910",
     *                   "telno":"18201729428","signingBankInfo":{"lsh":"","dbed":500000,"dzsm":"","dxyzbz":"0","drzced":0,"imageName":"zhongguo","khsmKs":"","code":"","yhbm":"01040000",
     *                   "dbzced":0,"dbzcedKs":0,"khsm":"","qrrzfs":"0","dred":2000000,"yhmc":"中国银行","zcdzsm":"","drzcedKs":0,"dredKs":0,"dbedKs":0},"zjmm":"","khjl":"","qyzt":"0",
     *                   "zy":"","zjfzjg":"","qyxyh":"201509100926221158","ydbz":"","dh":"","wjbm":"","qq":"","hyzk":"","jgbz":"","khh":"","khxm":"","jmlx":"","loginid":"","dafz":"",
     *                   "qryzbz":"","zjzh":"0100001211270601","xybb":"","zkbz":1,"yhdm":"","xldm":0,"yhkh":"6217860800000609905","csrq":""}]}
     */
    public ResultResponse queryAuthenticationInfoByDingDian(String customerId) {
        try {
            SignInfo signInfo = new SignInfo();
            signInfo.setKhh(customerId);
            Map<String, String> map = new HashMap<String, String>();
            map.put("bean", JacksonUtil.toJSon(signInfo));
            String response = sendApi(propertiesUtils.get("apiUrl") + "SigningPayService.queryAuthenticationInfoService", map);
            logger.info("查询三方支付信息返回" + response);
            JsonNode jsonNode = MAPPER.readTree(response);
            if (!Constants.ApiSuccess.equals(jsonNode.get("result"))) {
                return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
            }

            List<Map<String, String>> data = MAPPER.readValue(jsonNode.get("data").traverse(),
                    MAPPER.getTypeFactory().constructCollectionType(List.class, SignInfo.class));
            if (data.isEmpty()) {
                return ResultResponse.build(ResultCode.HBEC_001018.getCode(), ResultCode.HBEC_001018.getMemo());
            }
            return ResultResponse.build(ResultCode.HBEC_001017.getCode(), ResultCode.HBEC_001017.getMemo());
        } catch (Exception e) {
            logger.error("根据客户号顶点查询用户三方存管信息失败,customerId = " + customerId, e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * 根据toukerId查询客户信息
     *
     * @param toukerId
     * @return 000000, 成功;data,touker信息
     * 001003,失败
     * <p/>
     * {"message":"","result":"1","data":{"respCode":"000000","memo":"SYS_MAINTENANCE_ING","obj":{"id":50192,"customerId"
     * :"010000040223","phone":15000977489,"email":"877239287@qq.com","nickname":"整整","loginPas":"C0FEDFBE1CFCA741DCC8A341574C2
     * 166","state":2,"idcardNo":"430611198908031519","realName":"李行","createTime":"2014-12-03 11:33:59","modifyTime":"2015-12-
     * 10 17:39:01","address":"tjhgj","qq":0,"weixin":null,"signature":"世人不知有因果，因果何曾饶过谁","headPicKey":"head_pic_key_50192.jpg",
     * "riskLevel":3,"remark":null,"province":"上海","city":"黄浦区","area":"内环以内","certUploadState":2,"education":"4","profession":
     * "99","zipCode":"200231","transPas":null,"startDate":null,"endDate":null,"infoIntegrity":100}}
     */
    public ResultResponse accountFacadeFindAccountById(Long toukerId) {
        try {
            Map<String, String> map = new HashMap<String, String>();
            map.put("accountId", toukerId.toString());
            String response = sendApi(propertiesUtils.get("apiUrl") + "accountFacade.findAccountById", map);
            logger.info("查询投客用户信息返回：" + response);

            JsonNode jsonNode = MAPPER.readTree(response);

            if (Constants.ApiSuccess.equals(jsonNode.get("result"))) {
                return ResultResponse.ok(MAPPER.readValue(jsonNode.get("data").traverse(), Account.class));
            } else {
                return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
            }
        } catch (Exception e) {
            logger.error("Api查询touker用户信息失败,toukerId=" + toukerId, e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }

    /**
     * @throws Exception
     * @describe: TODO(获取身份证影像)
     * @params:@param category    目录
     * @params:@param key        accoutid+front/back
     * @params:@return
     * @author: xujianhua@touker.com
     * @datetime:2015-12-30 下午02:20:01
     */
    public ResultResponse uploadServiceGetFileBytes(String category, String key) {
        try {
            Map<String, String> map = new HashMap<>();
            map.put("category", category);
            map.put("key", key);
            map.put("width", "800");
            map.put("height", "600");
            String response = sendApi(propertiesUtils.get("apiUrl") + "uploadService.mobileAccImgUpload", map);

            JsonNode jsonNode = MAPPER.readTree(response);

            if (Constants.ApiSuccess.equals(jsonNode.get("result"))) {
                return ResultResponse.ok(jsonNode.get("data").asText());
            } else {
                return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
            }
        } catch (IOException e) {
            logger.error("Api获取touker上传身份证影像失败,category=" + category + ",key=" + key, e);
            return ResultResponse.build(ResultCode.HBEC_001003.getCode(), ResultCode.HBEC_001003.getMemo());
        }
    }
}
