package com.app.sjkh.commons.vo;

/**
 * 全局变量定义
 * Created by zhangweikang on 2016/8/17.
 */
public class Constants {

	/** touker注册渠道 */
	public static final String MOBILE_KH = "MOBILE_KH";
	/** Api调用成功标示 */
	public static final String ApiSuccess = "1";
	/** 手机开户,投客注册短信模板 */
	public static final String RegisterTemplete = "mobile_regis_code";
	/** 手机开户,投客已注册短信登录模板 */
	public static final String AccountLoginTemplete = "mobile_openacc_code";
	/** 短信锁定时间 */
	public static final String SmsLockTime = "sms_lock_time";
	/** 最大短信发送次数 */
	public static final String MaxSmsNum = "max_sms_num";
	/** 短信失效时间 */
	public static final String SmsLimitRecycle = "sms_limit_recycle";
	/** 时间格式化yyyy-MM-dd HH:mm:ss */
	public static final String FormateDate = "yyyy-MM-dd HH:mm:ss";
	/** 时间格式化yyyyMMdd */
	public static final String FormateDate_yyyyMMdd = "yyyyMMdd";
	/** 时间格式化yyyyMMddHHmmss */
	public static final String FormateDate_yyyyMMddHHmmss = "yyyyMMddHHmmss";
	/** 时间格式化yyyyMMdd HH:mm:ss */
	public static final String FormateDate_yyyyMMddHHmmss_1 = "yyyyMMdd HH:mm:ss";
	/** 一柜通信息查询,默认参数,fqqd(发起渠道),2-客户自助 */
	public static final String CunGuan_fqqd = "2";
	/** 一柜通信息查询,默认参数,fqr(发起人) */
	public static final String CunGuan_fqr = "90016102";
	/** 一柜通信息查询,默认参数,jmlx(加密类型,0-简单加密 1-标准加密 2-明码 3-AES加密) */
	public static final String CunGuan_jmlx = "3";
	/** 一柜通信息查询,默认参数,存管账户信息,未指定 = "0" 预指定 = "1"  已指定 = "2" */
	public static final String CunGuan_cgzdbz_wzd = "0";
	/** 一柜通信息查询,默认参数 */
	public static final String CunGuan_ywxt = "1000";
	/** 一柜通信息查询,默认参数 */
	public static final String CunGuan_fqgydm = "90016102";
	/** 一柜通信息查询,默认参数 */
	public static final String CunGuan_khfs = "3";
	/** 三方支付,默认参数,bslx(标示类型) "0"-客户号 */
	public static final String QuickBind_bslx = "0";
	/** 三方支付,默认参数,fqqd(发起渠道)  2-客户自助 */
	public static final String QuickBind_fqqd = "2";
	/** 证件起始日期,默认值 */
	public static final String IdbeginDate = "19000101";
	//短信验证码发送时间间隔(秒)
	public static final int SMSCODESEND_TIME = 120;
	//短信验证码存储时间(秒)
	public static final int SMSCODESAVE_TIME = 1800;
	//短信验证码长度
	public static final int CODELENGTH = 6;
	/** 身份证照片在分布式文件系统的标示 */
	public static final String CERT_PIC_ROOT_PATH = "images";
	/** 身份证照片正面 */
	public static final String CERT_PIC_FRONT = "front";
	/** 身份证照片反面 */
	public static final String CERT_PIC_BACK = "back";
	/** 身份证缩放宽度 */
	public static final int ID_IMG_WIDTH = 800;
	/** 身份证缩放高度 */
	public static final int ID_IMG_HEIGHT = 600;
	/** 身份证图片在数据库中的路径 */
	public static final String IMG_MEDIAPATH = "/webUpload/takePhoto/";
	/** 手机开户渠道 */
	public static final String MOBILEOPENACCOUNT_CHANNEL = "0";
	/** 钱钱炒股渠道 */
	public static final String QIANQIANSTOCK_CHANNEL = "1";
	/** 证券开户app下载地址 */
	public static final String MOBILEOPENACCOUNT_APP_URL = "http://static.touker.com/m/open.htm";
	/** 钱钱炒股app下载地址 */
	public static final String QIANQIANSTOCK_APP_URL = "https://static.touker.com/m/stock.htm";
	/** 短信apiUrl(生产) */
	public static final String SMS_API = "http://api.touker.com/smsService.mobileSmsService";

	/**手机开户客户成功后发送短信模板*/
	public static final String MOBILE_FUNDACC_RETMSG = "mobile_fundacc_retmsg";
	/**手机开户验证码*/
	public static final String MOBILE_OPENACC_VALCODE = "mobile_openacc_valcode";
	/**账户整合：用户注册投客网短信模板（手机开户）*/
	public static final String MOBILE_REGIS_CODE = "mobile_regis_code";
	/**账户整合：股票开户短信模板（手机开户）*/
	public static final String MOBILE_OPENACC_CODE = "mobile_openacc_code";

	/** 字符编码集 */
	public static final String CODECHAR = "UTF-8";
}
