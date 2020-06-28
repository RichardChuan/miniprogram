const app = getApp();
const utils = require('../../utils/utils');
Page({
  data:{
    // 提示信息
    Tips:{
      type:'',
      msg:''
    },
    // 拨打电话按钮
    IsPhoneChange:false,
    // 姓名
    Name:'',
    // 性别
    Sex:'M',
    // 民族
    NationText:'',
    // 民族默认选项索引
    NationIndex:0,
    // 民族字典
    NationType:[],
    // 住址
    Address:'',
    // 身份证号
    CardCode:'',
    // 手机号
    Phone:'',
    // 工种字典
    WorkType:[],
    // 工种默认选项索引
    WorkIndex:0,
    // 安全培训
    IsSafetyTraining:false,
    // 建委备案
    IsRecord:false,
    // 上岗证书号
    WorkCertificateCode:'',
    // 合同编号
    ContractCode:'',
  },
  onLoad(e){
    let _this = this;
    let info = e.info?JSON.parse(e.info):'';
    _this.setData(info);
    if(info.Phone==''){
      _this.setData({
        IsPhoneChange:true
      })
    }
    let WorkIndex = 0;
    let WorkType = app.globalData.WorkType;
    let NationIndex = 0;
    let NationType = app.globalData.NationType;
    WorkType.map(function(e,i){
      if(info.WorkCode == e.DictCode) WorkIndex = i;
    })
    NationType.map(function(e,i){
      if(e.DictName.indexOf(info.NationText)>=0) NationIndex = i;
    })
    _this.setData({
      WorkType,
      WorkIndex,
      NationType,
      NationIndex,
    })
  },
  // 修改表单的值
  onChange(e){
    let target = e.currentTarget.dataset.target;
    let value = e.detail.value;
    if(target == 'Phone'){
      this.setData({
        IsPhoneChange:true
      })
    }
    this.setData({
      [target]:value
    })
  },
  onSubmit(){
    let _this = this;
    wx.showLoading({
      title: '请稍后',
    });
    console.log(_this.data);
    utils.request({
      url:'/api/app/employee/fromBe',
      method:'put',
      data:{
        Id:_this.data.Id,
        Name:_this.data.Name,
        Sex:_this.data.Sex,
        Address:_this.data.Address,
        Phone:_this.data.Phone,
        WorkType:_this.data.WorkType[_this.data.WorkIndex].Id,
        NationType:_this.data.NationType[_this.data.NationIndex].Id,
        IsSafetyTraining:_this.data.IsSafetyTraining?true:false,
        IsRecord:_this.data.IsRecord?true:false,
        WorkCertificateCode:_this.data.WorkCertificateCode,
        ContractCode:_this.data.ContractCode,
        Remark:_this.data.Remark,
      }
    })
    .then((res)=>{
      wx.hideLoading();
      _this.setData({
        Tips:{
          type:'success',
          msg:'修改成功'
        }
      })
      _this.onPageBack(res);
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        });
      },2000)
    })
    .catch((err)=>{
      wx.hideLoading();
      _this.setData({
        Tips:{
          type:'error',
          msg:err.data.Error.Message
        }
      })
    })
  },
  onPageBack(data){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length-2];
    let Lists = prevPage.__data__.Lists;
    Lists.map((e,i)=>{
      if(e.Id == data.Id) Lists[i] = data;
    })
    prevPage.setData({Lists});
  },
  onPhoneCall(){
    let Phone = this.data.Phone;
    wx.makePhoneCall({
      phoneNumber:Phone
    })
  }
})