package com.app.sjkh.commons.vo;

import java.io.Serializable;

/**
 * @description: 签约绑卡信息
 * @version: 1.0
 * @modify:
 */
public class SignInfo implements Serializable {

    /**
     * 证件截止日期   2345    C   N
     */
    private String zjjzrq;
    /**
     * 证件地址 1462    C(200)  N
     */
    private String zjdz;
    /**
     * 职业代码 731 C   N
     */
    private String zydm;
    /**
     * 证件发证机关   2211    C   Y
     */
    private String zjfzjg;
	/**
	 * FID_LOGINID	登录用户ID	793	C(50)	Y	登录用户ID
	 */
	private String loginid;
	/**
	 * FID_LOGINPWD	登录用户密码	765	C(30)	Y	登录用户密码（简单加密）
	 */
	private String loginpwd;
	/**
	 * FID_JGBZ	个人标志	1776	N(12)	Y	0|个人;1|机构
	 */
	private String jgbz;
	/**
	 * FID_YYB	营业部	697	N(12)	Y	客户营业部
	 */
	private String yyb;
	/**
	 * FID_JYMM	交易密码	598	C(80)	Y	理财账户交易密码
	 */
	private String jymm;
	/**
	 * FID_ZJMM	资金密码	714	C(20)	Y	理财账户资金密码
	 */
	private String zjmm;
	/**
	 * 加密类型 FID_JMLX;
	 */
	private String jmlx;
	/**
	 * FID_MOBILE	联系人手机	1779	C(30)	Y	手机号
	 */
	private String mobile;
	/**
	 * FID_ZJLB	证件类别	713	N(12)	Y	证件类别
	 */
	private String zjlb;
	/**
	 * FID_KHXM	客户姓名	613	C(80)	Y	客户姓名或企业名称
	 */
	private String khxm;
	/**
	 * FID_QYBZ	签约标志	9353	N(12)	Y	协议签署标志 0|未签约;1|已签约
	 */
	private String qybz;
	/**
	 * FID_DH	联系人电话	532	C(50)	Y	联系电话
	 */
	private String dh;
	/**
	 * FID_QQ	QQ号	2217	C(50)	N	QQ号
	 */
	private String qq;
	/**
	 * FID_WX	微信账号	4250	C(50)	N	微信
	 */
	private String wx;
	/**
	 * FID_DZ	地址	550	C(100)	N	联系地址
	 */
	private String dz;
	/**
	 * FID_YZBM	邮政编码	702	C(6)	N	邮政编码
	 */
	private String yzbm;
	/**
	 * FID_EMAIL	EMAIL	552	C(80)	N	电子邮箱
	 */
	private String email;
	/**
	 * FID_XB	性别	1911	N(12)	Y	性别，1|男;2|女
	 */
	private Integer xb;
	/**
	 * FID_CSRQ	出生日期	1913	N(8)	N	出生日期yyyymmdd
	 */
	private String csrq;
	/**
	 * FID_HYZK	婚姻状况	2221	N(12)	N	婚姻状况，FLDM=HYZK
	 */
	private String hyzk;
	/**
	 * FID_XLDM	学历代码	689	N(12)	N	学历代码
	 */
	private Integer xldm;
	/**
	 * FID_GZDW	工作单位	2224	C(30)	N	单位名称
	 */
	private String gzdw;
	/**
	 * FID_PROVINCE	省份代码	836	N(12)	N	省份代码
	 */
	private String province;
	/**
	 * FID_CITY	城市	835	N(12)	N	城市代码
	 */
	private String city;
	/**
	 * FID_GJDM	国籍代码	576	N(16)	N	国籍代码
	 */
	private Integer gjdm;
	/**
	 * FID_MZDM	民族代码	2223	N(12)	N	民族代码
	 */
	private String mzdm;
	/**
	 * FID_KHJL	客户经理编号	607	N(16)	N	客户经理编号
	 */
	private String khjl;
	/**
	 * FID_WTFS	操作方式	680	N(12)	N	开户渠道
	 */
	private String wtfs;
	/**
	 * FID_YHDM	银行代码	692	C(4)	Y	银行代码
	 */
	private String yhdm;
	/**
	 * FID_YHZH	银行帐号	693	C(20)	Y	银行卡号
	 */
	private String yhzh;
	/**
	 * FID_YHMM	银行密码	9128	C(20)	N	银行卡密码
	 */
	private String yhmm;
	/**
	 * FID_XYLX	协议类型	2811	N(1)	N
	 */
	private String xylx;
	/**
	 * FID_XYBB	协议版本	2859	C(300)	N
	 */
	private String xybb;
	/**
	 * FID_XYMC	协议名称	2400	C(300)	N
	 */
	private String xymc;
	/**
	 * FID_WJBM	问卷编码	2201	C(10)	N	 调查表编码
	 */
	private String wjbm;
	/**
	 * FID_WJLZ	问卷栏组	9501	N(22)	N	 调查表栏组
	 */
	private String wjlz;
	/**
	 * FID_WJLM	问卷栏目	9502	C(500)	N	 调查表栏目（复数）,格式为栏目1|栏目2|…
	 */
	private String wjlm;
	/**
	 * FID_CSZ	评测答案串	531	C(500)	N	 调查表单元（复数）,格式为答案1|答案2|…
	 */
	private String csz;
	/**
	 * FID_DAFZ	答案分值	9503	C(500)	N	 调查表作答分值(复数)，格式为答题分值1|答题分值2|…
	 */
	private String dafz;
	/**
	 * FID_SCORE	总分	2208	N(4)	N	调查表分值
	 */
	private String score;
	/**
	 * FID_FXCSNL	风险承受能力	2229	N(12)	N	评级级别
	 */
	private String fxcsnl;
	/**
	 * FID_FLAG	同步标志	9020	N(12)	Y	 送‘1’表示同步到OTC，其他不同步
	 */
	private String flag;

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * FID_KHH	客户号	605	C(14)
	 */
	private String khh;
	/**
	 * FID_ZJZH	资金帐号	716	C(14)
	 */
	private String zjzh;
	/**
	 * FID_XM	姓名	690	C(32)
	 */
	private String xm;
	/**
	 * FID_QYLX	签约类型	3321	C
	 */
	private String qylx;
	/**
	 * FID_QYXYH	签约协议号	30558	C(32)
	 */
	private String qyxyh;
	/**
	 * FID_ZHLX	账户类型	3317	C
	 */
	private String zhlx;
	/**
	 * FID_YHKH	银行卡号	30505	C(30)
	 */
	private String yhkh;
	/**
	 * FID_TELNO	电话号码	30518	C(11)
	 */
	private String telno;
	/**
	 * FID_YHBM	银行编码	30504	C(8)
	 */
	private String yhbm;
	/**
	 * FID_QYRQ	签约日期	4141	N(8)
	 */
	private String qyrq;
	/**
	 * FID_ZJLX	证件类型	30507	N(12)
	 */
	private String zjlx;
	/**
	 * FID_ZJBH	证件编号	711	N(12)
	 */
	private String zjbh;
	/**
	 * FID_QYZT	签约状态	60071	N(12)
	 */
	private String qyzt;
	/**
	 * FID_QRYZBZ	强弱认证标识	30570	N(8)
	 */
	private String qryzbz;
	/**
	 * FID_ZKBZ	主卡标志	30571	N(8)
	 */
	private Integer zkbz;







