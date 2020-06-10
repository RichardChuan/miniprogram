const app = getApp();
const utils = require('../../utils/utils');
let oper = '';
Page({
  data: {
    // 是否可用
    IsDisabled:false,
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
    _this.setData({
      CardType:app.globalData.CardType,
      NationType:app.globalData.NationType
    })
    console.log(options);
    let keyType = Object.keys(options);
    console.log(keyType);

    if(keyType.length != 0){
      console.log(options.idCard);
      let idCard = JSON.parse(options.idCard);
      console.log(idCard);
      _this.setData({
        Name:idCard.name.text,
        Sex:idCard.gender.text=='男'?'M':'F',
        Address:idCard.address.text,
        CardCode:idCard.id.text,
        IsDisabled:true
      })
    }
  },
  // onReady(){
  //   if(idCard){
  //     this.getMapType(idCard,'NationText',this.data.NationType,'NationIndex');
  //     this.getMapType(idCard,'CardText',this.data.CardType,'CardIndex');
  //     this.getMapType(idCard,'WorkText',this.data.WorkType,'WorkIndex');
  //   }
  // },
  getMapType(obj,key,Typeay,vari){
    let _this = this;
    if(obj.hasOwnProperty(key)){
      Typeay.map(function(e,i){
        if(e.DictName.indexOf(obj[key]) != -1){
          _this.setData({
            [vari]:i
          })
        }
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
    let data = {
      Id:this.data.Id,
      Name:this.data.Name,
      Sex:this.data.Sex,
      NationType:this.data.NationType[this.data.NationIndex].Id,
      CardType:this.data.CardType[this.data.CardIndex].Id,
      CardCode:this.data.CardCode,
      Address:this.data.Address,

      WorkType:this.data.WorkType[this.data.WorkIndex].Id,
      Phone:this.data.Phone,

      IsSafetyTraining:this.data.IsSafetyTraining,
      IsRecord:this.data.IsRecord
    }
    if(data.Name && data.Sex && data.CardCode && data.Address &&data.Phone){
      _this.onAdd(data);
    }else{
      if(!data.Name || !data.Sex || !data.CardCode || !data.Address){
        wx.showToast({
          title:'身份信息不全，请填写',
          mask:true,
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '信息不全是否添加',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#3b77e3',
          confirmText: '确定',
          confirmColor: '#666',
          success:(result) => {
            if(result.confirm){
              _this.onAdd(data);
            }
          }
        });
      }
    }
  },
  onAdd(data){
    let methods,titles,contents;
    if(oper=='update'){
      methods = 'put';
      titles = '更新成功';
      contents = '操作失败，请重试';
    }else{
      methods = 'post';
      titles = '添加成功';
      contents = '已添加，请勿重复操作';
    }
    utils.request({
      url:'/api/app/employee',
      header:{
        'Content-Type':'application/json'
      },
      method:methods,
      data
    })
    .then((res)=>{
      wx.showToast({
        title:titles,
        icon:'none',
        mask:true,
        success(){
          wx.redirectTo({
            url:'/pages/staff/staff',
          });
        }
      });
    })
    .catch((err)=>{
      wx.showModal({
        title:'提示',
        content:contents,
        confirmText:'确定',
        confirmColor:'#3b77e3',
      });
    })
  }
})