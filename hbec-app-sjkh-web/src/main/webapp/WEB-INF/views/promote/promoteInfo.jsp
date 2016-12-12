<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>钱钱炒股推广页面</title>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta content="yes" name="apple-mobile-web-app-capable">
    <!-- 全屏显示 -->
    <meta content="yes" name="apple-touch-fullscreen">
    <!-- 全屏显示 -->
    <meta content="telephone=no,email=no" name="format-detection">
    <!-- 不启用电话，邮件 -->
    <meta name="viewport"
          content="width=750, user-scalable=no">
    <!-- 以原始大小显示，并不允许缩放 -->
    <meta name="format-detection" content="address=no"/>
    <!-- 不启用地址 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- 在web app应用下状态条（屏幕顶部条）的颜色为黑色 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- 网站开启对web app程序的支持 -->
    <meta name="mobile-web-app-capable" content="yes"/>
    <!-- 删除默认的苹果工具栏和菜单栏 -->
    <meta name="apple-touch-fullscreen" content="yes"/>
    <!-- 添加到主屏幕“后，全屏显示 -->
    <meta name="full-screen" content="yes"/>

    <style>
        body {
            margin: 0;
            padding: 0;
            position: absolute;
            height: 100%;
            width:100%;
            font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
        }

        h2 {
            margin: 0;
        }

        p {
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            height: 100%;
            background: url("../../../commons/images/icon_qqcg_bg.png") no-repeat;
            background-size: 100%;
        }
        .top-logo{
            padding-top:223px;
        }
        .logo {
            width: 163px;
            height: 161px;
            background: url("../../../commons/images/icon_qqcg_logo.png") no-repeat;
            background-size:100%;
            margin:0 auto;
            -moz-box-shadow: 4px 10px 34px -6px #000000;
            -webkit-box-shadow: 4px 10px 34px -6px #000000;
            box-shadow: 4px 10px 34px -6px #000000;
            -webkit-border-radius:12px;
            -moz-border-radius:12px;
            border-radius:12px;
        }
        .top-logo .title{
            font-size: 50px;
            color: #4f4f4f;
            margin: 25px auto 0;
            text-align: center;
            line-height: 68px;
        }
        .top-logo .info{
            font-size:24px;
            color: #8e9ca6;
            margin: 0 auto;
            text-align: center;
            line-height:40px;
        }
        .qqcgPhone .title{
            color: #216383;
            font-size:36px;
            text-align: center;
        }
        .qqcgPhone{
            text-align: center;
        }
        .qqcgPhone .tel{
            color: #2f2f2f;
            font-size:30px;
            width: 600px;
            border:1px solid #c1c1c1;
            height:76px;
            margin:0 auto 40px;
            outline:none;
            text-align: center;
            padding:0;
        }
        .qqcgPhone .tel::-webkit-input-placeholder{
            color: #2f2f2f;
        }
        .qqcgPhone .btn{
            color: #ffffff;
            font-size:30px;
            width: 600px;
            height: 88px;
            background-color: #3c91fb;
            margin:0 auto;
            border:none;
            outline:none;
            padding:0;
            -webkit-border-radius:12px;
            -moz-border-radius:12px;
            border-radius:12px;
        }
    </style>

</head>

<body>
<div class="container">
    <div class="top-logo">
        <div class="logo"></div>
        <h2 class="title">钱钱炒股</h2>
        <p class="info">华宝证券旗下炒股工具</p>
    </div>
    <form action="<%=request.getContextPath()%>/rest/promoter/qianQianStock" class="qqcgPhone" method="post" id="qqcgPhone">
        <h3 class="title">三分钟极速开户，开启智能炒股时代</h3>
        <input type="tel" class="tel" name="phoneno" placeholder="请输入手机号" onkeyup="this.value=this.value.replace(/[^\d]/g,'') "  onafterpaste="this.value=this.value.replace(/[^\d]/g,'') " maxlength="11">
        <input type="hidden" name="fwry" value="${param.fwry}">
        <input type="hidden" name="channel" value="hbstock">
        <input type="button" class="btn" value="马上开户" disabled="disabled">
    </form>
</div>


<script>
    function view() {
        return {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
        };
    }

    function getUrlParam (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var href = window.location.search.substr(1).match(reg);
        if (href !== null)
            return unescape(href[2]);
        return null;
    }

    /*https://static.touker.com/m/stock.htm*/

    window.onload = function () {
        document.body.style.height=view().h+"px";

        // 校验按钮是否可点击
        document.querySelector('.tel').addEventListener('input',function () {
            if((this).value===''||this.value.length<11){
                document.querySelector('.btn').setAttribute('disabled','disabled');
                return;
            }else{
                document.querySelector('.btn').removeAttribute('disabled');
            }
        });

        // 页面加载获取fwry查询字符串
        //   var fwry = getUrlParam('fwry');
        //
        // 按钮点击之后
        document.querySelector('.btn').addEventListener('click',function () {
            document.getElementById('qqcgPhone').submit();
        });
    }
</script>
</body>
</html>
