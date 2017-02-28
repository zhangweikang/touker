package com.app.sjkh.pojo.local;

import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "T_Customer_Service_Branch")
public class CustomerServiceBranch {
    @Id
    private String mobileno;

    private String clientId;

    private String channel;

    private String branchno;

    private String reqtime;

    private String updatetime;

    private String synclientidflg;

    private String syncrmflg;

    private String thirdpartychannel;

    private String recommendbranchno;

    public String getMobileno() {
        return mobileno;
    }

    public void setMobileno(String mobileno) {
        this.mobileno = mobileno == null ? null : mobileno.trim();
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId == null ? null : clientId.trim();
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel == null ? null : channel.trim();
    }

    public String getBranchno() {
        return branchno;
    }

    public void setBranchno(String branchno) {
        this.branchno = branchno == null ? null : branchno.trim();
    }

    public String getReqtime() {
        return reqtime;
    }

    public void setReqtime(String reqtime) {
        this.reqtime = reqtime == null ? null : reqtime.trim();
    }

    public String getUpdatetime() {
        return updatetime;
    }

    public void setUpdatetime(String updatetime) {
        this.updatetime = updatetime == null ? null : updatetime.trim();
    }

    public String getSynclientidflg() {
        return synclientidflg;
    }

    public void setSynclientidflg(String synclientidflg) {
        this.synclientidflg = synclientidflg == null ? null : synclientidflg.trim();
    }

    public String getSyncrmflg() {
        return syncrmflg;
    }

    public void setSyncrmflg(String syncrmflg) {
        this.syncrmflg = syncrmflg == null ? null : syncrmflg.trim();
    }

    public String getThirdpartychannel() {
        return thirdpartychannel;
    }

    public void setThirdpartychannel(String thirdpartychannel) {
        this.thirdpartychannel = thirdpartychannel == null ? null : thirdpartychannel.trim();
    }

    public String getRecommendbranchno() {
        return recommendbranchno;
    }

    public void setRecommendbranchno(String recommendbranchno) {
        this.recommendbranchno = recommendbranchno;
    }

    @Override
    public String toString() {
        return "CustomerServiceBranch{" +
                "mobileno='" + mobileno + '\'' +
                ", clientId='" + clientId + '\'' +
                ", channel='" + channel + '\'' +
                ", branchno='" + branchno + '\'' +
                ", reqtime='" + reqtime + '\'' +
                ", updatetime='" + updatetime + '\'' +
                ", synclientidflg='" + synclientidflg + '\'' +
                ", syncrmflg='" + syncrmflg + '\'' +
                ", thirdpartychannel='" + thirdpartychannel + '\'' +
                ", recommendbranchno='" + recommendbranchno + '\'' +
                '}';
    }
}