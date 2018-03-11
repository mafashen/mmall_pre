'use strict';
var _mm                         = require('util/mm.js');
var _address                    = require('service/address-service.js');
var _cities                     = require('util/cities/index.js')
var templateAddressModal        = require('./address-modal.string');

var addressModal = {
    show : function (option) {
        //option的绑定
        this.option     = option;
        this.$modalWrap = $('.modal-wrap');
        //渲染页面
        this.loadModal();
        //绑定事件
        this.bindEvent();
    },
    bindEvent : function () {
        var _this = this;
        //省份和城市的二级联动
        this.$modalWrap.find('#receiver-province').change(function () {
            var selectedProvince = $(this).var();
            _this.loadCities(selectedProvince);
        });

        //提交收货地址
        this.$modalWrap.find('#address-btn').click(function () {
            var receiverInfo = _this.getReceiverInfo() ,
                isUpdate     =  _this.option.isUpdate;
            //使用新地址,且验证通过
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data , function (res) {
                    _mm.successTips('地址添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                            && _this.option.onSuccess(res);
                } , function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
            //更新地址,且验证通过
            else if(isUpdate && receiverInfo.status){

            }
            //验证不通过
            else{
                _mm.errorTips(receiverInfo.errMsg || '好像哪里不对了~');
            }
        });

        //点击叉号或者蒙版区关闭弹窗
        this.$modalWrap.find('.close').click(function () {
            _this.hide();
        });
        //保证点击内容去的时候不会关闭弹窗
        this.$modalWrap.find('.modal-container').click(function (e) {
            e.stopPropagation();
        });
    },
    //关闭弹窗
    hide : function () {
        this.$modalWrap.empty();
    },

    loadModal : function () {
        var addressModalHtml = _mm.renderHtml(templateAddressModal, this.option.data);
        this.$modalWrap.html(addressModalHtml);
        //加载省份
        this.loadProvince();
        //加载城市
        this.loadCities();
    },

    loadProvince : function () {
        var provinces = _cities.getProvinces() || [] ,
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
    },
    //获取select的选项,输入array,输出html
    getSelectOption : function (optionArray) {
        var html = '<option value="">请选择</option>';
        for(var i = 0 , length = optionArray.length ; i < length; i++){
            html = '<option value="' + optionArray[i] + '">' + optionArray[i] +'</option>';
        }
        return html;
    },
    loadCities : function (provinceName) {
        var cities = _cities.getCities(provinceName) || [] ,
            $citySelect = this.$modalWrap.find('#receiver-city')
        $citySelect.html(this.getSelectOption(cities));
    },

    //获取表单中的收件人信息并验证
    getReceiverInfo : function () {
        var receiverInfo = {} ,
            result = {
                status : false
            };
        receiverInfo.receiverName       = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince   = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity       = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress    = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone      = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip        = $.trim(this.$modalWrap.find('#receiver-zip').val());

        if(!receiverInfo.receiverName){
            result.errMsg = '请输入收件人姓名';
        }else if(!receiverInfo.receiverProvince){
            result.errMsg = '请输入收件人省份';
        }else if(!receiverInfo.receiverCity){
            result.errMsg = '请输入收件人城市';
        }else if(!receiverInfo.receiverPhone){
            result.errMsg = '请输入收件人手机';
        }else if(!receiverInfo.receiverAddress){
            result.errMsg = '请输入收件人详细地址';
        }else{
            result.status   = true;
            result.data     = receiverInfo;
        }
        return result;
    },
};
module.exports=addressModal;