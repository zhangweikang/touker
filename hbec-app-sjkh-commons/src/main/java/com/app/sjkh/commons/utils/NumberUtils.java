package com.app.sjkh.commons.utils;

import org.apache.commons.lang3.StringUtils;

import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 数字转化工具类
 * Created by Administrator on 2016/11/25.
 */
public class NumberUtils {

    /**
     * 将输入的整数转成指定长度的字符串,不足的用0填充
     *
     * @param iIn     需要填充0的整数
     * @param iLength 转换后的字符串的长度
     * @return 用0填充过的指定长度的字符串
     */
    public static String add0(int iIn, int iLength) {
        long lv = (long) Math.pow(10, iLength);
        if (lv < iIn) return String.valueOf(iIn);
        return String.valueOf(lv + iIn).substring(1);
    }

    /**
     * @param strValue
     * @return
     */
    public static int string2Int(String strValue) {
        return string2Int(strValue, -1);
    }

    /**
     * @param strValue
     * @param defValue
     * @return
     */
    public static int string2Int(String strValue, int defValue) {
        try {
            return Integer.parseInt(strValue);
        } catch (Exception ex) {
            return defValue;
        }
    }

    public static int string2Int(Object obj, int defValue) {
        if (obj == null) {
            return defValue;
        }
        try {
            return Integer.parseInt(obj.toString());
        } catch (Exception ex) {
            return defValue;
        }
    }

    /**
     * 判断一个字符串（11.0）是否为整数，是则返回整数，否则返回-1
     *
     * @param strValue
     * @return
     */
    public static int string2Int2(String strValue) {
        try {
            if (StringUtils.isEmpty(strValue)) {
                return 0;
            }
            Double dvalue = Double.valueOf(strValue);
            int ivalue = dvalue.intValue();
            if (dvalue == ivalue) {
                return ivalue;
            }
        } catch (Exception ex) {
            return -1;
        }
        return -1;
    }

    /**
     * 判断一个字符串（11.0）是否为整数，是则返回整数，否则返回值
     *
     * @param strValue
     * @return
     */
    public static int string2Int2(String strValue, int defValue) {
        try {
            if (strValue == null) {
                return 0;
            }
            Double dvalue = Double.valueOf(strValue);
            int ivalue = dvalue.intValue();
            if (dvalue == ivalue) {
                return ivalue;
            }
        } catch (Exception ex) {
            return defValue;
        }

        return defValue;
    }

    public static Integer getIntegerValue(Object strValue, int defValue) {
        try {
            return Integer.valueOf(strValue == null ? "" : "" + strValue);
        } catch (Exception ex) {
            return new Integer(defValue);
        }
    }

    public static Integer getIntegerValue(Object strValue) {
        return getIntegerValue(strValue, 0);
    }


    /**
     * @param strValue
     * @return
     */
    public static float string2Float(String strValue) {
        return string2Float(strValue, -1);
    }


    /**
     * @param strValue
     * @param defValue
     * @return
     */
    public static float string2Float(String strValue, float defValue) {
        try {
            return Float.parseFloat(strValue);
        } catch (Exception ex) {
            return defValue;
        }
    }

    /**
     * @param strValue
     * @return
     */
    public static double string2Double(String strValue) {
        return string2Double(strValue, -1);
    }

    // 金额每3位加逗号
    public static String moneyAddComma(double money) {
        return new java.text.DecimalFormat("#,##0.00").format(money);
    }

    // 金额每3位加逗号
    public static String moneyAddComma(String money) {
        double tempmoney = string2Double(money, 0);
        return new java.text.DecimalFormat("#,##0.00").format(tempmoney);
    }

    // 金额每3位加逗号
    public static String moneyAddComma(Object money) {
        double tempmoney = string2Double(money, 0);
        return new java.text.DecimalFormat("#,##0.00").format(tempmoney);
    }

    /**
     * @param strValue
     * @param defValue
     * @return
     */
    public static double string2Double(String strValue, double defValue) {
        try {
            return Double.parseDouble(strValue);
        } catch (Exception ex) {
            return defValue;
        }
    }

    public static double string2Double(Object obj, double defValue) {
        if (obj == null) {
            return defValue;
        }
        try {
            return Double.parseDouble(obj.toString());
        } catch (Exception ex) {
            return defValue;
        }
    }

    public static int getRandomInt(int min, int max) {

        Random random = new Random();
        return Math.abs(random.nextInt()) % (max - min) + min;
    }

    /**
     * 浮点数四舍五入为整型
     */
    public static int float2int(float fValue) {
        int intValue = (int) fValue;
        float tFloat = fValue - intValue;
        intValue = (int) (tFloat + fValue);
        return intValue;
    }


    public static double fixDouble(double num) {
        return fixDouble(num, 2);
    }

    public static double fixDouble(double num, int len) {
        if (len < 0) len = 2;
        double n = Math.pow(10, len);
        return (int) Math.floor(num * n) / n;
    }

    public static double fixDoubleCeil(double num, int len) {
        if (len < 0) len = 2;
        double n = Math.pow(10, len);
        return (int) Math.ceil(num * n) / n;
    }

    /**
     * 生成验证随机数
     *
     * @param codeNum 随机数位数
     * @return 随机字符串
     */
    public static String generateCode(int codeNum) {
        Random radom = new Random();
        StringBuffer codeNo = new StringBuffer();
        for (int i = 0; i < codeNum; i++) {
            codeNo.append(radom.nextInt(10));
        }
        return codeNo.toString();
    }

    /**
     * 是否是有效的数字，且小数
     */
    public static boolean isNumber(String number) {
        boolean bool = false;
        try {
            double tempNum = string2Double(number, 0);
            bool = true;
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println("数字转换失败！");
        }
        return bool;
    }

    public static String number2ExcelABC(int n) {
        String s = "";     // result
        int r = 0;         // remainder
        while (n != 0) {
            r = n % 26;
            char ch = ' ';
            if (r == 0)
                ch = 'Z';
            else {
                ch = (char) (r - 1 + 'A');
            }
            s = String.valueOf(ch) + s;
            if (s.toCharArray()[0] == 'Z')
                n = n / 26 - 1;
            else
                n /= 26;

        }
        return s;

    }


    public static int excelABC2Number(String col) {
        col = col.toUpperCase();
        int count = -1;
        char[] cs = col.toCharArray();
        for (int i = 0; i < cs.length; i++) {
            count += (cs[i] - 64) * Math.pow(26, cs.length - 1 - i);
        }

        return count;
    }

    /**
     * 获取UUID
     *
     * @return
     */
    public static String getUUID() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString().replace("-", "");
    }

    /**
     * 校验手机号码格式是否正确
     *
     * @param str
     * @return
     */
    public static boolean isMoblie(String str) {
        Pattern pattern = Pattern.compile("^(1\\d{10})$");
        Matcher matcher = pattern.matcher(str);
        return matcher.matches();
    }
}
