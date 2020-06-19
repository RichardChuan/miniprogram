const app = getApp();
const utils = require('../../utils/utils');

// 页面数据列表
let dataLists = [];
let dataBegin = 0;  // 起点
let dataNum = 20;   // 请求数量
let dataLen;        // 实际数量
Page({
  data: {
    // 页面数据列表
    dataLists:[],
    // 数据起点
    dataBegin:0,
    // 数据请求数量
    dataNum:15,
  },
  // onShow(){
  //   dataBegin = 0;
  //   dataLen = dataNum;
  //   dataLists = [];
  // },
  onReady(){
    this.getData();
  },
  onPullDownRefresh(){
    this.getData(true);
    wx.stopPullDownRefresh();
  },
  onReachBottom(){
    this.getData();
  },
  // 查看详细
  onTap(e){
    let index = e.currentTarget.dataset.index;
    let idCard = JSON.stringify(this.data.dataLists[index]);
    wx.navigateTo({
      url: '/pages/staffEdit/staffEdit?idCard='+idCard,
    });
  },
  getData(flag){
    let _this = this;
    // if(flag){
    //   dataBegin = 0;
    //   dataLen = dataNum;
    //   dataLists = [];
    // }
    
    // if(dataNum > dataLen){
    //   wx.showLoading({
    //     title:'没有了',
    //     mask:true,
    //   });
    //   setTimeout(function() {
    //     wx.hideLoading()
    //   }, 2000)
    //   return false;
    // }
    wx.showLoading({
      title:'数据加载中，请稍后',
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
      dataLen = res.Items.length;
      dataBegin += dataLen;
      dataLists = dataLists.concat(res.Items);
      wx.hideLoading();
      _this.getArrMap(dataLists);
    })
    .catch((err)=>{
      wx.hideLoading();
      console.log(1111);
    })
  },
  getArrMap(arr){
    var newArr = [];
    arr.map(function(e){
      if(!e.IsCompletion){
        newArr.unshift(e);
      }else{
        newArr.push(e);
      }
    })
    this.setData({
      dataLists:newArr
    })
  }
})