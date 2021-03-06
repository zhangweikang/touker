package com.app.sjkh.pojo.local;

import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "T_PROCESS_LOG")
public class ProcessLog {
    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.ID
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    @Id
    private String id;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.FUNCTIONNO
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    private String functionno;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.TARGETSYSTEM
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    private String targetsystem;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.START_TIME
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    private String startTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.END_TIME
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    private String endTime;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.EXCEPTION_DES
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    private String exceptionDes;

    /**
     * This field was generated by MyBatis Generator.
     * This field corresponds to the database column HBEC_APPTOOLS.T_PROCESS_LOG.CREATEDATE
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    private String createdate;

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.ID
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.ID
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.ID
     *
     * @param id the value for HBEC_APPTOOLS.T_PROCESS_LOG.ID
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.FUNCTIONNO
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.FUNCTIONNO
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getFunctionno() {
        return functionno;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.FUNCTIONNO
     *
     * @param functionno the value for HBEC_APPTOOLS.T_PROCESS_LOG.FUNCTIONNO
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setFunctionno(String functionno) {
        this.functionno = functionno == null ? null : functionno.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.TARGETSYSTEM
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.TARGETSYSTEM
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getTargetsystem() {
        return targetsystem;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.TARGETSYSTEM
     *
     * @param targetsystem the value for HBEC_APPTOOLS.T_PROCESS_LOG.TARGETSYSTEM
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setTargetsystem(String targetsystem) {
        this.targetsystem = targetsystem == null ? null : targetsystem.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.START_TIME
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.START_TIME
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getStartTime() {
        return startTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.START_TIME
     *
     * @param startTime the value for HBEC_APPTOOLS.T_PROCESS_LOG.START_TIME
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime == null ? null : startTime.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.END_TIME
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.END_TIME
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getEndTime() {
        return endTime;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.END_TIME
     *
     * @param endTime the value for HBEC_APPTOOLS.T_PROCESS_LOG.END_TIME
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime == null ? null : endTime.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.EXCEPTION_DES
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.EXCEPTION_DES
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getExceptionDes() {
        return exceptionDes;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.EXCEPTION_DES
     *
     * @param exceptionDes the value for HBEC_APPTOOLS.T_PROCESS_LOG.EXCEPTION_DES
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setExceptionDes(String exceptionDes) {
        this.exceptionDes = exceptionDes == null ? null : exceptionDes.trim();
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method returns the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.CREATEDATE
     *
     * @return the value of HBEC_APPTOOLS.T_PROCESS_LOG.CREATEDATE
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public String getCreatedate() {
        return createdate;
    }

    /**
     * This method was generated by MyBatis Generator.
     * This method sets the value of the database column HBEC_APPTOOLS.T_PROCESS_LOG.CREATEDATE
     *
     * @param createdate the value for HBEC_APPTOOLS.T_PROCESS_LOG.CREATEDATE
     *
     * @mbggenerated Fri Aug 05 10:46:20 CST 2016
     */
    public void setCreatedate(String createdate) {
        this.createdate = createdate == null ? null : createdate.trim();
    }

    @Override
    public String toString() {
        return "ProcessLog{" +
                "id='" + id + '\'' +
                ", functionno='" + functionno + '\'' +
                ", targetsystem='" + targetsystem + '\'' +
                ", startTime='" + startTime + '\'' +
                ", endTime='" + endTime + '\'' +
                ", exceptionDes='" + exceptionDes + '\'' +
                ", createdate='" + createdate + '\'' +
                '}';
    }
}