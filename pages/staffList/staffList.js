const utils = require('../../utils/utils');
let Begin = 0;          // 请求起点
let Num = 20;           // 请求数量
let IsLoading = 0;  // 阻止多次请求
Page({
  data:{
    // 搜索按钮是否可用
    searchData:{
      key:'',
      value:'',
      isDisabled:!0
    },
    // 是否到底
    isBottom:0,
  },
  // 页面初始化方法
  onInit(){
    Begin = 0;
    Num = 20;
    IsLoading = 0;
    this.setData({
      // 搜索按钮是否可用
      searchData:{
        key:'',
        value:'',
        isDisabled:!0
      },
      // 页面数据列表
      Lists:[],
      // 是否到底
      isBottom:0,
    })
  },
  onReady(){
    this.getLists({status:0});
  },
  onReachBottom(){
    this.getLists({status:1});
  },
  onPullDownRefresh(){
    let _this = this;
    wx.stopPullDownRefresh();
    _this.getLists({
      status:0
    });
  },
  /**
   * getLists请求
   * @param {object} options{}
   *  -- status是否需要初始化: 0 需要  |  1 不需要
   *  -- data请求参数
   */
  getLists(options){
    let _this = this;
    if(!options.status){
      _this.onInit();
    }
    if(IsLoading){
      return 0;
    }
    
    IsLoading = !0; // 加载中
    wx.showLoading({
      title:'数据加载中',
      mask:!0
    });
    let data = {};
    if(options.searchData){
      data[options.searchData.key] = options.searchData.value;
    }
    data.MaxResultCount = Num;
    data.SkipCount = Begin;
    utils.request({
      url:'/api/app/employee/search',
      method:'post',
      data:data
    })
    .then((res)=>{
      let TotalCount = res.TotalCount;
      let Items = res.Items;
      let Lists = _this.data.Lists.concat(Items);
      Begin += Num;
      Lists = _this.getSort(Lists,'IsCompletion');
      _this.setData({
        Lists
      })
      if(Begin >= TotalCount){
        _this.setData({
          isBottom:!0
        })
      }else{
        IsLoading = 0; // 加载完毕
      }
      wx.hideLoading();
    })
    .catch(()=>{
      IsLoading = 0; // 加载完毕
      wx.hideLoading();
    })
  },
  getSort(arr,key){
    arr.sort((x1,x2)=>{return x1[key] - x2[key]});
    return arr;
  },
  // [查看]按钮
  onTap(e){
    let index = e.currentTarget.dataset.index;
    let info = JSON.stringify(this.data.Lists[index]);
    wx.navigateTo({
      url:'/pages/staffEdit/staffEdit?info='+info,
    });
  },
  // [联系ta]按钮
  onPhoneCall(e){
    let index = e.currentTarget.dataset.index;
    let Phone = this.data.Lists[index].Phone;
    wx.makePhoneCall({
      phoneNumber:Phone
    })
  },
  // [搜索]输入
  onChange(e){
    let _this = this;
    let value = e.detail.value;
    let searchData = {
      key:'',
      value:'',
      isDisabled:!0
    }
    if(value){
      searchData.value = value;
      searchData.isDisabled = 0;
      if(utils.reg(value) == 'isChinese'){
        searchData.key = 'Name'
      }else{
        searchData.key = 'Phone'
      }
    }
    _this.setData({
      searchData
    })
  },
  // [搜索]按钮
  onSearch(){
    let _this = this;
    _this.getLists({
      status:0,
      searchData:_this.data.searchData
    });
  }
})