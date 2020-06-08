let utils = require('../../utils/utils');
let list = [];
let begin = 0;  // 起点
let num = 10;    // 请求数量
let len = num;    // 实际数量
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  onShow(){
    begin = 0;
    len = num;
    list = [];
  },
  onReady(){
    this.getList();
  },
  onPullDownRefresh(){
    this.getList(true);
    wx.stopPullDownRefresh();
  },
  onReachBottom(){
    this.getList();
  },
  onTap(e){
    let index = e.currentTarget.dataset.index;
    let idCardJson = JSON.stringify(this.data.list[index]);
    wx.navigateTo({
      url: '/pages/staffAdd/staffAdd?idCardJson='+idCardJson+'&operation=update',
    });
  },
  getList(flag){
    let _this = this;
    if(flag){
      begin = 0;
      len = num;
      list = [];
    }
    if(num > len){
      wx.showLoading({
        title:'没有了',
        mask:true
      });
      return false;
    }
    wx.showLoading({
      title:'数据加载中，请稍后',
      mask:true
    });
    utils.request({
      url:'/api/app/employee/search',
      data:{
        'MaxResultCount':num,
        'SkipCount':begin
      },
      method:'post'
    })
    .then(function(res){
      len = res.Items.length;
      begin += len;
      list = list.concat(res.Items);
      wx.hideLoading();
      _this.getArrMap(list);
    })
    .catch(function(err){
      wx.hideLoading();
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
      list:newArr
    })
  }
})