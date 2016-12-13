package com.app.sjkh.pojo.local;

import javax.persistence.Table;
import java.math.BigDecimal;
@Table(name = "T_ACCEPTED_COMMISSION")
public class AcceptedCommission {
    private Long id;

    private String branchNo;

    private String sortNo;

    private BigDecimal commission;

    private Long orderLine;

    private String createBy;

    private String createDate;

    private String modifyBy;

    private String modifyDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBranchNo() {
        return branchNo;
    }

    public void setBranchNo(String branchNo) {
        this.branchNo = branchNo == null ? null : branchNo.trim();
    }

    public String getSortNo() {
        return sortNo;
    }

    public void setSortNo(String sortNo) {
        this.sortNo = sortNo == null ? null : sortNo.trim();
    }

    public BigDecimal getCommission() {
        return commission;
    }

    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    public Long getOrderLine() {
        return orderLine;
    }

    public void setOrderLine(Long orderLine) {
        this.orderLine = orderLine;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy == null ? null : createBy.trim();
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate == null ? null : createDate.trim();
    }

    public String getModifyBy() {
        return modifyBy;
    }

    public void setModifyBy(String modifyBy) {
        this.modifyBy = modifyBy == null ? null : modifyBy.trim();
    }

    public String getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(String modifyDate) {
        this.modifyDate = modifyDate == null ? null : modifyDate.trim();
    }
}