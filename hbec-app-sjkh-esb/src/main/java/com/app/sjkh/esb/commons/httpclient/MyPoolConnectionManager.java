package com.app.sjkh.esb.commons.httpclient;

import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

/**
 * 自定义httpclient连接通道
 * Created by Administrator on 2016/12/8.
 */
public class MyPoolConnectionManager extends PoolingHttpClientConnectionManager {

    public MyPoolConnectionManager() {
        super(getDefaultRegistry());
    }

    private static Registry<ConnectionSocketFactory> getDefaultRegistry() {
        SSLContext sslContext = createSSLContext();
        SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, new MyHostNameVerifier());

        return RegistryBuilder.<ConnectionSocketFactory>create()
                .register("http", PlainConnectionSocketFactory.getSocketFactory())
                .register("https", sslsf)
                .build();
    }

    /**
     * 获取初始化SslContext
     *
     * @return
     */
    private static SSLContext createSSLContext() {
        SSLContext sslcontext = null;
        try {
            sslcontext = SSLContext.getInstance("TLS");
            sslcontext.init(null, new TrustManager[]{new MyTrustManager()}, null);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
        return sslcontext;
    }

    public void shutdown() {
        super.shutdown();
    }

    public void setMaxTotal(final int max) {
        super.setMaxTotal(max);
    }

    public void setDefaultMaxPerRoute(final int max) {
        super.setDefaultMaxPerRoute(max);
    }
}
