const app = getApp();
const utils = require('../../utils/utils');
Page({
  data: {
    // 提示信息
    tips:{
      type:'',
      msg:''
    },
    // 姓名
    Name:'',
    // 性别
    Sex:'M',
    // 民族
    NationText:'',
    // 住址
    Address:'',
    // 身份证号
    CardCode:'',
    // 手机号
    Phone:'',
    // 工种字典
    WorkType:[],
    // 工种默认选项索引
    workIndex:0,
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
    _this.setData({
      workType:app.globalData.workType
    })
    // if(!_this.data.workType.length){
    //   app.onInitData({
    //     key:'workType',
    //     url:'/api/app/dictItem/workType'
    //   })
    //   .then(()=>{
    //     _this.setData({
    //       workType:app.globalData.workType
    //     })
    //   })
    // }
    var idCard = JSON.parse(e.idCard);
    console.log(idCard);
    let {
      Name,
      Sex,
      NationText,
      Address,
      CardCode,
      Phone,
      IsSafetyTraining,
      IsRecord,
      WorkCertificateCode,
      ContractCode,
    } = idCard;
    console.log(Name,Sex,NationText,Address,CardCode,Phone,IsSafetyTraining,IsRecord,WorkCertificateCode,ContractCode);
    console.log(_this.data.workType);
    _this.data.workType.map(function(e){
      console.log(e);
      if(e){}
    })
  }
})