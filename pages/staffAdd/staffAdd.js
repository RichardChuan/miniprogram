const app = getApp();
const utils = require('../../utils/utils');
let oper = '';
Page({
  data: {
    // 是否可用
    IsDisabled:false,
    // 提示信息
    Tips:{
      type:'',
      msg:''
    },
    // 姓名
    Name:'',
    // 性别
    Sex:'M',
    // 住址
    Address:'',
    // 身份证号
    CardCode:'',
    // 证件类型字典
    CardType:[],
    // 证件类型默认选项索引
    CardIndex:0,
    // 民族字典
    NationType:[],
    // 民族默认选项索引
    NationIndex:12,
  },
  onLoad(e){



      app.onInitData({
        key:'CardType',
        url:'/api/app/dictItem/cardType'
      })
      .then(()=>{
          app.onInitData({
            key:'NationType',
            url:'/api/app/dictItem/nationType'
          })
          .then(()=>{
              app.onInitData({
                key:'WorkType',
                url:'/api/app/dictItem/workType'
              })
              .then(()=>{




    
    let _this = this;
    let idCard = e.idCard?JSON.parse(e.idCard):{};
    let NationIndex = 12;
    let NationType = app.globalData.NationType;
    console.log(NationType);
    let CardIndex = 0;
    let CardType = app.globalData.CardType;
    console.log(CardType);
    let IsDisabled;
    if(Object.keys(idCard).length != 0){
      NationType.map(function(e,i){
        if(e.DictName.indexOf(idCard.nationality.text) != -1) NationIndex = i;
      })
      IsDisabled=true;
    }else{
      idCard.name = {};
      idCard.gender = {};
      idCard.address = {};
      idCard.id = {};
      idCard.name.text='';
      idCard.gender.text='男';
      idCard.address.text='';
      idCard.id.text='';
      IsDisabled=false;
    }
    _this.setData({
      Name:idCard.name.text,
      Sex:idCard.gender.text=='男'?'M':'F',
      Address:idCard.address.text,
      CardCode:idCard.id.text,
      IsDisabled:IsDisabled,
      NationIndex,
      CardIndex,
      NationType,
      CardType
    })



})
})
})



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
  onSubmit(){
    let _this = this;
    if(!_this.data.Name || !_this.data.CardCode || !_this.data.Address){
      _this.setData({
        Tips:{
          type:'error',
          msg:'身份信息不全，请填写'
        }
      })
      return false;
    }
    wx.showLoading({
      title: '请稍后',
    });
    utils.request({
      url:'/api/app/employee',
      method:'post',
      data:{
        Name:_this.data.Name,
        Sex:_this.data.Sex,
        NationType:_this.data.NationType[_this.data.NationIndex].Id,
        CardType:_this.data.CardType[_this.data.CardIndex].Id,
        CardCode:_this.data.CardCode,
        Address:_this.data.Address
      }
    })
    .then(()=>{
      wx.hideLoading();
      _this.setData({
        Tips:{
          type:'success',
          msg:'添加成功'
        }
      })
      setTimeout(()=>{
        wx.redirectTo({
          url:'/pages/staff/staff',
        });
      },2000)
    })
    .catch((err)=>{
      console.log(err);
      wx.hideLoading();
      _this.setData({
        Tips:{
          type:'error',
          msg:err.data.Error.Message
        }
      })
    })
  }
})