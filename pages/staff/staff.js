const app = getApp();
let utils = require('../../utils/utils')

Page({
  data:{
    tips:{
      type:'',
      msg:''
    },
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
        utils.toast({
          title:'功能开发中'
        })
        break;
      case 'route':
        wx.navigateTo({
          url:attr
        })
        break;
      case 'event':
        this.getEvent(attr);
    }
  },
  getEvent(event){
    let _this = this;
    wx.chooseImage({
      count:1,
      success(res){
        if(event == 'ocr'){
          wx.showLoading({
            title:'信息识别中',
            mask:true
          });
          app.getOcr({
            filePath:res.tempFilePaths[0],
            ocrType:1 // 1为身份证
          })
          .then(function(res){
            let idCardRes = res.data.idcard_res;
            let type = idCardRes.type;
            let idCard = JSON.stringify(idCardRes);
            console.log(idCard);
            if(type == 0){
              wx.navigateTo({
                url:'/pages/staffAdd/staffAdd?idCard='+idCard
              })
            }else{
              wx.hideLoading();
              _this.setData({
                tips:{
                  type:'error',
                  msg:'信息识别失败，请重新识别'
                }
              })
            }
          }).catch(function(){
            wx.hideLoading();
            _this.setData({
              tips:{
                type:'error',
                msg:'信息识别失败，请重新识别'
              }
            })
          })
        }
      }
    })
  }
})
