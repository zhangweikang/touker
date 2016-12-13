package com.app.sjkh.controller;

import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.service.ToukerService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.HashMap;
import java.util.Map;

/**
 * 公共请求
 * Created by Administrator on 2016/11/15.
 */
@RequestMapping("commons")
@Controller
public class CommonsController {

    @Autowired
    private ToukerService toukerService;

    /**
     * 获取交易时间
     *
     * @return
     */
    @RequestMapping(value = "getTradeDate", method = RequestMethod.POST)
    @ResponseBody
    public ResultResponse getTradeDate() {
        return toukerService.getTradeDate();
    }

    /**
     * 判断手机号是否注册投客网
     *
     * @param request
     * @return 001011, 未注册
     * 001012,已注册
     * 001004,参数空
     * 001003,系统异常
     */
    @RequestMapping(value = "getIp")
    @ResponseBody
    public ResultResponse getIp(HttpServletRequest request) {

        Map<String, String> map = new HashMap<>();
        String ip = "";
        if (request.getHeader("x-forwarded-for") == null) {
            ip = request.getRemoteAddr();
        } else {
            ip = request.getHeader("x-forwarded-for");
        }
        map.put("ip", ip);
        map.put("mac", getMACAddress(ip));

        return new ResultResponse(ResultCode.HBEC_000000.getCode(), null, map);
    }

    /**
     * 通过IP地址获取MAC地址
     *
     * @param ip String,127.0.0.1格式
     * @return mac String
     * @throws Exception
     */
    public String getMACAddress(String ip) {
        String line = "";
        String macAddress = "";
        final String MAC_ADDRESS_PREFIX = "MAC Address = ";
        final String LOOPBACK_ADDRESS = "127.0.0.1";
        //如果为127.0.0.1,则获取本地MAC地址。
        try {
            if (LOOPBACK_ADDRESS.equals(ip)) {
                InetAddress inetAddress = InetAddress.getLocalHost();
                //貌似此方法需要JDK1.6。
                byte[] mac = NetworkInterface.getByInetAddress(inetAddress).getHardwareAddress();
                //下面代码是把mac地址拼装成String
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < mac.length; i++) {
                    if (i != 0) {
                        sb.append("-");
                    }
                    //mac[i] & 0xFF 是为了把byte转化为正整数
                    String s = Integer.toHexString(mac[i] & 0xFF);
                    sb.append(s.length() == 1 ? 0 + s : s);
                }
                //把字符串所有小写字母改为大写成为正规的mac地址并返回
                macAddress = sb.toString().trim().toUpperCase();
                return macAddress;
            }
            //获取非本地IP的MAC地址
            Process p = Runtime.getRuntime().exec("nbtstat -A " + ip);
            InputStreamReader isr = new InputStreamReader(p.getInputStream());
            BufferedReader br = new BufferedReader(isr);
            while ((line = br.readLine()) != null) {
                if (line != null) {
                    int index = line.indexOf(MAC_ADDRESS_PREFIX);
                    if (index != -1) {
                        macAddress = line.substring(index + MAC_ADDRESS_PREFIX.length()).trim().toUpperCase();
                    }
                }
            }
            br.close();
        } catch (IOException e) {
            macAddress = "02:00:5E:00:00:14";
        }
        return macAddress;
    }
}
