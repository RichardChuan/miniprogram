function isChinese(e){
  return /^[\u4e00-\u9fa5]/.test(e);
}
function isEnglish(e){
  return /^[a-zA-Z]/.test(e);
}
function isNumber(e){
  return /^[0-9]/.test(e);
}
function isPhone(e){
  return /^1[3456789]\d{9}$/.test(e);
}

function reg(e){
  if(isChinese(e)){
    return 'isChinese';
  }
  if(isEnglish(e)){
    return 'isEnglish';
  }
  if(isPhone(e)){
    return 'isPhone';
  }
  if(isNumber(e)){
    return 'isNumber';
  }
}

module.exports = reg