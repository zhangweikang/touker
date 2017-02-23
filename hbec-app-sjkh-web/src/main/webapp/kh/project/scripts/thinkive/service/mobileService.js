/**
 * 非现场手机开户前端service层调用接口
 * */
define(function(require,exports,module){
	var appUtils = require("appUtils"),
	gconfig = require("gconfig"),
	domain = require("domain"),
	service = require("service"),
	global = gconfig.global,
	serverPathTrade = global.serverPath;
	
	function MobileService(){
		this.service = new $.domain.Service();
	}
	
	/***应用接口......................................................开始*/
	
	
	/**
	 * 短信验证码发送(501520)
	 * @param op_way 访问接口来源标识(0：pc,2：pad,3：手机)
	 * @param mobile_no 手机号码
	 * @param ip 客户IP地址
	 * @param mac 设备mac地址
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	MobileService.prototype.getSmsCode = function(param,callback,isLastReq,isShowWait,timeOutFunc)
     {
 	    var paraMap = {};
		paraMap["funcNo"] = "501520";
		paraMap["op_way"] = param.op_way;
		paraMap["mobile_no"] = param.mobile_no;
		paraMap["ip"] = param.ip;
		paraMap["mac"] = param.mac;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
     };
	
     
 	/**
 	 * 登录短信验证码校验(501521)
 	 * @param mobile_no 手机号码
 	 * @param mobile_code 手机验证码
 	 * @param login_flag 登录业务标准
 	 * @param callback 回调函数
 	 */
	MobileService.prototype.checkSmsCode = function(param,callback,isLastReq,isShowWait,timeOutFunc)
      {
  	    var paraMap = {};
 		paraMap["funcNo"] = "501521";
 		paraMap["mobile_no"] = param.mobile_no;
 		paraMap["mobile_code"] = param.mobile_code;
 		paraMap["login_flag"] = param.login_flag;
 		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
      };     
     
     
   	/**
   	 * 查询营业部数据(501503)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryBranch = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501503";
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };     
      
    
   	/**
   	 * 获取数字证书申请责任书协议信息
   	 * @param cert_flag 1中登协议，2自建证书协议,默认中登
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryCertAgreement = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501523";
		paraMap["cert_flag"] = param.cert_flag;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    /**
   	 * 获取邮编信息
   	 * @param addr 地址
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryPostid = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501557";
		paraMap["addr"] = param.addr;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 * 获取数据字典
   	 * @param enum_type "occupational"为职业,"adapter"为学历,"zqzhlx"为开通证券类型
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryDataDict = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501501";
		paraMap["enum_type"] = param.enum_type;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 开户信息资料提交 (501528)
   	 * @param user_id            客户编号
   	 * @param infocolect_channel 信息来源渠道( 0：pc，2：pad，3：手机)
   	 * @param idtype             证件类别(00 身份证)
   	 * @param idno               身份证号
   	 * @param custname           客户姓名
   	 * @param ethnicname         民族
   	 * @param birthday           生日
   	 * @param idbegindate        证件开始日期
   	 * @param idenddate          证件结束日期
   	 * @param native             证件地址
   	 * @param policeorg          签发机关
   	 * @param usersex            性别(0男，1女)
   	 * @param nationality        国籍(156) 
   	 * @param addr               联系地址 
   	 * @param postid             邮政编码
   	 * @param edu                学历代码
   	 * @param profession_code    职业代码
   	 * @param branchno           营业部代码 
   	 * @param commission        佣金代码
   	 * @param provinceno         省份
   	 * @param cityno             城市
   	 * @param ipaddr             IP地址
   	 * @param macaddr            mac地址
   	 * @param recommendno        推荐人号码
   	 * @param callback           回调函数
   	 */
	MobileService.prototype.submitUserInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501528";
		paraMap["user_id"] = param.user_id;
		paraMap["infocolect_channel"] = param.infocolect_channel;
		paraMap["idtype"] = param.idtype;
		paraMap["idno"] = param.idno;
		paraMap["custname"] = param.custname;
		paraMap["ethnicname"] = param.ethnicname;
		paraMap["birthday"] = param.birthday;
		paraMap["idbegindate"] = param.idbegindate;
		paraMap["idenddate"] = param.idenddate;
		paraMap["native"] = param.natives;
		paraMap["policeorg"] = param.policeorg;
		paraMap["usersex"] = param.usersex;
		paraMap["nationality"] = param.nationality;
		paraMap["addr"] = param.addr;
		paraMap["postid"] = param.postid;
		paraMap["edu"] = param.edu;
		paraMap["profession_code"] = param.profession_code;
		paraMap["branchno"] = param.branchno;
		paraMap["commission"] = param.commission;
		paraMap["provinceno"] = param.provinceno;
		paraMap["cityno"] = param.cityno;
		paraMap["ipaddr"] = param.ipaddr;
		paraMap["macaddr"] = param.macaddr;
		paraMap["submitflag"] = param.submitflag;
		paraMap["recommendno"] = param.recommendno;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 账户系统存在性查询(501527)
   	 * @param idtype 证件类型
   	 * @param idno   身份证号码
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryUserInfoExistSys = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501527";
		paraMap["idtype"] = "00";
		paraMap["idno"] = param.idno;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 *  中登查询股东账号是否存在(501553)
   	 * @param user_id 用户ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryUserInfoExistCompy = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501553";
		paraMap["user_id"] = param.user_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 *  转户模拟QQ视频通过同步用户信息专用 (501599)
   	 * @param user_id 用户ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.syncQQUserInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501599";
		paraMap["user_id"] = param.user_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 *  查询离线视频通过状态查询 (501546)
   	 * @param user_id 用户ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryQQOfflineState = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501546";
		paraMap["user_id"] = param.user_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 *  流程更改 (501566)
	 * @param user_id 用户编号 
	 * @param uploadimg_flag  1：身份证上次成功
   	 * @param opacctkind_flag 0：新开，1：转户
   	 */
	MobileService.prototype.queryChangeState = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501566";
		paraMap["user_id"] = param.user_id;
		paraMap["uploadimg_flag"] = param.uploadimg_flag;
		paraMap["opacctkind_flag"] = param.opacctkind_flag;
		paraMap["lastcomplete_step"] = param.lastcomplete_step;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    /**
   	 *  查询用户信息(501567)
	 * @param user_id 用户编号 
   	 */
	MobileService.prototype.queryUserInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501567";
		paraMap["user_id"] = param.user_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
 
   	/**
   	 * 获取数字证书申请责任书协议信息 (501523)
   	 * @param cert_flag 1中登协议，2自建证书协议
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryAgreementTitle = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501523";
		paraMap["cert_flag"] = param.cert_flag;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
   
   	/**
   	 * 中登证书获取（501529）
   	 * @param user_id 客户编号
   	 * @param pkcs10  证书申请串(由手机壳子生成)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryCompyCart = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501529";
		paraMap["user_id"] = param.user_id;
		paraMap["pkcs10"] = encodeURIComponent(param.pkcs10);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
  
   	/**
   	 * 自建证书获取，天威（501530）
   	 * @param user_id 客户编号
   	 * @param pkcs10  证书申请串(由手机壳子生成)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryMyselfCart = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501530";
		paraMap["user_id"] = param.user_id;
		paraMap["pkcs10"] = encodeURIComponent(param.pkcs10);
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 *  开户协议列表获取(501531)--证书下载界面
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenAgreement = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501531";
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    /**
   	 * 开立资金账户与客户号(501533)
   	 * @param user_id 客户编号
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenAccount = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501533";
		paraMap["user_id"] = param.user_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
   	/**
   	 * 开立中登账户(501534)
   	 * @param user_id 客户编号
   	 * @param sza_str 深A开通情况
   	 * @param sha_str 沪A开通情况
   	 * @param szfnd_str 深基金开通情况
   	 * @param shfnd_str 沪基金开通情况
   	 * @param opfnd_str 沪基金开通情况
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenCompyAccount = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501534";
		paraMap["user_id"] = param.user_id;
		paraMap["sza_str"] = param.sza_str;
		paraMap["sha_str"] = param.sha_str;
		paraMap["szfnd_str"] = param.szfnd_str;
		paraMap["shfnd_str"] = param.shfnd_str;
		paraMap["opfnd_str"] = param.opfnd_str;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 中登签名批量验签（MD5方式）(501554)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenCheckSign = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501554";
		paraMap["user_id"] = param.user_id;
		paraMap["jsondata"] = param.jsondata;
		paraMap["ipaddr"] = param.ipaddr;
		paraMap["macaddr"] = param.macaddr;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    /**
   	 * 天威签名批量验签（MD5方式）(501555)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryOpenCheckTsign = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501555";
		paraMap["user_id"] = param.user_id;
		paraMap["jsondata"] = param.jsondata;
		paraMap["ipaddr"] = param.ipaddr;
		paraMap["macaddr"] = param.macaddr;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 查询协议内容 (501524)
   	 * @param protocol_id 协议ID
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryProtocolText = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501524";
		paraMap["protocol_id"] = param.protocol_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 设置交易密码和资金密码(501535)
   	 * @param user_id        用户编号
   	 * @param acct_clientid  账户系统客户号
   	 * @param password  密码
   	 * @param pwd_type  密码类型(1:资金密码 2:交易密码)
   	 * @param is_same  资金密码和交易密码是否一致(1:一致 0：不同)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.setAccountPwd = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501535";
		paraMap["user_id"] = param.user_id;
		paraMap["acct_clientid"] = param.acct_clientid;
		paraMap["password"] = param.password;
		paraMap["pwd_type"] = param.pwd_type;
		paraMap["is_same"] = param.is_same;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 查询存管银行信息列表(501536)
   	 * @param user_id     用户编号
   	 * @param zzbindtype  自助绑定方式(1一步式，2预指定)
   	 * @param zzispwd     自助一步式绑定是否需要密码(1需要，0不需要)
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryBankList = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var paraMap = {};
		paraMap["funcNo"] = "501536";
		paraMap["bindtype"] = param.bindtype;
		paraMap["ispwd"] = param.ispwd;
		paraMap["step"] = param.step;
		paraMap["bankCode"] = param.bankCode;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 存管银行签约电子协议列表(501537)
   	 * @param user_id     用户编号
   	 * @param bankcode    银行代码
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.queryBankProtocolList = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var paraMap = {};
		paraMap["funcNo"] = "501537";
		paraMap["bank_code"] = param.bank_code;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 
    
    
   	/**
   	 * 存管银行绑定(501538)
   	 * @param user_id          用户编号
   	 * @param acct_clientid    账户系统客户号
   	 * @param acct_fndacct     账户系统资金账号
   	 * @param bank_code	       银行代码
   	 * @param bank_account     银行账号
   	 * @param bank_pwd         银行密码
   	 * @param op_type          存管绑定方式(自助绑定方式：1一步式，2预指定)
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.bindBank = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
		var paraMap = {};
		paraMap["funcNo"] = "501538";
		paraMap["user_id"] = param.user_id;
		paraMap["acct_clientid"] = param.acct_clientid;
		paraMap["acct_fndacct"] = param.acct_fndacct;
		paraMap["bank_code"] = param.bank_code;
		paraMap["bank_account"] = param.bank_account;
		paraMap["bank_pwd"] = param.bank_pwd;
		paraMap["op_type"] = param.op_type;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
    
   	/**
   	 * 驳回后修改资料 (501561)
   	 * @param userid     用户编号
   	 * @param fieldname   驳回步骤(zj_pwd资金密码、trade_pwd交易密码、bind_bank三方存管、photo图片、workflowagain重新走流程、opacctkind_flag开户流程业务类型)
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.rejectStep = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501561";
		paraMap["userid"] = param.userid;
		paraMap["fieldname"] = param.fieldname;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
  
   	/**
   	 * 查询风险评测题库(501539)
   	 * @param user_id     用户编号
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.queryRiskToc = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501539";
		paraMap["user_id"] = param.user_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };  
    
    
   	/**
   	 * 获取视频地址 (501562)
   	 * @param user_id     用户编号
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.queryVideoAddress = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501562";
		paraMap["userid"] = param.userid;
		paraMap["branchno"] = param.branchno;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
    
   	/**
   	 * 提交视频见证预约信息(501545)
   	 * @param user_id     用户编号
   	 * @param qq          QQ号码
   	 * @param deal_date   预约处理日期
   	 * @param deal_time   预约处理时间
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.submitQQApplay = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501545";
		paraMap["user_id"] = param.user_id;
		paraMap["qq"] = param.qq;
		paraMap["deal_date"] = param.deal_date;
		paraMap["deal_time"] = param.deal_time;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
    
   	/**
   	 * 获取回访问卷(501541)
   	 * @param user_id     用户编号
   	 * @param qq          QQ号码
   	 * @param sub_id       
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.getVisitSub = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501541";
		paraMap["user_id"] = param.user_id;
		paraMap["sub_id"] = param.sub_id;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
    
   	/**
   	 * 提交问卷回访答案(501542)
   	 * @param user_id     用户编号
   	 * @param sub_id      回访问卷编号
   	 * @param q_a_args    问卷答题字符串
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.submitVisitAnswer = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501542";
		paraMap["user_id"] = param.user_id;
		paraMap["sub_id"] = param.sub_id;
		paraMap["q_a_args"] = param.q_a_args;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
   	/**
   	 * 提交风险评测答案(501540)
   	 * @param user_id     用户编号
   	 * @param sub_id      回访问卷编号
   	 * @param q_a_args    问卷答题字符串
   	 * @param callback    回调函数
   	 */
	MobileService.prototype.submitTestAnswer = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501540";
		paraMap["user_id"] = param.user_id;
		paraMap["sub_id"] = param.sub_id;
		paraMap["q_a_args"] = param.q_a_args;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };   
    
    
    /**
   	 *	查询电子协议列表(501558)
   	 * @param category_englishname 电子协议英文名
   	 * @param category_no 类别编号
   	 * @param econtract_no 协议编号
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.queryProtocolList = function(param,callback,isLastReq,isShowWait,timeOutFunc)
	{
		var paraMap = {};
		paraMap["funcNo"] = "501558";
		paraMap["category_englishname"] = param.category_englishname;
		paraMap["category_no"] = param.category_no;
		paraMap["econtract_no"] = param.econtract_no;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
	}
	
	/**
   	 *	查询电子协议内容(501559)
   	 * @param econtract_no 电子协议编号
   	 * @param econtract_version 电子协议版本
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getProtocolInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
	{
		var paraMap = {};
		paraMap["funcNo"] = "501559";
		paraMap["econtract_no"] = param.econtract_no;
		paraMap["econtract_version"] = param.econtract_version;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
	}
	
	/**
   	 *	移动客户端版本检测 (501560)
   	 * @param terminal_type 客户端类型
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getVersion = function(param,callback,isLastReq,isShowWait,timeOutFunc)
	{
		var paraMap = {};
		paraMap["funcNo"] = "501560";
		paraMap["terminal_type"] = param.terminal_type;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
	}
	
	/**
   	 * 获取当前省份、城市（501568）
   	 * @param ip  ip地址
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getProvCity = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501568";
		paraMap["ip"] = param.ip;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };  
    
    /**
   	 * 身份证信息提交 (501569)
   	 * @param user_id            客户编号
   	 * @param infocolect_channel 信息来源渠道( 0：pc，2：pad，3：手机)
   	 * @param idtype             证件类别(00 身份证)
   	 * @param idno               身份证号
   	 * @param custname           客户姓名
   	 * @param ethnicname         民族
   	 * @param birthday           生日
   	 * @param idbegindate        证件开始日期
   	 * @param idenddate          证件结束日期
   	 * @param native             证件地址
   	 * @param policeorg          签发机关
   	 * @param usersex            性别(0男，1女)
   	 * @param nationality        国籍(156) 
   	 * @param addr               联系地址 
   	 * @param postid             邮政编码
   	 * @param edu                学历代码
   	 * @param profession_code    职业代码
   	 * @param branchno           营业部代码 
   	 * @param commission        佣金代码
   	 * @param provinceno         省份
   	 * @param cityno             城市
   	 * @param ipaddr             IP地址
   	 * @param macaddr            mac地址
   	 * @param callback           回调函数
   	 */
	MobileService.prototype.submitPhoto = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501569";
		paraMap["user_id"] = param.user_id;
		paraMap["infocolect_channel"] = param.infocolect_channel;
		paraMap["idtype"] = param.idtype;
		paraMap["idno"] = param.idno;
		paraMap["custname"] = param.custname;
		paraMap["ethnicname"] = param.ethnicname;
		paraMap["birthday"] = param.birthday;
		paraMap["idbegindate"] = param.idbegindate;
		paraMap["idenddate"] = param.idenddate;
		paraMap["native"] = param.natives;
		paraMap["policeorg"] = param.policeorg;
//		paraMap["usersex"] = param.usersex;
		paraMap["nationality"] = param.nationality;
		paraMap["addr"] = param.addr;
		paraMap["postid"] = param.postid;
		paraMap["edu"] = param.edu;
		paraMap["profession_code"] = param.profession_code;
		paraMap["branchno"] = param.branchno;
		paraMap["commission"] = param.commission;
		paraMap["provinceno"] = param.provinceno;
		paraMap["cityno"] = param.cityno;
		paraMap["ipaddr"] = param.ipaddr;
		paraMap["macaddr"] = param.macaddr;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    }; 

	 /**
   	 * 获取rsa加密模块和公钥
   	 * @param param  参数
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getRSAKey = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "1000000";
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };  
   /**
   	 * 获取视频见证时间的标识[501500]
   	 * 返回istradetime  为1  就是在这个时间内  0 就不再这个时间内
   	 * @param param  参数
   	 * @param callback 回调函数
   	 */
	MobileService.prototype.getIstradetime = function(param,callback,isLastReq,isShowWait,timeOutFunc)
    {
	    var paraMap = {};
		paraMap["funcNo"] = "501500";
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
    };

	/**
	 * 登陆获取用户简单信息[500000]
	 *
	 * @param param  参数
	 * @param callback 回调函数
	 */
	MobileService.prototype.loginInfo = function(param,callback,isLastReq,isShowWait,timeOutFunc)
	{
		var paraMap = {};
		paraMap["funcNo"] = "500000";
		paraMap["moblie_no"] = param.mobileNo;
		var reqParamVo = $.getReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		reqParamVo.setReqParam(paraMap);
		reqParamVo.setIsLastReq((typeof(isLastReq)=="undefined"||isLastReq==="")?true:isLastReq);
		reqParamVo.setIsShowWait((typeof(isShowWait)=="undefined"||isShowWait==="")?true:isShowWait);
		reqParamVo.setTimeOutFunc(timeOutFunc);
		this.service.invoke(reqParamVo,callback);
	};
	/***应用接口......................................................结束*/
	
	/* 释放操作*/
	MobileService.prototype.destroy = function(){
		this.service.destroy();
	};
	
	/* 实例化对象 */
	function getInstance(){
		return new MobileService();
	}
	
	var mobileService = {
		"getInstance" : getInstance
	};
	
	// 暴露对外的接口
	module.exports = mobileService;
});