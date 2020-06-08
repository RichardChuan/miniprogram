const apiUrl = 'https://www.yumeilinjianzhu.net.cn/apitest';

let UserName = '';
let Password = '';
let Authorization = '';
let icmtenant = '';
let isLogining = false;

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
function isHttpSuccess(status){
  // return (status >= 200 && status < 300)|| status == = 304;
  return status == 200;
}

/**
* 获取token
*/
function getAccessToken(){
  return new Promise((resolve,reject)=>{
    Authorization = wx.getStorageSync('Authorization');
    icmtenant = wx.getStorageSync('icmtenant');
    // 本地token丢失，重新获取
    if(!Authorization || !icmtenant){
      if(!isLogining){
        isLogining = true;
        login()
        .then(()=>{
          isLogining = false;
          resolve();
        })
        .catch(()=>{
          isLogining = false;
          reject();
        });
      }
    } else{
      resolve();
    }
  });
}
/**
* 登录
*/
function login(){
  return new Promise((resolve,reject)=>{
    UserName = wx.getStorageSync('UserName');
    Password = wx.getStorageSync('Password');
    // 本地账号丢失，重新获取
    if(!UserName || !Password){
      reject();
      wx.redirectTo({
        url:'/pages/login/login',
      });
    }else{
      requestP({
        url:'/api/account/weixin/auth',
        method:'post',
        data:{
          'UserName':UserName,
          'Password':Password
        },
      },false)
      .then((res)=>{
        // 更新token
        Authorization = res.token_type + ' ' + res.access_token;
        icmtenant = res.tenant_id;
        wx.setStorageSync('Authorization',Authorization);
        wx.setStorageSync('icmtenant',icmtenant);
        resolve();
      })
      .catch(()=>{
        reject();
        wx.clearStorage();
        wx.redirectTo({
          url:'/pages/login/login',
        });
      })
    }
  });
}
/**
 * promise请求
 * @param {object} options{}
 */
function requestP(options = {}){
  const url = apiUrl + options.url;
  const{
    data,
    method,
    dataType,
    responseType,
    success,
    fail,
    complete,
  } = options;

  // 统一注入约定的header
  const header = Object.assign({
    Authorization,
    icmtenant,
    'Content-Type':'application/json'
  },options.header);
  return new Promise((resolve,reject)=>{
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      responseType,
      success(res){
        const isSuccess = isHttpSuccess(res.statusCode);
        if(isSuccess){
          if(success){
            success(res.data);
          }
          resolve(res.data);
        }else{
          if(fail){
            fail();
          }
          reject();
        }
      },
      fail(err){
        if(fail){
          fail({
            msg:err.errMsg,
          });
        }
        reject({
          msg:err.errMsg,
        });
      },
      complete,
    });
  });
}
/**
* ajax高级封装
* @param {object} options {}
* @param {boolean} keepLogin true
*/
function request(options = {},keepLogin = true){
  if(keepLogin){
    return new Promise((resolve,reject)=>{
      getAccessToken()
      .then(()=>{
        // 获取token成功，发起请求
        requestP(options)
        .then((r1)=>{
          resolve(r1);
        })
        .catch((err)=>{
          if(err==undefined){
            wx.removeStorageSync('Authorization');
            wx.removeStorageSync('icmtenant');
            getAccessToken()
            .then(()=>{
              requestP(options)
              .then((r2)=>{
                resolve(r2);
              })
              .catch((err)=>{
                reject(err);
              })
            })
          }else{
            reject(err);
          }
        });
      })
      .catch(()=>{
        wx.clearStorage();
        wx.redirectTo({
          url:'/pages/login/login',
        });
      })
    });
  }else{
    // 不需要token，直接发起请求
    return requestP(options);
  }
}

module.exports = request;