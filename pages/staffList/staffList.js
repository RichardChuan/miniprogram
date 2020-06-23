const app = getApp();
const utils = require('../../utils/utils');

// 页面数据列表
const dataNum = 20; // 请求数量
var dataLists = []; // 列表
var dataBegin = 0;  // 请求起点
var dataLen;        // 实际数量
Page({
  data:{
    // 页面数据列表
    dataLists:[],
    // 是否到底
    isBottom:false
  },
  onReady(){
    dataLists = [];
    dataBegin = 0;
    dataLen = dataNum;
    this.getData();
  },
  onReachBottom(){
    this.getData();
  },
  onPullDownRefresh(){
    this.setData({
      isBottom:false
    })
    dataLists = [];
    dataBegin = 0;
    dataLen = dataNum;
    this.getData();
    wx.stopPullDownRefresh();
  },
  // 查看详细
  onTap(e){
    let index = e.currentTarget.dataset.index;
    let info = JSON.stringify(this.data.dataLists[index]);
    wx.navigateTo({
      url:'/pages/staffEdit/staffEdit?info='+info,
    });
  },
  getData(){
    let _this = this;
    if(dataNum > dataLen){
      return false;
    }
    wx.showLoading({
      title:'数据加载中',
      mask:true
    });
    utils.request({
      url:'/api/app/employee/search',
      data:{
        'MaxResultCount':dataNum,
        'SkipCount':dataBegin
      },
      method:'post'
    })
    .then((res)=>{
      dataLists = dataLists.concat(res.Items);
      dataLen = res.Items.length;
      dataBegin += dataLen;
      if(dataNum > dataLen){
        _this.setData({
          isBottom:true
        })
      }
      wx.hideLoading();
      _this.getArrMap(dataLists);
    })
    .catch((err)=>{
      wx.hideLoading();
    })
  },
  getArrMap(arr){
    let _this = this;
    let noArr = [];
    let yesArr = [];
    let newArr = [];
    arr.map(function(e){
      if(e.IsCompletion){
        yesArr.push(e);
      }else{
        noArr.push(e);
      }
    })
    newArr = noArr.concat(yesArr); 
    _this.setData({
      dataLists:newArr
    })
  },
  onPhoneCall(e){
    let index = e.currentTarget.dataset.index;
    let Phone = this.data.dataLists[index].Phone;
    wx.makePhoneCall({
      phoneNumber:Phone
    })
  }
})