let utils = require('../../utils/utils');
let idCard;
let oper = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否确认
    IsConfirm:false,
    // 是否可用
    IsDisabled:false,
    // 是否更新
    IsUpdate:false,

    Id : '',
    // 姓名
    Name : '',
    // 性别
    Sex : 'M',
    // 住址
    Address : '',

    // 身份证号
    CardCode : '',
    // 证件类型字典
    CardArr:[],
    // 证件类型默认选项索引
    CardIndex:0,

    // 民族字典
    NationArr:[],
    // 民族默认选项索引
    NationIndex:12,

    // 工种字典
    WorkArr:[],
    // 工种默认选项索引
    WorkIndex:10,

    // 手机号
    Phone : '',

    // 是否培训
    IsSafetyTraining : false,
    // 是否备案
    IsRecord : false,
  },
  onLoad(options){
    let _this = this;
    oper = options.operation;
    _this.onGetArr('NationArr');
    _this.onGetArr('CardArr');
    _this.onGetArr('WorkArr');
    if(options.idCardJson){
      idCard = JSON.parse(options.idCardJson);
      _this.setData({
        Id:idCard.Id,
        Name:idCard.Name,
        Sex:idCard.Sex,
        Address:idCard.Address,
        CardCode:idCard.CardCode,
        Phone:idCard.hasOwnProperty('Phone')?idCard.Phone:'',
        IsSafetyTraining:idCard.hasOwnProperty('IsSafetyTraining')?idCard.IsSafetyTraining:false,
        IsRecord:idCard.hasOwnProperty('IsRecord')?idCard.IsRecord:false,
        IsDisabled:true
      })
      if(oper =='update'){
        _this.setData({
          IsUpdate:true,
          IsConfirm:true
        })
      }
    }else{
      _this.setData({
        IsConfirm:true
      })
    }
  },
  onReady(){
    if(idCard){
      this.onMapArr(idCard,'NationText',this.data.NationArr,'NationIndex');
      this.onMapArr(idCard,'CardText',this.data.CardArr,'CardIndex');
      this.onMapArr(idCard,'WorkText',this.data.WorkArr,'WorkIndex');
    }
  },
  // 获取滚动选择器数据
  onGetArr(key){
    let _this = this;
    if(_this.data[key].length == 0){
      utils.storage.Get(key,true)
      .then(function(res){
        _this.setData({
          [key]:res
        })
      })
    }
  },
  onMapArr(obj,key,array,vari){
    let _this = this;
    if(obj.hasOwnProperty(key)){
      array.map(function(e,i){
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
  onConfirm(){
    this.setData({
      IsConfirm:true,
      IsDisabled:true
    })
  },
  onModify(){
    this.setData({
      IsDisabled:false
    })
  },
  // 添加数据
  add(){
    let _this = this;
    let data = {
      Id:this.data.Id,
      Name:this.data.Name,
      Sex:this.data.Sex,
      NationType:this.data.NationArr[this.data.NationIndex].Id,
      CardType:this.data.CardArr[this.data.CardIndex].Id,
      CardCode:this.data.CardCode,
      Address:this.data.Address,

      WorkType:this.data.WorkArr[this.data.WorkIndex].Id,
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
    .then(function(res){
      wx.showToast({
        title:titles,
        icon:'none',
        mask:true,
        success:function(){
          wx.redirectTo({
            url:'/pages/staff/staff',
          });
        }
      });
    })
    .catch(function(err){
      wx.showModal({
        title:'提示',
        content:contents,
        confirmText:'确定',
        confirmColor:'#3b77e3',
      });
    })
  }
})