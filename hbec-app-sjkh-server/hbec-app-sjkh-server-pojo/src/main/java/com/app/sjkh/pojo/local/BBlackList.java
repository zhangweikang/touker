package com.app.sjkh.pojo.local;

import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Table(name = "T_B_BLACKLIST")
public class BBlackList {
    @Id
    private Long id;

    private String idNo;

    private String idType;

    private String nameCn;

    private String nameEn;

    private String gender;

    private String nationality;

    private String blacklistType;

    private String blacklistInfo;

    private Date createTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdNo() {
        return idNo;
    }

    public void setIdNo(String idNo) {
        this.idNo = idNo == null ? null : idNo.trim();
    }

    public String getIdType() {
        return idType;
    }

    public void setIdType(String idType) {
        this.idType = idType == null ? null : idType.trim();
    }

    public String getNameCn() {
        return nameCn;
    }

    public void setNameCn(String nameCn) {
        this.nameCn = nameCn == null ? null : nameCn.trim();
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn == null ? null : nameEn.trim();
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender == null ? null : gender.trim();
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality == null ? null : nationality.trim();
    }

    public String getBlacklistType() {
        return blacklistType;
    }

    public void setBlacklistType(String blacklistType) {
        this.blacklistType = blacklistType == null ? null : blacklistType.trim();
    }

    public String getBlacklistInfo() {
        return blacklistInfo;
    }

    public void setBlacklistInfo(String blacklistInfo) {
        this.blacklistInfo = blacklistInfo == null ? null : blacklistInfo.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}