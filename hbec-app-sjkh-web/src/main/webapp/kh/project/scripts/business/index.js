define("project/scripts/business/index",function(require, exports, module){
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        service = require("serviceImp").getInstance(),  //业务层接口，请求数据
        layerUtils = require("layerUtils"),
        gconfig = require("gconfig"),
        global = gconfig.global,
        shellPlugin = require("shellPlugin"),
        utils = require("utils"),
        checkSmsPage = require("checkSmsPage"),
        _pageId = "#business_index";
    /* 私有业务模块的全局变量 end */

    function init()
    {
        console.log('business index init......');
        window.getInput = utils.getInput;  // 暴露调用密码键盘给window
        window.onFinish = utils.onFinish;  // 暴露关闭密码键盘给window
        //处理页面返回问题
    	if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
			utils.closeApp();
		}
        
        //非开户时间跳转到开户须知页面弹框提示
	    $.ajax({
	        type:'post',
	        url:global.serverToukerUrl+"/com.business.function.Function10000",
	        data:{ts:(new Date()).getTime()},
	        async: false,	//同步
	        cache:false,
	        dataType:'json',
	        success:function(data, resp, XMLHttpRequest){
	        	if(data.errorNo == 0){	//调用正常
	        		var errorMsg = data.errorMsg;	//0:开户时间     1:非开户时间
	        		if(errorMsg == "1"){	
	        			 appUtils.pageInit("business/index","account/openAccount",{});
	        			 return;
	        		}else{
	        			goProcess();
	        			
	        		}
	        	}
	        }
	    });
	    
	    
	    function goProcess(){
	      if(utils.isAndroid()) {
	        var data = eval("("+khmobile.getUserInfo()+")");
	        getUserInfo(data);
	      } else {
	        require("shellPlugin").callShellMethod("toukerServerPlugin",function(jsonresult){
	          getUserInfo(jsonresult);
	        },function(data){},{"command":"getUserInfo"});
	      }
	    }
	    

	    function getUserInfo(jsonresult) {
	      // 获取移动端参数手机号、userId
        console.info("jsonresult>>>>"+JSON.stringify(jsonresult));
        if(jsonresult==null || jsonresult.phonenum==null || jsonresult.phonenum==""){
          //证券开户
          $(".m0_18_36_18")[0].style.display = 'block';
          return ;
        }

            utils.getIp();

      //钱钱炒股流程
      appUtils.setSStorageInfo("toukerOpenChannel","qianqian_app");// 设置开户的渠道 
  appUtils.setSStorageInfo("openChannel","new");//开户
      //从钱钱炒股跳过来的一定是已注册投客用户，这里主要是获取该客户的客户号
      var param = {
          "step" : "isToukerUser",
          "mobileNo" : jsonresult.phonenum
      };
      
      if(utils.isAndroid()) {
        var data = khmobile.requestUrlParamsEncoding(utils.jsonToParams(param));
        toukerServerPluginCallback1(data);
      } else {
        require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
          toukerServerPluginCallback1(param);
        },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(param)});
      }
      
      function toukerServerPluginCallback1(param) {
        // 判断是否投客注册用户
        service.hbAjax(param,function(data){
          appUtils.setSStorageInfo("mobileNo",jsonresult.phonenum);// 保存手机号码到缓存中
          //钱钱过来的一定是已经注册过投客网用户    返回有 两种情形：未注册、系统异常  主要是获取客户号
          if(data.errorNo==0 && data.errorMsg=="1"){
            //存储客户号（此时客户可能已经有了客户号）
            var client_id = data.results.dataSet.client_id;
            if(null != client_id){
              //console.log("client_id:"+client_id);
              appUtils.setSStorageInfo("khh",client_id);//将客户号号加入到缓存中 
            }else{
              appUtils.setSStorageInfo("khh",""); //清空客户号
            }
            
            //获取短信验证码验证过程（为了绕开思迪的短信验证，后台只是生产验证码，但不真实的发送短信验证码，因为客户在钱钱已经登录过了）
            var paramOpen = {
                "step" : "qqAccess",
                "channel" : "qianqian_app",
                "mobileNo" : jsonresult.phonenum
            };
            if(utils.isAndroid()) {
              var data=khmobile.requestUrlParamsEncoding(utils.jsonToParams(paramOpen));
              toukerServerPluginCallback2(data,jsonresult);
            } else {
              require("shellPlugin").callShellMethod("toukerServerPlugin",function(param){
                toukerServerPluginCallback2(param,jsonresult);
              },function(data){},{"command":"requestUrlParamsEncoding","params":utils.jsonToParams(paramOpen)});
            }
            
            function toukerServerPluginCallback2(param,jsonresult) {
              // 获取验证码
              service.hbQianqianOpenAjax(param,function(data){
                  //{"errorMsg":"343341","errorNo":0,"results":{"dataSet":null}}
                  if(data.errorNo==0 && data.errorMsg.length >0){
                      checkSmsCode(jsonresult.phonenum,data.errorMsg,client_id); // 思迪校验验证码 
                  }
              });
            }
          }else{ 
            console.log("手机号"+jsonresult.phonenum+"未注册投客网");
            layerUtils.iMsg(-1,"系统异常，请稍后重试！");
          }
        });
      }
	    }
    }

    /* 提交验证码校验 */
    function checkSmsCode(phoneNum,smsCode,khh)
    {
        var login_flag = "0";
		appUtils.setSStorageInfo("mobileNo",phoneNum);
		var paramCheck = {
            "mobile_no" : phoneNum,
            "mobile_code" :smsCode,
            "login_flag" : login_flag  // 登录业务标准，新开户0  转户1  理财户2
        };
       
        //思迪校验
        service.checkSmsCode(paramCheck,function(data){
        	console.log("入参:"+JSON.stringify(paramCheck)+"出参:"+JSON.stringify(data));
            var error_no = data.error_no;
            var error_info = data.error_info;
            var result = data.results;
            if(error_no == "0" && result.length != 0)
            {
        	    appUtils.setSStorageInfo("smsCodeVail", "true");
                console.log("思迪调用完成");
                checkSmsPage.setSessionStorage(result[0]);
                
                 //华宝客户信息校验、关联
	        	 var param = {
		            "step" : "validateCustInfo",
		            "channel" : "qianqian_app",
		            "mobileNo" : phoneNum,
		            "khh" : khh,
		        };
            	checkSmsPage.valiDataCustomeInfo(result[0],param,"business/index");
            }else{
                layerUtils.iMsg(-1,"请输入正确的短信验证码！");
            }
        });
    }

    function bindPageEvent(){
        //掌上开户
        appUtils.bindEvent($(_pageId+" #back"),function(){
        if(appUtils.getSStorageInfo("toukerOpenChannel") == "qianqian_app"){// 返回到钱钱炒股App，三分钟快速开户界面 
				utils.closeApp();
			}
        });
        /* 绑定新开账户  */
        appUtils.bindEvent($(_pageId+" .m0_18_36_18 .text"),function(){
            // 设置标识'new',表示新开户,并且存到local
            appUtils.setSStorageInfo("openChannel","new");
            appUtils.pageInit("business/index","account/openAccount","business/index");
        });
    }

    function destroy(){}
    

    var index = {
        "init" : init,
        "bindPageEvent" : bindPageEvent,
        "destroy" : destroy
    };

    module.exports = index;
});