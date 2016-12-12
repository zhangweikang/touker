package com.app.sjkh.pojo;
import java.util.Date;

/**
 * 用户注册基本信息
 *
 * @author chenbing
 *
 */
public class RequestAccount {

	/** id */
	private Long id;
	/** 客户号 */
	private String customerId;
	/** 手机号 */
	private Long phone;
	/** 邮箱 */
	private String email;

	private String nickname;
	/** 登录密码 */
	private String loginPas;
	/** 状态 */
	private Byte state;
	/** 身份证号 */
	private String idcardNo;
	/** 真实姓名 */
	private String realName;
	/** 创建时间 */
	private Date createTime;
	/** 最近一次更新时间 */
	private Date modifyTime;
	/** 地址 */
	private String address;
	/** QQ */
	private Long qq;
	/** 微信 */
	private String weixin;
	/** 签名 */
	private String signature;
	/** 用户头像唯一标示 */
	private String headPicKey;
	/** 风险承受等级 */
	private Byte riskLevel;
	/** 备注 */
	private String remark;

	private String province;

	private String city;

	private String area;
	/** 客户交易密码 非持久化字段，用于业务操作 */
	private String transPas;

	private String regSource;

	public String getRegSource() {
		return regSource;
	}

	public void setRegSource(String regSource) {
		this.regSource = regSource;
	}

	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * @return the customerId
	 */
	public String getCustomerId() {
		return customerId;
	}

	/**
	 * @param customerId
	 *            the customerId to set
	 */
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	/**
	 * @return the phone
	 */
	public Long getPhone() {
		return phone;
	}

	/**
	 * @param phone
	 *            the phone to set
	 */
	public void setPhone(Long phone) {
		this.phone = phone;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email
	 *            the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the nickname
	 */
	public String getNickname() {
		return nickname;
	}

	/**
	 * @param nickname
	 *            the nickname to set
	 */
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	/**
	 * @return the loginPas
	 */
	public String getLoginPas() {
		return loginPas;
	}

	/**
	 * @param loginPas
	 *            the loginPas to set
	 */
	public void setLoginPas(String loginPas) {
		this.loginPas = loginPas;
	}

	/**
	 * @return the state
	 */
	public Byte getState() {
		return state;
	}

	/**
	 * @param state
	 *            the state to set
	 */
	public void setState(Byte state) {
		this.state = state;
	}

	/**
	 * @return the idcardNo
	 */
	public String getIdcardNo() {
		return idcardNo;
	}

	/**
	 * @param idcardNo
	 *            the idcardNo to set
	 */
	public void setIdcardNo(String idcardNo) {
		this.idcardNo = idcardNo;
	}

	/**
	 * @return the realName
	 */
	public String getRealName() {
		return realName;
	}

	/**
	 * @param realName
	 *            the realName to set
	 */
	public void setRealName(String realName) {
		this.realName = realName;
	}

	/**
	 * @return the createTime
	 */
	public Date getCreateTime() {
		return createTime;
	}

	/**
	 * @param createTime
	 *            the createTime to set
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	/**
	 * @return the modifiyTime
	 */
	public Date getModifyTime() {
		return modifyTime;
	}

	/**
	 * @param
	 */
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	/**
	 * @return the address
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * @param address
	 *            the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}

	/**
	 * @return the qq
	 */
	public Long getQq() {
		return qq;
	}

	/**
	 * @param qq
	 *            the qq to set
	 */
	public void setQq(Long qq) {
		this.qq = qq;
	}

	/**
	 * @return the weixin
	 */
	public String getWeixin() {
		return weixin;
	}

	/**
	 * @param weixin
	 *            the weixin to set
	 */
	public void setWeixin(String weixin) {
		this.weixin = weixin;
	}

	/**
	 * @return the signature
	 */
	public String getSignature() {
		return signature;
	}

	/**
	 * @param signature
	 *            the signature to set
	 */
	public void setSignature(String signature) {
		this.signature = signature;
	}

	/**
	 * @return the headPicKey
	 */
	public String getHeadPicKey() {
		return headPicKey;
	}

	/**
	 * @param headPicKey
	 *            the headPicKey to set
	 */
	public void setHeadPicKey(String headPicKey) {
		this.headPicKey = headPicKey;
	}

	/**
	 * @return the riskLevel
	 */
	public Byte getRiskLevel() {
		return riskLevel;
	}

	/**
	 * @param riskLevel
	 *            the riskLevel to set
	 */
	public void setRiskLevel(Byte riskLevel) {
		this.riskLevel = riskLevel;
	}

	/**
	 * @return the transPas
	 */
	public String getTransPas() {
		return transPas;
	}

	/**
	 * @param transPas
	 *            the transPas to set
	 */
	public void setTransPas(String transPas) {
		this.transPas = transPas;
	}

	/**
	 * @return the remark
	 */
	public String getRemark() {
		return remark;
	}

	/**
	 * @param remark
	 *            the remark to set
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}

	/**
	 * @return the province
	 */
	public String getProvince() {
		return province;
	}

	/**
	 * @param province the province to set
	 */
	public void setProvince(String province) {
		this.province = province;
	}

	/**
	 * @return the city
	 */
	public String getCity() {
		return city;
	}

	/**
	 * @param city the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}

	/**
	 * @return the area
	 */
	public String getArea() {
		return area;
	}

	/**
	 * @param area the area to set
	 */
	public void setArea(String area) {
		this.area = area;
	}

}
