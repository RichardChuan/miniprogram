/**
 * @description showToast封装
 * @param {string}  options 参数
 * @todo toast提示
 */
function toast(options){
  let {
    title,
    icon = 'none',
    image,
    duration = 1000,
    mask = false,
    success,
    fail,
    complete
  } = options;
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon,
      image,
      duration,
      mask,
      success(){
        if(success){
          success();
        }
        resolve();
      },
      fail(){
        if(fail){
          fail();
        }
        reject();
      },
      complete
    });
  })
}

module.exports = toast;