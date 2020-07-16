const utils = require('../../utils/utils');
Page({
  data:{
    num:200,
    content:'',
    
  },
  onChange(e){
    let _this = this;
    let content = e.detail.value;
    let len = content.length;
    _this.setData({
      num:200-len,
      content
    })
  },
  onSubmit(){
    let _this = this;
    let content = _this.data.content.replace(/^\s+|\s+$/g,'');
    let len = content.length;
    _this.showModalFn({
      content:'请确认您是否提交反馈信息',
    })
    .then(()=>{
      if(!len){
        _this.showModalFn({
          content:'出现异常，是否返回首页',
        })
        .then(()=>{
          wx.switchTab({url:'/pages/index/index'});
        })
        return false;
      }
      utils.request({
        url:'/api/app/feedBack',
        method:'post',
        data:{
          content
        }
      })
      .then(()=>{
        wx.switchTab({url:'/pages/index/index'});
      })
      .catch(()=>{
        _this.showModalFn({
          content:'出现异常，是否返回首页',
        })
        .then(()=>{
          wx.switchTab({url:'/pages/index/index'});
        })
      })
    })
  },
  showModalFn(options={}){
    return new Promise((resolve,reject)=>{
      const{
        content,
        success,
        fail
      } = options;
      wx.showModal({
        title:'友情提示',
        content,
        showCancel:true,
        cancelText:'取消',
        cancelColor:'#333',
        confirmText:'确定',
        confirmColor:'#3b77e3',
        success(res){
          if(res.confirm){
            if(success){
              resolve(res);
            }
            resolve(res);
          }
        }
      });
    })
  }
})