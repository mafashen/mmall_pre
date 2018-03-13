'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _order          = require('service/order-service.js');
var templateIndex   = require('./index.string');

// page 逻辑部分
var page = {
    data:{
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        // 初始化左侧菜单
        navSide.init({
            name: 'order-list'
        });
        //加载detail数据
        this.loadDetail();
    },
    bindEvent : function () {
        var _this = this;
        // 取消订单
        $(document).on('click', '.order-cancel', function(){
            // alert(_mm.getUrlParam('orderNumber'));
            if(window.confirm('确定取消该订单么?')){
                _order.cancelOrder(_mm.getUrlParam('orderNumber') , function(res){
                    _mm.successTips('取消订单成功');
                    _this.loadDetail();     //重新加载
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                })
            }
        });
    },

    //加载订单详情
    loadDetail : function () {
        var _this           = this ,
            orderDetailHtml   = '',
            $content        = $('.content');
        $content.html('<div class="loading"></div>')
        _order.getOrderDetail(this.data.orderNumber , function (res) {
            _this.dataFilter(res);
            //渲染模板
            orderDetailHtml = _mm.renderHtml(templateIndex,res);
            $content.html(orderDetailHtml);
        } , function (errMsg) {
            $content.html('<p class="err-tip">' + errMsg + '</p>');
        })
    },
    //数据的适配
    dataFilter : function (data) {
        // alert(data.status);
        data.needPay        = data.status === 10;
        data.isCancelable   = data.status === 10;
    },
};
$(function(){
    page.init();
});