/**
 * touker注册协议
 */
define("project/scripts/account/toukerSignProtocol",function(require, exports, module){
    /* 私有业务模块的全局变量 begin */
    var appUtils = require("appUtils"),
        utils = require("utils"),
        _pageId = "#account_toukerSignProtocol";
    /* 私有业务模块的全局变量 end */

    function init()
    {
        //加载样式
        $(_pageId+" .page").height($(window).height());
        $(_pageId+" .mainPage").height($(window).height()-45).css({overflow:"auto"});
    }

    function bindPageEvent()
    {
        /* 绑定返回事件 */
        appUtils.bindEvent($(_pageId+" .header .icon_back"),function(){
            appUtils.pageInit("account/toukerSignProtocol","account/phoneToukerRegister",{});
        });

        /* 绑定退出按钮*/
        appUtils.bindEvent($(_pageId+" .header .icon_close"),function(){
            utils.layerTwoButton("退出系统？","确认","取消",function(){
                utils.closeApp();
            },
            function(){return false;});
        });

    }

    module.exports = {
        "init": init,
        "bindPageEvent": bindPageEvent
    };
});