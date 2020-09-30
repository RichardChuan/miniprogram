const app = getApp();
const utils = require('../../utils/utils');
Page({
  data: {
    menuItem: [
      {
        img: '/images/icon/ico-scan.png',
        title: '零工单',
        note: '快速方便编辑零工单，并查看历史提交的零工单记录。',
        type: 'route',
        attr: '/pages/formWork/formWork',
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
