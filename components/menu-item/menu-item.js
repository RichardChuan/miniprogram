Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img: {
      type: String
    },
    title: {
      type: String
    },
    note: {
      type: String
    }
  },
   methods: {
    onTap: function(){
      this.triggerEvent('onTap');
    },
  }
})
