const app = getApp();
const utils = require('../../utils/utils');
Page({
  data:{
    list:[
      {
        id:0,
        name:'姓　　名：',
        key:'UserName',
      },
      {
        id:1,
        name:'手机号码：',
        key:'Phone',
      },
      {
        id:2,
        name:'账号权限：',
        key:'Roles',
      },
      {
        id:3,
        name:'隶属公司：',
        key:'TenantName',
      }
    ],
    valueList:[],
    hideModal: true, //模态框的状态  true-隐藏  false-显示
  },
  onReady(){
    let _this = this;
    utils.request({
      url:'/api/app/account/userInfo',
      method:'get'
    })
    .then((res)=>{
      let valueList = res;
      for (const key in res) {
        if(res[key] instanceof Array){
          res[key] = res[key][0];
        }
      }
      _this.setData({
        valueList
      });
    })
  },
  onTap(){
    wx.showModal({
      title: '是否退出登录？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})