package com.app.sjkh.pojo.local;

import javax.persistence.Table;

@Table(name = "T_ACCEPTED_REJECTLOG")
public class AcceptedRejectLog {
    private Long id;

    private Long userid;

    private String fieldenname;

    private String fielddesc;

    private String rejfieldval;

    private String rejfieldtable;

    private String rejreason;

    private String rejdate;

    private String rejarea;

    private Long reviewersid;

    private Short rejserial;

    private String isfix;

    private String fixval;

    private String step;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getFieldenname() {
        return fieldenname;
    }

    public void setFieldenname(String fieldenname) {
        this.fieldenname = fieldenname == null ? null : fieldenname.trim();
    }

    public String getFielddesc() {
        return fielddesc;
    }

    public void setFielddesc(String fielddesc) {
        this.fielddesc = fielddesc == null ? null : fielddesc.trim();
    }

    public String getRejfieldval() {
        return rejfieldval;
    }

    public void setRejfieldval(String rejfieldval) {
        this.rejfieldval = rejfieldval == null ? null : rejfieldval.trim();
    }

    public String getRejfieldtable() {
        return rejfieldtable;
    }

    public void setRejfieldtable(String rejfieldtable) {
        this.rejfieldtable = rejfieldtable == null ? null : rejfieldtable.trim();
    }

    public String getRejreason() {
        return rejreason;
    }

    public void setRejreason(String rejreason) {
        this.rejreason = rejreason == null ? null : rejreason.trim();
    }

    public String getRejdate() {
        return rejdate;
    }

    public void setRejdate(String rejdate) {
        this.rejdate = rejdate == null ? null : rejdate.trim();
    }

    public String getRejarea() {
        return rejarea;
    }

    public void setRejarea(String rejarea) {
        this.rejarea = rejarea == null ? null : rejarea.trim();
    }

    public Long getReviewersid() {
        return reviewersid;
    }

    public void setReviewersid(Long reviewersid) {
        this.reviewersid = reviewersid;
    }

    public Short getRejserial() {
        return rejserial;
    }

    public void setRejserial(Short rejserial) {
        this.rejserial = rejserial;
    }

    public String getIsfix() {
        return isfix;
    }

    public void setIsfix(String isfix) {
        this.isfix = isfix == null ? null : isfix.trim();
    }

    public String getFixval() {
        return fixval;
    }

    public void setFixval(String fixval) {
        this.fixval = fixval == null ? null : fixval.trim();
    }

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step == null ? null : step.trim();
    }
}