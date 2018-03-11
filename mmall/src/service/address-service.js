'use strict';

var _mm = require('util/mm.js');

var _address = {
    // 获取地址列表
    getAddressList : function(resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/list.do'),
            data    :{
                pageSize : 50,
            },
            success : resolve,
            error   : reject
        });
    },

    // 保存收货地址
    save : function(receiverInfo , resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/add.do'),
            data    : receiverInfo,
            success : resolve,
            error   : reject
        });
    },

    //修改地址
    update : function(receiverInfo , resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/update.do'),
            data    : receiverInfo,
            success : resolve,
            error   : reject
        });
    },

    //根据id获取收货地址详情
    getAddress : function (shippingId, resolver, reject) {
        _mm.request({
            url     : _mm.getServerUrl('/shipping/select.do'),
            data    : {
                shippingId : shippingId
            },
            success : resolver,
            error   : reject
        });
    },

    //删除地址
    deleteAddress : function (shippingId , resolver , reject) {
        _mm.request({
            url     : _mm.getServerUrl('/shipping/del.do'),
            data    : {
                shippingId : shippingId
            },
            success : resolver,
            error   : reject
        });
    }
}
module.exports = _address;