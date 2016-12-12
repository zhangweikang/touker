package com.app.sjkh.commons.utils;

import org.apache.commons.lang3.StringUtils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;

/**
 * 时间工具类
 * Created by Administrator on 2016/11/25.
 */
public class DateUtils {
    /**
     * "YYYY-MM-DD"日期格式
     */
    public static final String DATE_YYYYMMMMDD = "yyyy-MM-dd";

    /**
     * "HH:MM:SS"时间格式
     */
    public static final String TIME_HHCMMCSS = "HH:mm:ss";
    /**
     * "HH:MM"时间格式
     */
    public static final String TIME_HHCMM = "HH:MM";
    /**
     * "HH:MM:SS AMPM"时间格式
     */
    public static final String TIME_HHCMMCSSAMPM = "HH:MM:SS AMPM";

    private static SimpleDateFormat m_dtFormater = null;

    public static String getCurDateTimeStr() {
        Date newdate = new Date();
        long datetime = newdate.getTime();
        Timestamp timestamp = new Timestamp(datetime);
        String str = timestamp.toString();
        return new StringBuffer().append(datetime).toString();
    }

    public static String getCurDateTime() {
        Date newdate = new Date();
        long datetime = newdate.getTime();
        Timestamp timestamp = new Timestamp(datetime);
        return (timestamp.toString()).substring(0, 19);
    }

    public static String getCurrentDate() {
        Date newdate = new Date();
        long datetime = newdate.getTime();
        Timestamp timestamp = new Timestamp(datetime);
        String currentdate = (timestamp.toString()).substring(0, 4) + "-" + (timestamp.toString()).substring(5, 7) + "-"
                + (timestamp.toString()).substring(8, 10);
        return currentdate;
    }

    public static String getCurrentYear() {
        Date newdate = new Date();
        long datetime = newdate.getTime();
        Timestamp timestamp = new Timestamp(datetime);
        String currentyear = (timestamp.toString()).substring(0, 4);
        return currentyear;
    }

    //获取开始时间和结束时间之间的天数
    public static long getDisDays(String datebegin, String dateend) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date dateBegin = sdf.parse(datebegin);
            Date dateEnd = sdf.parse(dateend);
            return (dateEnd.getTime() - dateBegin.getTime()) / (3600 * 24 * 1000) + 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public static String getCurrentTime() {
        Date newdate = new Date();
        long datetime = newdate.getTime();
        Timestamp timestamp = new Timestamp(datetime);
        String currenttime = (timestamp.toString()).substring(11, 13) + ":" + (timestamp.toString()).substring(14, 16) + ":"
                + (timestamp.toString()).substring(17, 19);
        return currenttime;
    }

    /**
     * 计算2个日期之间间隔天数方法
     * @param d1    The first Calendar.
     * @param d2    The second Calendar.
     * @return      天数
     */
    public static long getDaysBetween(java.util.Calendar d1, java.util.Calendar d2) {
        return (d1.getTime().getTime() - d2.getTime().getTime()) / (3600 * 24 * 1000);
    }