    /**
     *机构代码
     */
    private String jgdm;

    /**
     *产品代码
     */
    private String cpdm;

    /**
     *阅读签约调用标志
     */
    private String ydbz;

    /**
     *摘要
     */
    private String zy;



	public String getJgdm() {
		return jgdm;
	}
	public void setJgdm(String jgdm) {
		this.jgdm = jgdm;
	}
	public String getCpdm() {
		return cpdm;
	}
	public void setCpdm(String cpdm) {
		this.cpdm = cpdm;
	}
	public String getYdbz() {
		return ydbz;
	}
	public void setYdbz(String ydbz) {
		this.ydbz = ydbz;
	}
	public String getZy() {
		return zy;
	}
	public void setZy(String zy) {
		this.zy = zy;
	}
	public String getKhh() {
		return khh;
	}
	public void setKhh(String khh) {
		this.khh = khh;
	}
	public String getZjzh() {
		return zjzh;
	}
	public void setZjzh(String zjzh) {
		this.zjzh = zjzh;
	}
	public String getXm() {
		return xm;
	}
	public void setXm(String xm) {
		this.xm = xm;
	}
	public String getQylx() {
		return qylx;
	}
	public void setQylx(String qylx) {
		this.qylx = qylx;
	}
	public String getQyxyh() {
		return qyxyh;
	}
	public void setQyxyh(String qyxyh) {
		this.qyxyh = qyxyh;
	}
	public String getZhlx() {
		return zhlx;
	}
	public void setZhlx(String zhlx) {
		this.zhlx = zhlx;
	}
	public String getYhkh() {
		return yhkh;
	}
	public void setYhkh(String yhkh) {
		this.yhkh = yhkh;
	}
	public String getTelno() {
		return telno;
	}
	public void setTelno(String telno) {
		this.telno = telno;
	}
	public String getYhbm() {
		return yhbm;
	}
	public void setYhbm(String yhbm) {
		this.yhbm = yhbm;
	}
	public String getQyrq() {
		return qyrq;
	}
	public void setQyrq(String qyrq) {
		this.qyrq = qyrq;
	}
	public String getZjlx() {
		return zjlx;
	}
	public void setZjlx(String zjlx) {
		this.zjlx = zjlx;
	}
	public String getZjbh() {
		return zjbh;
	}
	public void setZjbh(String zjbh) {
		this.zjbh = zjbh;
	}
	public String getQyzt() {
		return qyzt;
	}
	public void setQyzt(String qyzt) {
		this.qyzt = qyzt;
	}
	public String getQryzbz() {
		return qryzbz;
	}
	public void setQryzbz(String qryzbz) {
		this.qryzbz = qryzbz;
	}
	public Integer getZkbz() {
		return zkbz;
	}
	public void setZkbz(Integer zkbz) {
		this.zkbz = zkbz;
	}

