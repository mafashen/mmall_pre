'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _payment        = require('service/payment-service.js');
var templateIndex   = require('./index.string');

// page 逻辑部分
var page = {
    data:{
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
    },
    onLoad : function(){
        this.loadPaymentInfo();
    },

    loadPaymentInfo : function () {
        var _this           = this ,
            paymentHtml   = '',
            $pageWrap        = $('.pay-wrap');
        $pageWrap.html('<div class="loading"></div>')
        _payment.getPaymentInfo(this.data.orderNumber , function (res) {
            //渲染模板
            paymentHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentHtml);

            _this.listenOrderStatus();
        } , function (errMsg) {
            $pageWrap.html('<p class="err-tip">加载订单失败，请刷新后重试</p>');
        })
    },

    //监听支付状态
    listenOrderStatus : function () {
        var _this = this;
        this.paymentTime = window.setInterval(function () {
            _payment.getPaymentStatus(_this.data.orderNumber, function (res) {
                if (res == true) {
                    window.location.href = './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
                }
            })
        }, 5000);
    }
};
$(function(){
    page.init();
});