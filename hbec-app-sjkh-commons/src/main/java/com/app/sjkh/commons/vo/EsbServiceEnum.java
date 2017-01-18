package com.app.sjkh.commons.vo;

/**
 * Esb接口名称定义
 */
public enum EsbServiceEnum {


    /**
     * 客户服务人员设置
     **/
    KHFWRYSZ("esb.crm.khfwrysz", "客户服务人员设置"),

    //查询客户信息 add by xujh 20150908
    CXKHXX("esb.ygt.cxkhxx", "查询客户信息"),

    //客户交易密码验证
    KHJYMMYZ("esb.ygt.khgl.khjymmyz", "客户交易密码验证"),

    //更新客户信息 add by xujh 20150913
    KHXXXG("esb.ygt.khgl.khxxxg", "修改客户信息"),

    //查询三方存管
    CXYHZHXX("esb.ygt.cxyhzhxx", "查询三方存管"),

    //根据客户号查询资金账号
    CXZJZHXX("esb.ygt.cxzjzhxx", "查询资金账号"),

    //"提交用户影像信息
    FILEUPLOAD("esb.ygt.fileupload", "提交用户影像信息"),

    //客户基本档案维护
    KHJBDAWH("esb.ygt.khjbdawh", "客户基本档案维护"),

    //查询服务人员营业部
    CXFWRYYYB("esb.crm.cxfwryyyb", "查询服务人员营业部"),

    /**
     * 公民身份验证
     **/
    GMSFYZ("esb.ygt.khgl.gmsfyz", "公民身份验证"),
    /**
     * 查询公民身份验证申请表
     **/
    CXGMSFYZSQB("esb.ygt.khgl.cxgmsfyzsqb", "查询公民身份验证申请表"),


    CXRYXX("esb.crm.cxryxx", "查询人员信息"),

    //客户考核营业部设置
    KHKHYYBSZ("esb.crm.khkhyybsz", "客户考核营业部设置"),

    //理财签约信息查询
    LCQYXXCX("esb.zfpt.lcgl.lcqyxxcx","查询理财签约信息请求"),

    FILEDOWNLOAD("esb.ygt.filedownload","图片下载");


    /***********************************************************/
    /**=================功能定义===============================*/
    /***********************************************************/

    private String serviceId;
    private String description;

    private EsbServiceEnum(String serviceId, String description) {
        this.serviceId = serviceId;
        this.description = description;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String toString() {
        return "[" + serviceId + "][" + description + "]";
    }
}
