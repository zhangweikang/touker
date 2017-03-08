package com.app.sjkh.esb.pojo;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

/**
 * 请求响应结构
 */
public class ResultResponse {

    // 定义jackson对象
    private static final ObjectMapper MAPPER = new ObjectMapper();

    // 响应业务状态
    private String status;

    // 响应消息
    private String msg;

    // 响应中的数据
    private Object data;

    public static ResultResponse build(String status, String msg, Object data) {
        return new ResultResponse(status, msg, data);
    }

    public static ResultResponse ok(Object data) {
        return new ResultResponse(data);
    }

    public static ResultResponse ok() {
        return new ResultResponse(null);
    }

    public ResultResponse() {

    }

    public static ResultResponse build(String status, String msg) {
        return new ResultResponse(status, msg, null);
    }

    public ResultResponse(String status, String msg, Object data) {
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    public ResultResponse(Object data) {
        this.status = ResultCode.HBEC_000000.getCode();
        this.msg = "OK";
        this.data = data;
    }

//    public Boolean isOK() {
//        return this.status == 200;
//    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    /**
     * 将json结果集转化为ResultResponse对象
     *
     * @param jsonData json数据
     * @param clazz ResultResponse中的object类型
     * @return
     */
    public static ResultResponse formatToPojo(String jsonData, Class<?> clazz) throws JsonMappingException {
        try {
            if (clazz == null) {
                return MAPPER.readValue(jsonData, ResultResponse.class);
            }
            JsonNode jsonNode = MAPPER.readTree(jsonData);
            JsonNode data = jsonNode.get("data");
            Object obj = null;
            if (clazz != null) {
                if (data.isObject()) {
                    obj = MAPPER.readValue(data.traverse(), clazz);
                } else if (data.isTextual()) {
                    obj = MAPPER.readValue(data.asText(), clazz);
                }
            }
            return build(jsonNode.get("status").textValue(), jsonNode.get("msg").asText(), obj);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 没有object对象的转化
     *
     * @param json
     * @return
     */
    public static ResultResponse format(String json) {
        try {
            return MAPPER.readValue(json, ResultResponse.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Object是集合转化
     *
     * @param jsonData json数据
     * @param clazz 集合中的类型
     * @return
     */
    public static ResultResponse formatToList(String jsonData, Class<?> clazz) {
        try {
            JsonNode jsonNode = MAPPER.readTree(jsonData);
            JsonNode data = jsonNode.get("data");
            Object obj = null;
            if (data.isArray() && data.size() > 0) {
                obj = MAPPER.readValue(data.traverse(),
                        MAPPER.getTypeFactory().constructCollectionType(List.class, clazz));
            }
            return build(jsonNode.get("status").textValue(), jsonNode.get("msg").asText(), obj);
        } catch (Exception e) {
            return null;
        }
    }

}
