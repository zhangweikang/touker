package com.app.sjkh.commons.utils;

import org.springframework.util.Base64Utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;
import java.nio.charset.Charset;
import java.security.MessageDigest;

/**
 * 加密工具类
 * Created by Administrator on 2016/11/25.
 */
public class EncryptionUtils {
    /**
     * des加密key
     */
    private static final String DES_KEY = "^h$_0j9kwf$y7,@w%;o+f[]-";
    /**
     * SHA加密code
     */
    private static final Charset ENCODE = Charset.forName("UTF-8");

    /**
     * DES加密
     *
     * @param src 待加密字符串
     * @return des使用秘钥key加密后的字符串
     */
    public static String encryptThreeDESECB(String src) {
        return encryptThreeDESECB(src, DES_KEY);
    }

    public static String encryptThreeDESECB(String src, String key) {
        try {
            DESedeKeySpec dks = new DESedeKeySpec(key.getBytes(ENCODE));
            SecretKeyFactory keyFactory = SecretKeyFactory
                    .getInstance("DESede");
            SecretKey securekey = keyFactory.generateSecret(dks);

            Cipher cipher = Cipher.getInstance("DESede/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, securekey);

            return Base64Utils.encodeToString(cipher.doFinal(src.getBytes()))
                    .replaceAll("\r", "").replaceAll("\n", "");
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * sha加密
     *
     * @param string
     * @return
     */
    public static String shaEncryption(String string) {
        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
        try {
            byte[] btInput = string.getBytes(ENCODE);
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("SHA-1");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();

            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (byte byte0 : md) {
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * DES解密
     *
     * @param src 待解密字符串
     * @return 源字符串
     */
    public static String decryptThreeDESECB(String src) {
        return decryptThreeDESECB(src, DES_KEY);
    }

    public static String decryptThreeDESECB(String src, String key) {
        try {
            // 通过base64,将字符串转成byte数组
            byte[] bytesrc = Base64Utils.decodeFromString(src);
            // 解密的key
            DESedeKeySpec dks = new DESedeKeySpec(key.getBytes(ENCODE));
            SecretKeyFactory keyFactory = SecretKeyFactory
                    .getInstance("DESede");
            SecretKey securekey = keyFactory.generateSecret(dks);

            // Chipher对象解密
            Cipher cipher = Cipher.getInstance("DESede/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, securekey);
            byte[] retByte = cipher.doFinal(bytesrc);

            return new String(retByte, ENCODE);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
