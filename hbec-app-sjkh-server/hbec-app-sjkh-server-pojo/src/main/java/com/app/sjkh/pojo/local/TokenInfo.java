package com.app.sjkh.pojo.local;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by zhangweikang on 2016/8/3.
 */
@Table(name = "T_TOKEN_INFO")
public class TokenInfo implements Serializable {

	@Id
	//@Column(name = "TOKENSTR")
	public String tokenstr;

	@Column(name = "USERID")
	public String userId;

	//@Column(name = "CRE_TIME")
	public String creTime;

	public String getToukenstr() {
		return tokenstr;
	}

	public void setToukenstr(String toukenstr) {
		this.tokenstr = toukenstr;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getCreTime() {
		return creTime;
	}

	public void setCreTime(String creTime) {
		this.creTime = creTime;
	}

	@Override
	public String toString() {
		return "TokenInfo{" +
				"toukenstr='" + tokenstr + '\'' +
				", userId='" + userId + '\'' +
				", creTime='" + creTime + '\'' +
				'}';
	}
}
