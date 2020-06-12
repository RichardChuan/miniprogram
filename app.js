const utils = require('./utils/utils.js');
App({
  globalData:{
    // 证件类型字典
    CardType:[],
    // 民族字典
    NationType:[],
    // 工种字典
    WorkType:[]
  },
  onLaunch(){
    utils.storage.Get('Authorization',true)
    .catch(()=>{
      wx.switchTab({
        url:'/pages/my/my'
      });
    })
  },
  onInitData(options){
    let _this = this;
    utils.storage.Get(options.key)
    .then((res)=>{
      _this.globalData[options.key] = res;
    })
    .catch(()=>{
      utils.request({
        url:options.url
      })
      .then((res)=>{
        utils.storage.Set(options.key,res)
        .then(()=>{
          _this.globalData[options.key] = res;
        })
      })
    })
  },
  onOcr(options){
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