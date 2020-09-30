const app = getApp();
const utils = require('../../utils/utils');
Page({
  data: {
    menuItem: [
      {
        img: '/images/icon/ico-scan.png',
        title: '新增零工单',
        note: '您可以使用该功能新增零工单',
        type: 'route',
        attr: '/pages/formWorkAdd/formWorkAdd',
      },
      {
        img: '/images/icon/ico-scan.png',
        title: '查看零工单',
        note: '您可以在此查看提交的零工单历史记录',
        type: 'route',
        attr: '/pages/formWorkList/formWorkList',
      },
    ],
  },
  onTap(e) {
    if (app.getLogin()) return false;
    let _this = this;
    let type = e.currentTarget.dataset.type;
    let attr = e.currentTarget.dataset.attr;
    switch (type) {
      case 'toast':
        utils.toast({
          title: '功能开发中',
        });
        break;
      case 'route':
        wx.navigateTo({
          url: attr,
        });
        break;
      case 'event':
        _this.getEvent(attr);
    }
  },
});
