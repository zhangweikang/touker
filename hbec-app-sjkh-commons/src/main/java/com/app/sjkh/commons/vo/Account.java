package com.app.sjkh.commons.vo;

/**
 * 用户注册基本信息
 *
 * @author chenbing
 *
 */
public class Account{

	private static final long serialVersionUID = 1L;
	/** id */
	private Long id;
	/** 客户号 */
	private String customerId;
	/** 手机号 */
	private Long phone;
	/** 是否绑定手机号 */
	private Boolean isPhoneBind;
	/** 邮箱 */
	private String email;
	/** 是否绑定邮箱 */
	private Boolean isEmailBind;

	private String nickname;
	/** 登录密码 */
	private String loginPas;
	/** 状态 */
	private Byte state;
	/** 身份证号 */
	private String idcardNo;
	/** 真实姓名 */
	private String realName;
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

	/** 证件上传状态 0:待上传,1:审核中,2:上传成功,3:审核失败 */
	private Integer certUploadState;
	/** 学历 */
	private String education;
	/** 职业 */
	private String profession;
	/** 邮编 */
	private String zipCode;
	/** 账户冻结状态 */
	private Byte freezeState;
	/**鉴权状态(1：登录 2：身份验证 3：数字证书 4：交易设置 5：三方存管)*/
	private Byte authState;
	/**是否老客户	 1:新客户 2:老客户*/
	private Byte isOld;
	/** 注册来源*/
	private String regSource;
	/** 创建时间 */
	private String createTime;
	/** 最近一次更新时间 */
	private String modifyTime;


	/**
	 * 个人中心 统计信息完整度
	 * 开户之后默认：20%
	 * 身份证上传：30%
	 * 学历：10%
	 * 职业：10%
	 * 电子邮箱：10%
	 * 联系地址：10%
	 * 邮政编码：10%
	 */
	private Integer infoIntegrity;
	private String bindPhone;
	/** 理财经纪人code */
	private String busiCode;
	/** 短信验证码 */
	private String smsCode;
	private String transPas;

	private String startDate;
	private String endDate;

	private String zjjzrq;
	private Integer age;
	private String cardValidity;

	public String getCardValidity() {
		return cardValidity;
	}

	public void setCardValidity(String cardValidity) {
		this.cardValidity = cardValidity;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getZjjzrq() {
		return zjjzrq;
	}

	public void setZjjzrq(String zjjzrq) {
		this.zjjzrq = zjjzrq;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getTransPas() {
		return transPas;
	}

	public void setTransPas(String transPas) {
		this.transPas = transPas;
	}

	public Boolean getEmailBind() {
		return isEmailBind;
	}

	public void setEmailBind(Boolean emailBind) {
		isEmailBind = emailBind;
	}

	public Boolean getPhoneBind() {
		return isPhoneBind;
	}

	public void setPhoneBind(Boolean phoneBind) {
		isPhoneBind = phoneBind;
	}

	public String getSmsCode() {
		return smsCode;
	}

	public void setSmsCode(String smsCode) {
		this.smsCode = smsCode;
	}

	public String getBusiCode() {
		return busiCode;
	}

	public void setBusiCode(String busiCode) {
		this.busiCode = busiCode;
	}

	public String getBindPhone() {
		return bindPhone;
	}

	public void setBindPhone(String bindPhone) {
		this.bindPhone = bindPhone;
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

	public Integer getInfoIntegrity() {
		return infoIntegrity;
	}

	public void setInfoIntegrity(Integer infoIntegrity) {
		this.infoIntegrity = infoIntegrity;
	}

	public Integer getCertUploadState() {
		return certUploadState;
	}

	public void setCertUploadState(Integer certUploadState) {
		this.certUploadState = certUploadState;
	}

	public String getEducation() {
		return education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public Byte getFreezeState() {
		return freezeState;
	}

	public void setFreezeState(Byte freezeState) {
		this.freezeState = freezeState;
	}

	public Boolean getIsPhoneBind() {
		return isPhoneBind;
	}

	public void setIsPhoneBind(Boolean isPhoneBind) {
		this.isPhoneBind = isPhoneBind;
	}

	public Boolean getIsEmailBind() {
		return isEmailBind;
	}

	public void setIsEmailBind(Boolean isEmailBind) {
		this.isEmailBind = isEmailBind;
	}

	public Byte getIsOld() {
		return isOld;
	}

	public void setIsOld(Byte isOld) {
		this.isOld = isOld;
	}
	public Byte getAuthState() {
		return authState;
	}

	public void setAuthState(Byte authState) {
		this.authState = authState;
	}

	public String getRegSource() {
		return regSource;
	}

	public void setRegSource(String regSource) {
		this.regSource = regSource;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}

	@Override
	public String toString() {
		return "Account [id=" + id + ", customerId=" + customerId + ", phone=" + phone + ", isPhoneBind=" + isPhoneBind
				+ ", email=" + email + ", isEmailBind=" + isEmailBind + ", nickname=" + nickname + ", loginPas="
				+ loginPas + ", state=" + state + ", idcardNo=" + idcardNo + ", realName=" + realName + ", address=" + address + ", qq=" + qq + ", weixin="
				+ weixin + ", signature=" + signature + ", headPicKey=" + headPicKey + ", riskLevel=" + riskLevel
				+ ", remark=" + remark + ", province=" + province + ", city=" + city + ", area=" + area
				+ ", certUploadState=" + certUploadState + ", education=" + education + ", profession=" + profession
				+ ", zipCode=" + zipCode + ", freezeState=" + freezeState + ", authState=" + authState + ", isOld="
				+ isOld + ", regSource=" + regSource +  ", infoIntegrity=" + infoIntegrity + ", bindPhone=" + bindPhone
				+ ", busiCode=" + busiCode + ", smsCode=" + smsCode + "]";
	}

}
