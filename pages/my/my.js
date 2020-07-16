const app = getApp();
const utils = require('../../utils/utils');

Page({
  data:{
    // 是否登录
    isLogin:true,
    // 密码是否隐藏
    isHide:true,
    // 是否显示actionSheet
    isActionShow:false,
    // actionSheet选项
    actionGroup:[
      {
        text:'确认',
        type:'warn', 
        value:true
      }
    ],
    // 用户信息
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
      // {
      //   id:2,
      //   name:'账号权限：',
      //   key:'Roles',
      // },
      {
        id:3,
        name:'隶属公司：',
        key:'TenantName',
      }
    ],
    // 用户数据
    valueList:[],
  },
  onReady(){
    let _this = this;
    this.getUserInfo();
  },
  onShow(){
    let _this = this;
    let Authorization = wx.getStorageSync('Authorization');
    let icmtenant = wx.getStorageSync('icmtenant');
    if(!Authorization || !icmtenant){
      _this.setData({
        isLogin:false
      })
    }
  },
  getUserInfo(){
    let _this = this;
    utils.request({
      url:'/api/app/account/userInfo',
      method:'get'
    })
    .then((valueList)=>{
      _this.setData({
        valueList,
        isLogin:true
      });
    })
    .catch(()=>{
      _this.setData({
        isLogin:false
      });
    })
  },
  onSignIn(e){
    var _this = this;
    if(!e.detail.value.UserName || !e.detail.value.Password){
      utils.toast({
        title:'账号或密码错误'
      })
      return false;
    }

    utils.request({
      url:'/api/account/weixin/auth',
      method:'post',
      data:e.detail.value,
    },false)
    .then((res)=>{
      utils.storage.Set('Authorization',(res.token_type + ' ' + res.access_token),true);
      utils.storage.Set('icmtenant',res.tenant_id,true);
      utils.toast({
        title:'登录成功',
        icon:'success',
        duration:2000
      })
      .then(()=>{
        _this.getUserInfo();
        wx.switchTab({
          url:'/pages/index/index',
        });
      });
      wx.showTabBar();
    })
    .catch((err)=>{
      console.log(err);
      utils.toast({
        title:err.Error.Message
      })
    })
  },
  onSignOut(){
    var _this = this;
    _this.setData({
      isActionShow:true
    })
  },
  onSwitch(){
    let isHide = !this.data.isHide;
    this.setData({
      isHide
    })
  },
  onActionTap(e){
    let _this = this;
    if(e.detail.value){
      utils.storage.rm()
      .then(()=>{
        _this.setData({
          isLogin:false,
          isActionShow:false
        })
        app.globalData.CardType = [];
        app.globalData.NationType = [];
        app.globalData.WorkType = [];
        wx.switchTab({
          url:'/pages/my/my',
          success:function(){
            wx.hideTabBar();
          }
        });
      })
    }
  }
})