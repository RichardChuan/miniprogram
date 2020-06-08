//index.js
const app = getApp();
const utils = require('../../utils/utils.js');

Page({
  data: {
    error:'',
    listItem: [
      {
        img: '/images/icon/ico-CAD.png',
        title: 'CAD看图',
        note: '开图更快捷、显示更精确、功能更强大、同步更方便',
        type: 'toast'
      },
      {
        img: '/images/icon/ico-iden.png',
        title: '花名册',
        note: '准确识别身份信息，快速查询人员个人详情，并及时更新',
        type: 'route',
        attr: '/pages/staff/staff'
      },
      {
        img: '/images/icon/ico-cale.png',
        title: '工程计量表',
        note: '简化提交工程数据步骤，实现自动化，快速成表格',
        type: 'toast'
      },
      {
        img: '/images/icon/ico-prop.png',
        title: '建议反馈',
        note: '致力于为您提供高效、便捷的互联网服务。若有任何宝贵意见，请留言',
        type: 'toast'
      }
    ]
  },
  onTap(e){
    let type = e.currentTarget.dataset.type;
    let attr = e.currentTarget.dataset.attr;
    switch(type){
      case 'toast':
        this.onToast();
        break;
      case 'route':
        this.onRoute(attr);
        break;
      case 'event':
        this.onEvent(attr);
    }
  },
  onToast(){
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      mask: true
    })
  },
  onRoute(routes){
    wx.navigateTo({
      url: routes
    })
  },
  onShow() {
    this.setData({
        error: '这是一个错误提示'
    })
}
})
