define(function(require,exports,module){function a(a){var b=this;this.setCssHW=function(){if(a.isPagingType){var b=a.rowNum*a.perRowHeight+(a.isHasHead?a.headRowHeight:0);a.container.css({position:"relative",height:b+"px"})}else a.container.css({position:"relative",height:a.visibleHeight+"px"})},this.refresh=function(b){if(a.isPagingType&&b){var c=(b?b:a.rowNum)*a.perRowHeight+(a.isHasHead?a.headRowHeight:0);a.container.css({position:"relative",height:c+"px"})}a.wrapperObj.refresh()},this.init=function(){function c(b){"up"==b?a.upHandle&&a.upHandle():a.downHandle&&a.downHandle()}b.setCssHW(),a.wrapper.find(".visc_pullDown .visc_pullDownTime").html((new Date).format("HH:mm:ss")),a.wrapper.find(".visc_pullUp .visc_pullUpTime").html((new Date).format("HH:mm:ss")),a.wrapper.find(".visc_pullDown").show(),a.wrapper.find(".visc_pullUp").show();var d,e,f,g;return a.wrapper[0]?(d=a.wrapper[0].querySelector(".visc_pullDown"),e=40,f=a.wrapper[0].querySelector(".visc_pullUp"),g=40,null!=a.wrapperObj&&(a.wrapperObj.destroy(),a.wrapperObj=null),setTimeout(function(){var b=require("iscroll");a.wrapperObj=new b(a.wrapper[0],{hScroll:!1,hScrollbar:!1,vScrollbar:!a.isPagingType,topOffset:e,onBeforeScrollStart:function(a){var b=a.explicitOriginalTarget?a.explicitOriginalTarget.nodeName.toLowerCase():a.target?a.target.nodeName.toLowerCase():"";"select"!=b&&"option"!=b&&"input"!=b&&"textarea"!=b&&a.preventDefault()},onRefresh:function(){d.className.match("visc_pullDown visc_loading")?(d.className="visc_pullDown",d.querySelector(".visc_pullDownLabel").innerHTML="下拉加载上一页",d.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss")):f.className.match("visc_pullUp visc_loading")&&(f.className="visc_pullUp",f.querySelector(".visc_pullUpLabel").innerHTML="上拉加载下一页",f.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"))},onScrollMove:function(){a.isPagingType||!a.isPagingType&&a.visibleHeight>a.wrapper.find(".visc_scroller").height()?this.distY>50&&this.absDistY>this.absDistX+5?(d.className="visc_pullDown visc_flip",d.querySelector(".visc_pullDownLabel").innerHTML="释放可以更新",d.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss"),this.minScrollY=0):this.distY>0&&this.distY<50&&this.absDistY>this.absDistX+5?(d.className="visc_pullDown",d.querySelector(".visc_pullDownLabel").innerHTML="下拉加载上一页",d.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss"),this.minScrollY=-e):this.distY<-50&&this.absDistY>this.absDistX+5?(f.className="visc_pullUp visc_flip",f.querySelector(".visc_pullUpLabel").innerHTML="释放可以更新",f.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"),this.maxScrollY=this.maxScrollY):this.distY<0&&this.distY>-50&&this.absDistY>this.absDistX+5&&(f.className="visc_pullUp",f.querySelector(".visc_pullUpLabel").innerHTML="上拉加载下一页",f.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"),this.maxScrollY=g):this.y>5&&!d.className.match("visc_pullDown visc_flip")?(d.className="visc_pullDown visc_flip",d.querySelector(".visc_pullDownLabel").innerHTML="释放可以更新",d.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss"),this.minScrollY=0):this.y<5&&d.className.match("visc_pullDown visc_flip")?(d.className="visc_pullDown",d.querySelector(".visc_pullDownLabel").innerHTML="下拉加载上一页",d.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss"),this.minScrollY=-e):this.y<this.maxScrollY-5&&!f.className.match("visc_pullUp visc_flip")?(f.className="visc_pullUp visc_flip",f.querySelector(".visc_pullUpLabel").innerHTML="释放可以更新",f.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"),this.maxScrollY=this.maxScrollY):this.y>this.maxScrollY+5&&f.className.match("visc_pullUp visc_flip")&&(f.className="visc_pullUp",f.querySelector(".visc_pullUpLabel").innerHTML="上拉加载下一页",f.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"),this.maxScrollY=g)},onScrollEnd:function(){d.className.match("visc_pullDown visc_flip")?(d.className="visc_pullDown visc_loading",d.querySelector(".visc_pullDownLabel").innerHTML="加载数据中...",d.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss"),c("down",a.wrapper)):f.className.match("visc_pullUp visc_flip")&&(f.className="visc_pullUp visc_loading",f.querySelector(".visc_pullUpLabel").innerHTML="加载数据中...",f.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"),c("up",a.wrapper))}})},0),setTimeout(function(){a.wrapper[0].style.left="0"},200),void 0):(console.log("请检查wrapper元素是否正确！"),!1)},this.destroy=function(){null!=a.wrapperObj&&(a.wrapperObj.destroy(),a.wrapperObj=null)},b.init()}module.exports=a});