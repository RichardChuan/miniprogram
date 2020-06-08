const app = getApp();
let utils = require('../../utils/utils')

Page({
  data:{
    listItem:[
      {
        img:'/images/icon/ico-scan.png',
        title:'OCR识别',
        note:'高效识别身份信息，快速查询人员个人详情，并及时更新。',
        type:'event',
        attr:'ocr'
      },
      {
        img:'/images/icon/ico-list.png',
        title:'人员列表',
        note:'您可以查看所有已录入人员列表，并查询指定人员信息。',
        type:'route',
        attr:'/pages/staffList/staffList'
      },
      {
        img:'/images/icon/ico-add.png',
        title:'手动添加',
        note:'当OCR无法正确识别时，您可选择手动输入。',
        type:'route',
        attr:'/pages/staffAdd/staffAdd'
      },
      {
        img:'/images/icon/ico-record.png',
        title:'身份证备案',
        note:'拍照前请确认身份证清晰',
        type:'toast',
      }
    ],
  },
  onShow(){
    this.onSetArr('NationArr','/api/app/dictItem/nationType')
    this.onSetArr('CardArr','/api/app/dictItem/cardType')
    this.onSetArr('WorkArr','/api/app/dictItem/workType')
  },
  onSetArr(key,url){
    let array = wx.getStorageSync(key) || [];
    if(array.length == 0){
      utils.request({
        url
      })
      .then(function(res){
        wx.setStorageSync(key,res);
      })
    }
  },
  onTap(e){
    let type = e.currentTarget.dataset.type;
    let attr = e.currentTarget.dataset.attr;
    switch(type){
      case 'toast':
        this.onToast();
        break;
      case 'route':
        this.onRoute(attr);
        break;
      case 'event':
        this.onEvent(attr);
    }
  },
  onToast(){
    wx.showToast({
      title:'功能开发中',
      icon:'none',
      mask:true
    })
  },
  onRoute(routes){
    wx.navigateTo({
      url:routes
    })
  },
  onEvent(event){
    wx.chooseImage({
      count:1,
      success(res){
        if(event == 'ocr'){
          wx.showLoading({
            title:'信息识别中',
            mask:true
          });
          wx.serviceMarket.invokeService({
            service:'wx79ac3de8be320b71',
            api:'OcrAllInOne',
            data:{
              img_url:new wx.serviceMarket.CDN({
                type:'filePath',
                filePath:res.tempFilePaths[0],
              }),
              data_type:3,
              ocr_type:1
            },
          }).then(function(res){
            let idCard_res = res.data.idcard_res;
            let type = idCard_res.type;
            if(type == 0){
              let idCard = {
                Name:idCard_res.name.text,
                Sex:idCard_res.gender.text=='男'?'M':'F',
                NationText:idCard_res.nationality.text,
                CardCode:idCard_res.id.text,
                Address:idCard_res.address.text,
                isOcr:true
              }
              let idCardJson = JSON.stringify(idCard);
              wx.navigateTo({
                url:'/pages/staffAdd/staffAdd?idCardJson='+idCardJson
              });
            }else{
              wx.hideLoading();
              wx.showModal({
                title:'提示',
                content:'信息识别失败，请重新提交',
              })
            }
          }).catch(function(){
            wx.hideLoading();
            wx.showModal({
              title:'提示',
              content:'信息识别失败，请重新提交',
            })
          })
        }
      },
      fail(err){
        console.log(err);
      }
    })
  }
})
