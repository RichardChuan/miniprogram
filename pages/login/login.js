const app = getApp();
const utils = require('../../utils/utils');
Page({
  data:{
    isView:false,
  },
  onSwitch(){
    let isView = !this.data.isView;
    this.setData({
      isView
    })
  },
  onSubmit(e){
    if(!e.detail.value.UserName || !e.detail.value.Password){
      utils.toast({
        title:'账号名密码错误,请重试'
      })
      return false;
    }

    utils.request({
      url:'/api/account/weixin/auth',
      method:'post',
      data:e.detail.value,
    },false)
    .then((res)=>{
      utils.storage.Set('UserName',e.detail.value.UserName,true);
      utils.storage.Set('Password',e.detail.value.Password,true);
      utils.storage.Set('Authorization',(res.token_type + ' ' + res.access_token),true);
      utils.storage.Set('icmtenant',res.tenant_id,true);
      utils.toast({
        title:'登录成功'
      })
      .then(()=>{
        wx.switchTab({
          url: '/pages/index/index'
        });
      });
    })
    .catch((err)=>{
      utils.toast({
        title:err.msg
      });
    })
  }
})