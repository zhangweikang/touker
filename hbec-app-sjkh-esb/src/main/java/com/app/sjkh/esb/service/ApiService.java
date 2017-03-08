package com.app.sjkh.esb.service;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sun.misc.BASE64Encoder;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.security.KeyStoreException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 负责和外部接口对接
 */
@Service
public class ApiService implements BeanFactoryAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApiService.class);

    @Autowired(required = false)
    private RequestConfig requestConfig;

    private BeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
    }

    /**
     * 从Spring容器中获取多例的CloseableHttpClient对象
     *
     * @return
     */
    public CloseableHttpClient getHttpClient() {
        return this.beanFactory.getBean(CloseableHttpClient.class);
    }

    /**
     * 执行get请求
     *
     * @param url
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     */
    public String doGet(String url) throws IOException, KeyStoreException {
        // 创建http GET请求
        HttpGet httpGet = new HttpGet(url);
        httpGet.setConfig(this.requestConfig);// 设置请求参数

        return responseResult(url, httpGet);
    }

    /**
     * 带参数的get请求
     *
     * @param url
     * @param params
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     * @throws URISyntaxException
     */
    public String doGet(String url, Map<String, String> params) throws IOException,
            URISyntaxException, KeyStoreException {
        URIBuilder builder = new URIBuilder(url);
        for (Map.Entry<String, String> entry : params.entrySet()) {
            builder.addParameter(entry.getKey(), entry.getValue());
        }
        return this.doGet(builder.build().toString());
    }

    /**
     * 执行post请求
     *
     * @param url
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     */
    public String doPost(String url, Map<String, String> params) throws IOException {
        // 创建http GET请求
        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(this.requestConfig);// 设置请求参数
        // 设置请求参数
        if (null != params) {
            List<NameValuePair> list = new ArrayList<NameValuePair>(params.size());
            for (Map.Entry<String, String> entry : params.entrySet()) {
                list.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
            }
            UrlEncodedFormEntity urlEncodedFormEntity = new UrlEncodedFormEntity(list, "UTF-8");
            // 添加到httpPost中
            httpPost.setEntity(urlEncodedFormEntity);
        }

        return responseResult(url, httpPost);
    }

    /**
     * 执行post请求
     *
     * @param url
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     */
    public String doPostJson(String url, String json) throws IOException {
        // 创建http GET请求
        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(this.requestConfig);// 设置请求参数
        // 设置请求参数
        if (null != json) {
            StringEntity stringEntity = new StringEntity(json, ContentType.create(
                    ContentType.APPLICATION_JSON.getMimeType(), "UTF-8"));
            // 添加到httpPost中
            httpPost.setEntity(stringEntity);
        }

        return responseResult(url, httpPost);
    }

    /**
     * 执行post请求
     *
     * @param url
     * @return
     * @throws ClientProtocolException
     * @throws IOException
     */
    public String doPost(String url) throws IOException {
        return this.doPost(url, null);
    }

    /**
     * post请求上传文件,文件流形式
     *
     * @param url
     * @param filePath
     * @param map
     * @return
     * @throws IOException
     */
    public String doPostUploadFile(String url, String filePath, Map<String, String> map) throws IOException {

        //创建post链接
        HttpPost httpPost = new HttpPost(url);
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        //获取文件
        File file = new File(filePath);
        FileBody fileBody = new FileBody(file);
        //添加请求参数
        builder.addPart("file", fileBody);
        for (Map.Entry<String, String> entry : map.entrySet()) {
            StringBody body = new StringBody(entry.getValue(), ContentType.MULTIPART_FORM_DATA);
            builder.addPart(entry.getKey(), body);
        }
        HttpEntity entity = builder.build();
        httpPost.setEntity(entity);
        return responseResult(url, httpPost);
    }

    /**
     * post请求上传文件,文件byte数组
     *
     * @param url
     * @param bytes
     * @param map
     * @param fileName(上传文件名)
     * @return
     * @throws IOException
     */
    public String doPostUploadFile(String url, byte[] bytes, String fileName, Map<String, String> map) throws IOException {

        //创建post链接
        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(this.requestConfig);// 设置请求参数
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        //添加请求参数
        builder.addBinaryBody("file", bytes, ContentType.DEFAULT_BINARY, fileName);
        for (Map.Entry<String, String> entry : map.entrySet()) {
            builder.addTextBody(entry.getKey(), entry.getValue(), ContentType.TEXT_PLAIN);
        }
        HttpEntity entity = builder.build();
        httpPost.setEntity(entity);
        return responseResult(url, httpPost);
    }

    public String doPostDownloadFile(String url, String json) throws IOException, URISyntaxException, KeyStoreException {

        // 创建http POST请求
        HttpPost httpPost = new HttpPost(url);
        httpPost.setConfig(this.requestConfig);// 设置请求参数

        httpPost.setHeader(HttpHeaders.CONTENT_TYPE,"image/jpeg");
        // 设置请求参数
        if (null != json) {
            StringEntity stringEntity = new StringEntity(json, ContentType.create(
                    "image/jpeg", "UTF-8"));
            // 添加到httpPost中
            httpPost.setEntity(stringEntity);
        }

        CloseableHttpResponse response = null;
        try {
            // 执行请求
            response = getHttpClient().execute(httpPost);
            // 判断返回状态是否为200
            if (response.getStatusLine().getStatusCode() == 200) {
                InputStream inputStream = response.getEntity().getContent();

                byte[] bytes = inputToByte(inputStream);
                BASE64Encoder encoder = new BASE64Encoder();
                String encode = encoder.encode(bytes);

                return encode;
            }
        } finally {
            if (response != null) {
                response.close();
            }
        }
        return null;
    }

    private String responseResult(String url, HttpUriRequest request) throws IOException {

        CloseableHttpResponse response = null;
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("执行" + request.getMethod() + "请求! url = {}", url);
        }
        try {
            // 执行请求
            response = getHttpClient().execute(request);
            // 判断返回状态是否为200
            if (response.getStatusLine().getStatusCode() == 200) {
                String content = URLDecoder.decode(EntityUtils.toString(response.getEntity(), "UTF-8"), "UTF-8");
                if (LOGGER.isDebugEnabled()) {
                    // 判断是否启用debug模式
                    LOGGER.debug("获取的响应内容  Content = {}, url = {}", content, url);
                }
                return content;
            }
        } finally {
            if (response != null) {
                response.close();
            }
        }
        return null;
    }

    /**
     * 输入流转字节
     *
     * @param inStream
     * @return
     * @throws IOException
     */
    public static final byte[] inputToByte(InputStream inStream)
            throws IOException {
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        byte[] buff = new byte[1024*1024];
        int rc = 0;
        while ((rc = inStream.read(buff, 0, 1024)) > 0) {
            swapStream.write(buff, 0, rc);
        }
        byte[] in2b = swapStream.toByteArray();
        return in2b;
    }
}
