package com.app.sjkh.esb.pojo;

/**
 * Created by Administrator on 2017/3/8.
 */
public class Constants {
    /** redis公用前缀标示,esb */
    public static final String REDIS_KEY_ESB_PLAMFORM = "esb_plamform/";

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
}
