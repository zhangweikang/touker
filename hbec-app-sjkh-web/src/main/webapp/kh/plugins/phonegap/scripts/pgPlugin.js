define(function(require,exports,module){function a(a,b,c,d){try{cordova.exec(function(a){null!=b&&b(a)},function(a){null!=c?c(a):(g.iLoading(!1),g.iAlert("插件调用失败:"+a))},a,a,[d])}catch(e){g.iLoading(!1),g.iAlert("不支持phonegap！")}}function b(){require("gconfig").global.isOnline=!1,a("toastPlugin",null,function(){g.iMsg(-1,"网络不可用，请检查您的网络设置!")},{content:"网络不可用，请检查您的网络设置!",type:0})}function c(){require("gconfig").global.isOnline=!0,a("toastPlugin",null,function(){g.iMsg(-1,"网络连接正常")},{content:"网络连接正常",type:0})}function d(){var b=function(){a("closeAppPlugin",null,null,{})};a("toastPlugin",null,function(){g.iConfirm("确认退出应用程序？",function(){a("closeAppPlugin",null,null,{})},function(){window.clearTimeout(c),document.removeEventListener("backbutton",b,!1),document.addEventListener("backbutton",e,!1)})},{content:"再按一次退出开户程序",type:0}),document.removeEventListener("backbutton",e,!1),document.addEventListener("backbutton",b,!1);var c=window.setTimeout(function(){window.clearTimeout(c),document.removeEventListener("backbutton",b,!1),document.addEventListener("backbutton",e,!1)},2500)}function e(){if(require("gconfig").isDirectExit)d();else{var a=$(".page[data-display=block]").attr("data-pageLevel");if("2"==a)d();else{var b=require("appUtils").getSStorageInfo("_curPageCode");b=b&&"null"!=b?b:"",require.async(require("gconfig").scriptsPath+b,function(a){a.pageBack?a.pageBack():require("appUtils").pageBack()})}}}function f(){require("gconfig").global.isOnline=!0,document.addEventListener("offline",b,!1),document.addEventListener("online",c,!1),document.addEventListener("backbutton",e,!1)}var g=require("layerUtils"),h={onDeviceReady:f,callShellMethod:a};module.exports=h});