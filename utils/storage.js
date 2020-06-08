/**
 * @description 读取本地存储，
 * @param {string}  key 要读取的key
 * @param {boolean} isSync 是否是同步
 * @todo 读取本地存储，判断key只能是string且非纯空格 如果不是将报错，
 */
function Get(key, isSync = false){
  if(typeof key != 'string'){
    throw new Error('key is typeof string at Utils.storage.Get');
    return false;
  }
  if(key.Trim() == ''){
    throw new Error('key is not null at Utils.storage.Get');
    return false;
  }
  return new Promise((resolve, reject) => {
    if(isSync){
      let result = wx.getStorageSync(key.Trim());
      if(result){
        resolve(result);
      }else{
        reject({errMsg:'getStorage:fail data not found'});
      }
    }else{
      wx.getStorage({
        key:key.Trim(),
        success(res){
          resolve(res.data);
        },
        fail(err){
          reject(err);
        }
      })
    }
  })
}

/**
 * @description 设置本地存储，
 * @param {string}  key 存储的key
 * @param { * }     data 存储的内容
 * @param {boolean} isSync 是否是同步
 * @todo 设置本地存储，判断key只能是string且非纯空格 如果不是将报错，
 */
function Set(key, data, isSync = false){
  if(typeof key != 'string'){
    throw new Error('key is typeof string at Utils.storage.Set');
    return false;
  }
  if(key.Trim() == ''){
    throw new Error('key is not null at Utils.storage.Set');
    return false;
  }
  return new Promise((resolve, reject) => {
    if(isSync){
      wx.setStorageSync(key.Trim(), data)
      resolve({errMsg:'setStorage:ok'});
    }else{
      wx.setStorage({
        key:key.Trim(),
        data,
        success(res){
          resolve(res.errMsg);
        },
        fail(err){
          reject(err);
        }
      })
    }
  })
}

/**
 * @description 清理本地存储，
 * @param {string}  key 存储的key（为空将清空所有）
 * @param {boolean} isSync 是否是同步
 * @todo 清理本地存储，如果key为空则清空所有，如果key不为空则清空指定的key
 */
function rm(key = '', isSync = false){
  if(typeof key != 'string'){
    throw new Error('key is typeof string at Utils.storage.rm');
    return false;
  }
  return new Promise((resolve, reject) => {
    if(key.Trim() == ''){
      if(isSync){
        wx.clearStorageSync();
        resolve({errMsg:'clearStorage:ok'});
      }else{
        wx.clearStorage({
          success(res){
            resolve(res.errMsg);
          },
          fail(err){
            reject(err);
          }
        })
      }
    }else{
      if(isSync){
        wx.removeStorageSync(key.Trim());
        resolve({errMsg:'removeStorage:ok'})
      }else{
        wx.removeStorage({
          key:key.Trim(),
          success(res){
            resolve(res.errMsg);
          },
          fail(err){
            reject(err);
          }
        })
      }
    }
  })
}

/**
 * @public
 * @description 为string新增方法，trim为string去掉两端空格
 */
String.prototype.Trim = function (){
  return this.replace(/(^\s*)|(\s*$)/g,'');
}
module.exports = {
  Get,
  Set,
  rm
}