<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE html>
<html>
<head>

	<title>手机开户推广页面</title>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="shortcut icon" type="image/x-icon" href="../img/favicon.ico"/>
	<meta content="yes" name="apple-mobile-web-app-capable">
	<meta content="yes" name="apple-touch-fullscreen">
	<meta content="telephone=no,email=no" name="format-detection">
	<meta content="fullscreen=yes,preventMove=no" name="ML-Config">
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
	<meta name="format-detection" content="address=no" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-touch-fullscreen" content="yes" />
	<meta name="full-screen" content="yes" />
	<link rel="stylesheet" href="../../../commons/css/common-h5.css"/>
	<link rel="stylesheet" href="../../../commons/css/yx-h5.css">
	<script type="text/javascript" src=""></script>
</head>

<body class="bg-white">
<section>
	<div class="toplogo-pic"><img src="../../../commons/images/hb_logo.png"></div>
	<p class="slogan-big">华宝证券手机开户，3分钟轻松开户炒股</p>
	<div class="c_a">
		<form action="" name="fm" method="post">
			<div class="form_item clearfix">
				<dt> 手机号：</dt><dd><input class="form_inp" type="text" name="phoneno"  id="phoneno" onkeyup="this.value=this.value.replace(/[^\d]/g,'') " onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "   maxlength="11"  value="" /></dd>
				<dd><input  type="hidden" type="text" id="errMsg"  value="" /></dd>
				<input type="hidden" name="fwry"  id="fwry" value="${param.fwry}"  />
			</div>
		</form>
		<a class="kh-btn" href="javascript:void(0)" onclick="onSubmitInfo()">马上开户</a>
	</div>

</section>

<script type="text/javascript">
	function onSubmitInfo(){
		var fwry="${param.fwry}";
		var phoneno=document.getElementById("phoneno");
		document.fm.action="<%=request.getContextPath()%>/rest/promoter/qianQianStock";
		document.fm.submit();
	}

	function checkPhoneNum(obj){
		var regex = /^(1[^012][0-9]{9})$/i;
		alert(regex.test(obj.value)+"   "+obj.value);
		var objErr=document.getElementById("errMsg");
		if(regex.test(obj.value)){
			objErr.style.display="none";
		}else{
			objErr.style.display="";
		}

	}

</script>
</body>

</html>
