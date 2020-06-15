const app = getApp();
const utils = require('../../utils/utils');
let oper = '';
Page({
  data: {
    // 是否可用
    IsDisabled:false,
    // 提示信息
    tips:{
      type:'',
      msg:''
    },
    // 姓名
    Name : '',
    // 性别
    Sex : 'M',
    // 住址
    Address : '',
    // 身份证号
    CardCode : '',
    // 证件类型字典
    CardType:[],
    // 证件类型默认选项索引
    CardIndex:0,
    // 民族字典
    NationType:[],
    // 民族默认选项索引
    NationIndex:12,
  },
  onLoad(options){
    let _this = this;
    if(!_this.data.CardType.length){
      app.onInitData({
        key:'CardType',
        url:'/api/app/dictItem/cardType'
      })
      .then(()=>{
        _this.setData({
          CardType:app.globalData.CardType
        })
      })
    }
    if(!_this.data.NationType.length){
      app.onInitData({
        key:'NationType',
        url:'/api/app/dictItem/nationType'
      })
      .then(()=>{
        _this.setData({
          NationType:app.globalData.NationType
        })
      })
    }

    // _this.setData({
    //   CardType:app.globalData.CardType,
    //   NationType:app.globalData.NationType
    // })

    if(options.idCard != undefined){
      let idCard = JSON.parse(options.idCard);
      _this.setData({
        Name:idCard.name.text,
        Sex:idCard.gender.text=='男'?'M':'F',
        Address:idCard.address.text,
        CardCode:idCard.id.text,
        IsDisabled:true
      })
    }
    
  },
  // 修改表单的值
  onChange(e){
    let target = e.currentTarget.dataset.target;
    let value = e.detail.value;
    this.setData({
      [target]:value
    })
  },
  onEdit(){
    this.setData({
      IsDisabled:false
    })
  },
  // 添加数据
  onAdd(){
    let _this = this;
    
    if(!_this.data.Name || !_this.data.CardCode || !_this.data.Address){
      _this.setData({
        tips:{
          type:'error',
          msg:'身份信息不全，请填写'
        }
      })
      return false;
    }
    let data = {
      Name:this.data.Name,
      Sex:this.data.Sex,
      NationType:this.data.NationType[this.data.NationIndex].Id,
      CardType:this.data.CardType[this.data.CardIndex].Id,
      CardCode:this.data.CardCode,
      Address:this.data.Address
    }
    wx.showLoading({
      title: '请稍后',
    });
    utils.request({
      url:'/api/app/employee',
      method:'post',
      data
    })
    .then(()=>{
      wx.hideLoading();
      _this.setData({
        tips:{
          type:'success',
          msg:'添加成功'
        }
      })
      // wx.redirectTo({
      //   url:'/pages/staff/staff',
      // });
    })
    .catch((err)=>{
      console.log(err);
      wx.hideLoading();
      _this.setData({
        tips:{
          type:'error',
          msg:err.data.Error.Message
        }
      })
    })
  }
})