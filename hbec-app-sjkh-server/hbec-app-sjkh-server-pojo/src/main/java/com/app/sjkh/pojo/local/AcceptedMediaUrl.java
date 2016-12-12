package com.app.sjkh.pojo.local;

import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 用户影像资料表
 */
@Table(name = "T_ACCEPTED_MEDIA_URL")
public class AcceptedMediaUrl {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    @Id
    private String id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.USERID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String userid;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String mediaId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIAURL
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private Object mediaurl;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.IS_AGREE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String isAgree;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_DATE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String createDate;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_BY
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String createBy;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.UPDATE_DATE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String updateDate;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.TREADY_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String treadyId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNATRUE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String signatrue;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.TOSIGN
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private Object tosign;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.START_TIME
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String startTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.BRANCH_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String branchId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String srvId;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_NAME
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private Object srvName;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SYS_PATH
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String sysPath;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_DCSIGN
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String protocolDcsign;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.IMG_TYPE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String imgType;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNMSG
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String signmsg;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String mediaContent;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String protocolContent;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_MINI_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    private String mediaMiniContent;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNMSG
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNMSG
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getSignmsg() {
        return signmsg;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNMSG
     *
     * @param signmsg the value for OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNMSG
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setSignmsg(String signmsg) {
        this.signmsg = signmsg == null ? null : signmsg.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_CONTENT
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getMediaContent() {
        return mediaContent;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_CONTENT
     *
     * @param mediaContent the value for OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setMediaContent(String mediaContent) {
        this.mediaContent = mediaContent == null ? null : mediaContent.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_CONTENT
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getProtocolContent() {
        return protocolContent;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_CONTENT
     *
     * @param protocolContent the value for OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setProtocolContent(String protocolContent) {
        this.protocolContent = protocolContent == null ? null : protocolContent.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_MINI_CONTENT
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_MINI_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getMediaMiniContent() {
        return mediaMiniContent;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_MINI_CONTENT
     *
     * @param mediaMiniContent the value for OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_MINI_CONTENT
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setMediaMiniContent(String mediaMiniContent) {
        this.mediaMiniContent = mediaMiniContent == null ? null : mediaMiniContent.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.ID
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.ID
     *
     * @param id the value for OSOADATA.T_ACCEPTED_MEDIA_URL.ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.USERID
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.USERID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getUserid() {
        return userid;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.USERID
     *
     * @param userid the value for OSOADATA.T_ACCEPTED_MEDIA_URL.USERID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setUserid(String userid) {
        this.userid = userid == null ? null : userid.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_ID
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getMediaId() {
        return mediaId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_ID
     *
     * @param mediaId the value for OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIA_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setMediaId(String mediaId) {
        this.mediaId = mediaId == null ? null : mediaId.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIAURL
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIAURL
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public Object getMediaurl() {
        return mediaurl;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIAURL
     *
     * @param mediaurl the value for OSOADATA.T_ACCEPTED_MEDIA_URL.MEDIAURL
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setMediaurl(Object mediaurl) {
        this.mediaurl = mediaurl;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.IS_AGREE
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.IS_AGREE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getIsAgree() {
        return isAgree;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.IS_AGREE
     *
     * @param isAgree the value for OSOADATA.T_ACCEPTED_MEDIA_URL.IS_AGREE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setIsAgree(String isAgree) {
        this.isAgree = isAgree == null ? null : isAgree.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_DATE
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_DATE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getCreateDate() {
        return createDate;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_DATE
     *
     * @param createDate the value for OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_DATE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setCreateDate(String createDate) {
        this.createDate = createDate == null ? null : createDate.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_BY
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_BY
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getCreateBy() {
        return createBy;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_BY
     *
     * @param createBy the value for OSOADATA.T_ACCEPTED_MEDIA_URL.CREATE_BY
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setCreateBy(String createBy) {
        this.createBy = createBy == null ? null : createBy.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.UPDATE_DATE
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.UPDATE_DATE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getUpdateDate() {
        return updateDate;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.UPDATE_DATE
     *
     * @param updateDate the value for OSOADATA.T_ACCEPTED_MEDIA_URL.UPDATE_DATE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate == null ? null : updateDate.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.TREADY_ID
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.TREADY_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getTreadyId() {
        return treadyId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.TREADY_ID
     *
     * @param treadyId the value for OSOADATA.T_ACCEPTED_MEDIA_URL.TREADY_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setTreadyId(String treadyId) {
        this.treadyId = treadyId == null ? null : treadyId.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNATRUE
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNATRUE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getSignatrue() {
        return signatrue;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNATRUE
     *
     * @param signatrue the value for OSOADATA.T_ACCEPTED_MEDIA_URL.SIGNATRUE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setSignatrue(String signatrue) {
        this.signatrue = signatrue == null ? null : signatrue.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.TOSIGN
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.TOSIGN
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public Object getTosign() {
        return tosign;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.TOSIGN
     *
     * @param tosign the value for OSOADATA.T_ACCEPTED_MEDIA_URL.TOSIGN
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setTosign(Object tosign) {
        this.tosign = tosign;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.START_TIME
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.START_TIME
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getStartTime() {
        return startTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.START_TIME
     *
     * @param startTime the value for OSOADATA.T_ACCEPTED_MEDIA_URL.START_TIME
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime == null ? null : startTime.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.BRANCH_ID
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.BRANCH_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getBranchId() {
        return branchId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.BRANCH_ID
     *
     * @param branchId the value for OSOADATA.T_ACCEPTED_MEDIA_URL.BRANCH_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setBranchId(String branchId) {
        this.branchId = branchId == null ? null : branchId.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_ID
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getSrvId() {
        return srvId;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_ID
     *
     * @param srvId the value for OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_ID
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setSrvId(String srvId) {
        this.srvId = srvId == null ? null : srvId.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_NAME
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_NAME
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public Object getSrvName() {
        return srvName;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_NAME
     *
     * @param srvName the value for OSOADATA.T_ACCEPTED_MEDIA_URL.SRV_NAME
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setSrvName(Object srvName) {
        this.srvName = srvName;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SYS_PATH
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.SYS_PATH
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getSysPath() {
        return sysPath;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.SYS_PATH
     *
     * @param sysPath the value for OSOADATA.T_ACCEPTED_MEDIA_URL.SYS_PATH
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setSysPath(String sysPath) {
        this.sysPath = sysPath == null ? null : sysPath.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_DCSIGN
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_DCSIGN
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getProtocolDcsign() {
        return protocolDcsign;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_DCSIGN
     *
     * @param protocolDcsign the value for OSOADATA.T_ACCEPTED_MEDIA_URL.PROTOCOL_DCSIGN
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setProtocolDcsign(String protocolDcsign) {
        this.protocolDcsign = protocolDcsign == null ? null : protocolDcsign.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.IMG_TYPE
     *
     * @return the value of OSOADATA.T_ACCEPTED_MEDIA_URL.IMG_TYPE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public String getImgType() {
        return imgType;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column OSOADATA.T_ACCEPTED_MEDIA_URL.IMG_TYPE
     *
     * @param imgType the value for OSOADATA.T_ACCEPTED_MEDIA_URL.IMG_TYPE
     *
     * @mbggenerated Thu Sep 29 10:01:52 CST 2016
     */
    public void setImgType(String imgType) {
        this.imgType = imgType == null ? null : imgType.trim();
    }
}