	public String getLoginid() {
		return loginid;
	}
	public void setLoginid(String loginid) {
		this.loginid = loginid;
	}
	public String getLoginpwd() {
		return loginpwd;
	}
	public void setLoginpwd(String loginpwd) {
		this.loginpwd = loginpwd;
	}
	public String getJgbz() {
		return jgbz;
	}
	public void setJgbz(String jgbz) {
		this.jgbz = jgbz;
	}
	public String getYyb() {
		return yyb;
	}
	public void setYyb(String yyb) {
		this.yyb = yyb;
	}
	public String getJymm() {
		return jymm;
	}
	public void setJymm(String jymm) {
		this.jymm = jymm;
	}
	public String getZjmm() {
		return zjmm;
	}
	public void setZjmm(String zjmm) {
		this.zjmm = zjmm;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getZjlb() {
		return zjlb;
	}
	public void setZjlb(String zjlb) {
		this.zjlb = zjlb;
	}
	public String getKhxm() {
		return khxm;
	}
	public void setKhxm(String khxm) {
		this.khxm = khxm;
	}
	public String getQybz() {
		return qybz;
	}
	public void setQybz(String qybz) {
		this.qybz = qybz;
	}
	public String getDh() {
		return dh;
	}
	public void setDh(String dh) {
		this.dh = dh;
	}
	public String getQq() {
		return qq;
	}
	public void setQq(String qq) {
		this.qq = qq;
	}
	public String getWx() {
		return wx;
	}
	public void setWx(String wx) {
		this.wx = wx;
	}
	public String getDz() {
		return dz;
	}
	public void setDz(String dz) {
		this.dz = dz;
	}
	public String getYzbm() {
		return yzbm;
	}
	public void setYzbm(String yzbm) {
		this.yzbm = yzbm;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Integer getXb() {
		return xb;
	}
	public void setXb(Integer xb) {
		this.xb = xb;
	}
	public String getCsrq() {
		return csrq;
	}
	public void setCsrq(String csrq) {
		this.csrq = csrq;
	}
	public String getHyzk() {
		return hyzk;
	}
	public void setHyzk(String hyzk) {
		this.hyzk = hyzk;
	}
	public Integer getXldm() {
		return xldm;
	}
	public void setXldm(Integer xldm) {
		this.xldm = xldm;
	}
	public String getGzdw() {
		return gzdw;
	}
	public void setGzdw(String gzdw) {
		this.gzdw = gzdw;
	}
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public Integer getGjdm() {
		return gjdm;
	}
	public void setGjdm(Integer gjdm) {
		this.gjdm = gjdm;
	}
	public String getMzdm() {
		return mzdm;
	}
	public void setMzdm(String mzdm) {
		this.mzdm = mzdm;
	}
	public String getKhjl() {
		return khjl;
	}
	public void setKhjl(String khjl) {
		this.khjl = khjl;
	}
	public String getWtfs() {
		return wtfs;
	}
	public void setWtfs(String wtfs) {
		this.wtfs = wtfs;
	}
	public String getYhdm() {
		return yhdm;
	}
	public void setYhdm(String yhdm) {
		this.yhdm = yhdm;
	}
	public String getYhzh() {
		return yhzh;
	}
	public void setYhzh(String yhzh) {
		this.yhzh = yhzh;
	}
	public String getYhmm() {
		return yhmm;
	}
	public void setYhmm(String yhmm) {
		this.yhmm = yhmm;
	}
	public String getXylx() {
		return xylx;
	}
	public void setXylx(String xylx) {
		this.xylx = xylx;
	}
	public String getXybb() {
		return xybb;
	}
	public void setXybb(String xybb) {
		this.xybb = xybb;
	}
	public String getXymc() {
		return xymc;
	}
	public void setXymc(String xymc) {
		this.xymc = xymc;
	}
	public String getWjbm() {
		return wjbm;
	}
	public void setWjbm(String wjbm) {
		this.wjbm = wjbm;
	}
	public String getWjlz() {
		return wjlz;
	}
	public void setWjlz(String wjlz) {
		this.wjlz = wjlz;
	}
	public String getWjlm() {
		return wjlm;
	}
	public void setWjlm(String wjlm) {
		this.wjlm = wjlm;
	}
	public String getCsz() {
		return csz;
	}
	public void setCsz(String csz) {
		this.csz = csz;
	}
	public String getDafz() {
		return dafz;
	}
	public void setDafz(String dafz) {
		this.dafz = dafz;
	}
	public String getScore() {
		return score;
	}
	public void setScore(String score) {
		this.score = score;
	}
	public String getFxcsnl() {
		return fxcsnl;
	}
	public void setFxcsnl(String fxcsnl) {
		this.fxcsnl = fxcsnl;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public String getJmlx() {
		return jmlx;
	}
	public void setJmlx(String jmlx) {
		this.jmlx = jmlx;
	}
	public String getZjjzrq() {
        return zjjzrq;
    }
    public void setZjjzrq(String zjjzrq) {
        this.zjjzrq = zjjzrq;
    }
    public String getZjdz() {
        return zjdz;
    }
    public void setZjdz(String zjdz) {
        this.zjdz = zjdz;
    }
    public String getZydm() {
        return zydm;
    }
    public void setZydm(String zydm) {
        this.zydm = zydm;
    }
    public String getZjfzjg() {
        return zjfzjg;
    }
    public void setZjfzjg(String zjfzjg) {
        this.zjfzjg = zjfzjg;
    }
}
