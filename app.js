const utils = require('./utils/utils.js');
App({
  data:{
    workType:[],
    nationType:[],
    cardType:[]
  },
  onLaunch(){
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
  getOcr(options){
    return wx.serviceMarket.invokeService({
      service:'wx79ac3de8be320b71',
      api:'OcrAllInOne',
      data:{
        img_url:new wx.serviceMarket.CDN({
          type:'filePath',
          filePath:options.filePath,
        }),
        data_type:3,
        ocr_type:options.ocrType
      },
    })
  }
})