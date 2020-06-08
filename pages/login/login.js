const utils = require('../../utils/utils.js');
Page({
  data:{
    isView:false,
  },
  onTap(){
    let isView = !this.data.isView;
    this.setData({
      isView
    })
  },
  onSubmit(e){
    if(!e.detail.value.UserName || !e.detail.value.Password){
      wx.showToast({
        title:'账号名密码错误,请重试',
        icon: 'none',
        duration:1000,
      });
      return false;
    }

    utils.request({
      url:'/api/account/weixin/auth',
      method:'post',
      data:e.detail.value,
    },false)
    .then(function(res){
      let Authorization = res.token_type + ' ' + res.access_token;
      let icmtenant = res.tenant_id;
      wx.setStorageSync('UserName',e.detail.value.UserName);
      wx.setStorageSync('Password',e.detail.value.Password);
      wx.setStorageSync('Authorization',Authorization);
      wx.setStorageSync('icmtenant',icmtenant);
      wx.showToast({
        title:'登录成功',
        icon: 'none',
        duration:1000,
      });
      wx.switchTab({
        url: '/pages/index/index'
      });
    })
    .catch(function(err){
      wx.showToast({
        title:err.msg,
        icon: 'none',
        duration:1000,
      });
    })
  }
})