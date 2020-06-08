const utils = require('./utils/utils.js');
App({
  data:{
    workType:[],
    nationType:[],
    cardType:[]
  },
  onShow:function(){
    utils.storage.Get('Authorization',true)
    .then(()=>{
      wx.switchTab({
        url:'/pages/index/index',
      });
    })
    .catch(()=>{
      wx.redirectTo({
        url:'/pages/login/login',
      });
    })
  },
  getToast(options){
    return Promise((resolve,reject)=>{
      const {} = options;
      wx.showToast({
        title:options.title,
        icon:'none',
        image:'',
        duration:1500,
        mask:false,
        success:(result)=>{
          
        },
        fail:()=>{},
        complete:()=>{}
      });
    })
  }

})