    /**
     * 计算2个日期之间间隔天数方法
     * @param d1    	The first Calendar.
     * 				格式yyyy-MM-dd
     * @param d2    	The second Calendar.
     * @return      天数
     */
    public static long getDaysBetween(String d1, String d2) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date dt1 = sdf.parse(d1);
            Date dt2 = sdf.parse(d2);
            return (dt1.getTime() - dt2.getTime()) / (3600 * 24 * 1000);
        } catch (Exception e) {
            return 0;
        }

    }

    /**
     * @param d1
     * @param d2
     * @param onlyWorkDay 是否只计算工作日
     * @return 计算两个日期之间的时间间隔(d1-d2)，可选择是否计算工作日

     */
    public static long getDaysBetween(String d1, String d2, boolean onlyWorkDay) {
        if (!onlyWorkDay) {
            return getDaysBetween(d1, d2);
        } else {
            long days = 0;
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            try {
                Date dt1 = sdf.parse(d1);
                Date dt2 = sdf.parse(d2);
                days = (dt1.getTime() - dt2.getTime()) / (3600 * 24 * 1000);
                for (calendar.setTime(dt1); calendar.getTime().after(dt2); calendar.add(Calendar.DAY_OF_YEAR, -1)) {
                    int week = calendar.get(Calendar.DAY_OF_WEEK);
                    if (week == Calendar.SUNDAY || week == Calendar.SATURDAY) {
                        days--;
                    }
                }
                if (days < 0) {
                    days = 0;
                }
            } catch (Exception e) {
            }
            return days;
        }
    }

    /**
     * @param date
     * @return 判断日期是否为工作日(周六和周日为非工作日)
     */
    public static boolean isWorkDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int week = calendar.get(Calendar.DAY_OF_WEEK);
        if (week == Calendar.SUNDAY || week == Calendar.SATURDAY) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 计算两个时间之间的间隔  单位：分钟(minutes)
     * 格式 yyyy-MM-dd/HH:mm:ss
     * */
    public static long getMinutesBetween(String s1, String s2) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd/HH:mm:ss");
        try {
            Date dt1 = sdf.parse(s1);
            Date dt2 = sdf.parse(s2);
            return (dt1.getTime() - dt2.getTime()) / (60 * 1000);
        } catch (Exception e) {
            return 0;
        }

    }

    /*
    * @param d1    	开始日期
    * 				格式yyyy-MM-dd
    * @param d2    	结束日期.
    * @return      按月分隔的list，list里面每个月一个map,第一天begindate，最后一天enddate
    */
    public static List<HashMap> getDateBetween(String d1, String d2) {
        ArrayList<HashMap> list = new ArrayList<HashMap>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar cal1 = Calendar.getInstance();
            Calendar cal2 = Calendar.getInstance();
            cal1.setTime(sdf.parse(d1));
            cal2.setTime(sdf.parse(d2));

            int monthnum = (cal2.get(Calendar.YEAR) - cal1.get(Calendar.YEAR)) * 12 + cal2.get(Calendar.MONTH) - cal1.get(Calendar.MONTH);
            for (int i = 0; i < monthnum; i++) {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("begindate", sdf.format(cal1.getTime()));
                cal1.add(Calendar.DATE, cal1.getActualMaximum(Calendar.DATE) - cal1.get(Calendar.DATE));
                map.put("enddate", sdf.format(cal1.getTime()));
                list.add(map);
                cal1.add(Calendar.MONTH, 1);
                cal1.add(Calendar.DATE, 1 - cal1.get(Calendar.DATE));
            }
            HashMap<String, Object> map = new HashMap<String, Object>();
            map.put("begindate", sdf.format(cal1.getTime()));
            map.put("enddate", d2);
            list.add(map);
        } catch (Exception e) {
            return list;
        }
        return list;
    }

    /*
    * 两个时间段得相交的天数
    * 格式yyyy-MM-dd
    * @return      天数
    */
    public static long getDays(String b1, String e1, String b2, String e2) {
        long ret = 0;
        String begindate = "";
        String enddate = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar begin1 = Calendar.getInstance();
            Calendar end1 = Calendar.getInstance();
            Calendar begin2 = Calendar.getInstance();
            Calendar end2 = Calendar.getInstance();
            begin1.setTime(sdf.parse(b1));
            end1.setTime(sdf.parse(e1));
            begin2.setTime(sdf.parse(b2));
            end2.setTime(sdf.parse(e2));
            //时间段不相交
            if ((begin2.getTime().getTime() > end1.getTime().getTime() && end2.getTime().getTime() > end1.getTime().getTime())
                    || (begin2.getTime().getTime() < begin1.getTime().getTime() && end2.getTime().getTime() < begin1.getTime().getTime())) {
                //System.out.println("b"+ret);
                return ret;
            }

            if (begin2.getTime().getTime() >= begin1.getTime().getTime()) {
                begindate = sdf.format(begin2.getTime());
            } else {
                begindate = sdf.format(begin1.getTime());
            }
            if (end2.getTime().getTime() >= end1.getTime().getTime()) {
                enddate = sdf.format(end1.getTime());
            } else {
                enddate = sdf.format(end2.getTime());
            }

            if (!begindate.equals("") && !enddate.equals("")) {
                ret = getDisDays(begindate, enddate);
            }
        } catch (Exception e) {

        }
        //System.out.println("e"+ret);
        return ret;
    }

    /*
    * 比较2个日期
    * @return
    */
    public static boolean after(String d1, String d2) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date dt1 = sdf.parse(d1);
            Date dt2 = sdf.parse(d2);
            return dt1.getTime() < dt2.getTime();
        } catch (Exception e) {
            return false;
        }
    }

    /*
    * 移动日期
    * @param date 原日期
    * @param len 移动量
    * @return 移动后日期
    */
    public static String dayMove(String date, int len) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar cal = Calendar.getInstance();
            cal.setTime(sdf.parse(date));
            cal.add(Calendar.DATE, len);
            return sdf.format(cal.getTime());
        } catch (Exception e) {
            return date;
        }
    }

    public static String dayMoveDateTime(String date, int year, int month, int day, int honr, int mintues, int second) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Calendar cal = Calendar.getInstance();
            cal.setTime(sdf.parse(date));
            cal.add(Calendar.YEAR, year);
            cal.add(Calendar.MONTH, month);
            cal.add(Calendar.DATE, day);
            cal.add(Calendar.HOUR, honr);
            cal.add(Calendar.MINUTE, mintues);
            cal.add(Calendar.SECOND, second);
            return sdf.format(cal.getTime());
        } catch (Exception e) {
            return date;
        }
    }

    public static String getCurrentMonth() {
        Calendar today = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        String curmonth = sdf.format(today.getTime());
        return curmonth;
    }

    public static String getCurrentMonthM() {
        Calendar today = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("MM");
        String curmonth = sdf.format(today.getTime());
        return curmonth;
    }

    /*
    * 移动月份
    * @param date 原日期

    * @param len 移动量

    * @return 移动后日期

    */
    public static String monthMove(String date, int len) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        try {
            Calendar cal = Calendar.getInstance();
            cal.setTime(sdf.parse(date));
            cal.add(Calendar.MONTH, len);
            return sdf.format(cal.getTime());
        } catch (Exception e) {
            return date;
        }
    }

    /*
    * 移动月份
    * @param date 原日期

    * @param len 移动量

    * @return 移动后日期

    */
    public static String monthMoveFullDate(String date, int len) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar cal = Calendar.getInstance();
            cal.setTime(sdf.parse(date));
            cal.add(Calendar.MONTH, len);
            return sdf.format(cal.getTime());
        } catch (Exception e) {
            return date;
        }
    }

    public static void main(String[] args){
        System.out.print(monthMoveFullDate("2011-08-16", -6));
    }

    /*
    * 截取2个时间段相交的时间段
    *
    * @return  String[] = {array[0]=begindate ,array[1]=enddate}
    * 不相交    array[0]=""
    *
    */
    public static String[] getBetweenDate(String b1, String e1, String b2, String e2) {
        String[] date = new String[2];
        String begindate = "";
        String enddate = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Calendar begin1 = Calendar.getInstance();
            Calendar end1 = Calendar.getInstance();
            Calendar begin2 = Calendar.getInstance();
            Calendar end2 = Calendar.getInstance();
            begin1.setTime(sdf.parse(b1));
            end1.setTime(sdf.parse(e1));
            begin2.setTime(sdf.parse(b2));
            end2.setTime(sdf.parse(e2));
            if ((begin2.getTime().getTime() >= end1.getTime().getTime() && end2.getTime().getTime() >= end1.getTime().getTime())
                    || (begin2.getTime().getTime() <= begin1.getTime().getTime() && end2.getTime().getTime() <= begin1.getTime().getTime())) {
                date[0] = "";
                return date;
            }

            if (begin2.getTime().getTime() >= begin1.getTime().getTime()) {
                begindate = sdf.format(begin2.getTime());
            } else {
                begindate = sdf.format(begin1.getTime());
            }
            if (end2.getTime().getTime() >= end1.getTime().getTime()) {
                enddate = sdf.format(end1.getTime());
            } else {
                enddate = sdf.format(end2.getTime());
            }

            if (!begindate.equals("") && !enddate.equals("")) {
                date[0] = begindate;
                date[1] = enddate;
            }
        } catch (Exception e) {

        }
        return date;
    }

    /**
     * get first day of month view of calendar
     * @return
     */
    public static String getFirstDayOfMonthWeek(Date date) {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, 1);//1st
        int day = calendar.get(Calendar.DAY_OF_WEEK);
        calendar.add(Calendar.DATE, calendar.getFirstDayOfWeek() - day);
        Date date1 = calendar.getTime();
        return sdf.format(date1);
    }

    /**
     * get last day of month view of calendar
     * @return
     */
    public static String getLastDayOfMonthWeek(Date date) {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        calendar.setTime(date);
        calendar.add(calendar.MONTH, 1);
        calendar.set(calendar.DATE, 1);
        calendar.add(calendar.DATE, -1); //last day
        int day = calendar.get(Calendar.DAY_OF_WEEK);
        calendar.add(Calendar.DATE, 7 - day);
        Date date1 = calendar.getTime();
        return sdf.format(date1);
    }

    /**
     * 如果date1为null,返回今天的日期
     * @param date1 as java.util.Date
     * @return String //yyyy-MM-dd
     */
    public static String getShortDate(Date date1) {
        String strDate = null;
        if (date1 == null)
            date1 = Calendar.getInstance().getTime();
        //try{
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        strDate = format.format(date1);
        //}catch(ParseException pe){System.out.println("DateHelper.getShortDate解析异常:"+pe.toString());}
        return strDate;
    }

    public static String convertDateIntoYYYYMMDD_HHCMMCSSStr(Date date) {
        return convertDateIntoDisplayStr(date, DATE_YYYYMMMMDD + " " + TIME_HHCMMCSS);
    }

    public static String convertDateIntoYYYYMMDDStr(Date date) {
        return convertDateIntoDisplayStr(date, null);
    }

    public static String convertDateIntoYYYYMMDD_HHMMStr(Date date) {
        return convertDateIntoDisplayStr(date, DATE_YYYYMMMMDD + " " + TIME_HHCMM);
    }

    public static String convertDateIntoDisplayStr(Date date, String format) {
        String dateStr = null;
        if (format == null)
            format = DATE_YYYYMMMMDD;
        if (m_dtFormater == null) {
            m_dtFormater = new SimpleDateFormat();
        }
        m_dtFormater.applyPattern(format);
        if (date != null) {
            dateStr = m_dtFormater.format(date);
        }
        return dateStr;
    }

    /**
     * @param source yyyy-mm-dd格式String
     * @return Date
     */
    public static Date parseDate(String source) {
        SimpleDateFormat format = new SimpleDateFormat(DATE_YYYYMMMMDD);
        try {
            return format.parse(source);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * @param source yyyy-mm-dd HHmmss格式String
     * @return Date
     */
    public static Date parseDate(String source,String pattern) {
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        try {
            return format.parse(source);
        } catch (Exception e) {
            return null;
        }
    }


    /**
     * 取得当前星期的第一天
     *
     * @return
     */
    public static Date getCurrentWeekFirstDay(){
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_WEEK, calendar.getActualMinimum(Calendar.DAY_OF_WEEK));
        Date first = calendar.getTime();//getDay(calendar.getTime(), 1);
        if (getDayOfWeek(date)==1){//如果今天是星期日
            first = getDay(calendar.getTime(), -6);
        }
        else{
            first = getDay(calendar.getTime(), 1);
        }
        return first;
    }

    /**
     * 取得所给日期的星期的第一天
     *
     * @return
     */
    public static Date getCurrentWeekFirstDay(Date date){
//    	Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_WEEK, calendar.getActualMinimum(Calendar.DAY_OF_WEEK));
        Date first = calendar.getTime();//getDay(calendar.getTime(), 1);
        if (getDayOfWeek(date)==1){//如果今天是星期日
            first = getDay(calendar.getTime(), -6);
        }
        else{
            first = getDay(calendar.getTime(), 1);
        }
        return first;
    }

    /**
     * 取得当前日期为本周的第几天
     *
     * @param date
     * @return
     */
    public static int getDayOfWeek(Date date){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DAY_OF_WEEK);
    }

    /**
     * 根据年份和周数获取本周开始日期
     * @param year 		年
     * @param week		周数
     * @param format	格式 （默认：YYYY-MM-DD）
     * @return
     */
    public static String getFirstDayWeekByYearWeek(String year,String week,String format){

        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, NumberUtils.string2Int(year,0));
        cal.set(Calendar.WEEK_OF_YEAR, NumberUtils.string2Int(week,0));
        int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
        cal.add(Calendar.DATE,cal.getActualMinimum(Calendar.DAY_OF_WEEK)-dayOfWeek);
        cal.add(Calendar.DATE, 1);
        if(StringUtils.isEmpty(format)){
            format="yyyy-MM-dd";
        }
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        String firstDayOfWeekDate = sdf.format(cal.getTime()).trim();
        return firstDayOfWeekDate;
    }
    /***
     * 取当前日期为本年的第几周
     * @param date
     * @return
     */
    public static int getWeekOfYear(Date date){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        return calendar.get(Calendar.WEEK_OF_YEAR);
    }
    /**
     * 返回指定日期的前后的i天
     *
     * @param date
     * @param i
     * @return
     */
    public static Date getDay(Date date, int i){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_YEAR, i);
        return calendar.getTime();
    }

    /**
     * String 转为date型
     */

    public static Date stringtoDate(String stringDate ){
        if (StringUtils.isEmpty(stringDate)){
            return new Date();
        }
        DateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = format1.parse(stringDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    //获得第几季度
    public static int getThisSeasonTime(int month){
        int season = 1;
        if(month>=1&&month<=3){
            season = 1;
        }
        if(month>=4&&month<=6){
            season = 2;
        }
        if(month>=7&&month<=9){
            season = 3;
        }
        if(month>=10&&month<=12){
            season = 4;
        }
        return season;
    }

    public static String getSeasonStart(int season){
        String array[][] = {{"01","02","03"},{"04","05","06"},{"07","08","09"},{"10","11","12"}};

        String start_month = array[season-1][0];
        String year = getCurrentYear();
        String date = year+"-"+start_month+"-01";
        return date;

    }

    public static String getSeasonend(int season){
        String array[][] = {{"01","02","03"},{"04","05","06"},{"07","08","09"},{"10","11","12"}};
        String end_month = array[season-1][2];
        String year = getCurrentYear();
        String month = year+"-"+end_month;
        String lastmonth = monthMove(month,1)+"-01";
        String enddate = dayMove(lastmonth,-1);
        return enddate;
    }

    /**
     * 针对excel时间返回的Long值进行日期转换
     * @param tempTimeLong
     * @return
     */
    public static String getTimeToString(Long tempTimeLong){
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy年MM月dd日");
        long ss = (tempTimeLong - 70 * 365 - 17 - 2) * 24 * 3600 * 1000;
        Date date = new Date(ss);
        return formatter.format(date);
    }

    /**
     * 针对excel时间返回的Long值进行日期转换
     * @param tempTimeLong
     * @return
     */
    public static String getTimeToString(SimpleDateFormat formatter,Long tempTimeLong){
        long ss = (tempTimeLong - 70 * 365 - 17 - 2) * 24 * 3600 * 1000;
        Date date = new Date(ss);
        return formatter.format(date);
    }

    /**
     * 得到一个月的最后一天，参数格式为 年-月(如2013-10)
     * @return
     */
    public static String getLastDayOfMonth(String month){
        String year=month.substring(0,4);
        String mon=month.substring(5,7);
        Calendar calendar=Calendar.getInstance();
        calendar.set(Integer.parseInt(year), Integer.parseInt(mon)-1 ,1);
        return year+"-"+mon+"-"+calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
    }

    /**
     * 是否日期A大于等于日期B
     * @param dateA	日期A
     * @param dateB	日期B
     * @return true：是的 false：不是
     */
    public static boolean dateAThenDateBToBigEQ(String dateA,String dateB){
        int dateANum=NumberUtils.string2Int(dateA.replace("-", ""),0);
        int dateBNum=NumberUtils.string2Int(dateB.replace("-", ""),0);
        return dateANum>=dateBNum;
    }


    /**
     * 比较两时间差
     * @param dateA
     * @param dateB
     * @return
     * @throws Exception
     */
    public static long compareingA2B(String dateA,String dateB)throws Exception{
        SimpleDateFormat format = new SimpleDateFormat(DATE_YYYYMMMMDD+" "+TIME_HHCMMCSS);
        long result=0;
        try {
            Date _dateA=format.parse(dateA);
            Date _dateB=format.parse(dateB);
            result=(_dateA.getTime()-_dateB.getTime());
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            throw new Exception("时间转换异常",e);
        }
        return result;
    }

    /**
     * 比较两时间差(分钟)
     * @param dateA
     * @param dateB
     * @return
     * @throws Exception
     */
    public static int compareingA2BMin(String dateA,String dateB)throws Exception{
        return (int)compareingA2B(dateA, dateB)/1000/60;
    }

    /**
     * 是否是符合"年月日"格式
     * @param date
     * @return
     */
    public static boolean isFormatedDate(String date){
        Matcher matcher=null;
        String reg="^\\d{4}-\\d{2}-\\d{2}$";
        java.util.regex.Pattern p=java.util.regex.Pattern.compile(reg);
        matcher=p.matcher(date);
        return matcher.matches();
    }

    /**
     * 是否是符合"年月"格式
     * @param date
     * @return
     */
    public static boolean isFormatedMonth(String date){
        Matcher matcher=null;
        String reg="^\\d{4}-\\d{2}$";
        java.util.regex.Pattern p=java.util.regex.Pattern.compile(reg);
        matcher=p.matcher(date);
        return matcher.matches();
    }

    public static String stringFormmat(String date,String formmat){
        SimpleDateFormat formatter = new SimpleDateFormat(formmat);
        SimpleDateFormat formatter1 = new SimpleDateFormat("yyyy-MM");
        String result = null;

        try {
            date=date.replace("\"", "");
            Date _date = formatter.parse(date);
            result = formatter1.format(_date);
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return result;
    }

    public static String stringFormmat(String date){
        return stringFormmat(date,"yyyy年MM月");
    }

    /**
     * 格式化当前时间,指定输出时间格式
     * @param patternStr
     * @return
     */
    public static String convertDate(String patternStr){
        SimpleDateFormat format = new SimpleDateFormat(patternStr);
        return format.format(new Date());
    }
}
