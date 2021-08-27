import http from './../../../base/api/public'

let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

export const user_login = (phone,password) =>{
  //将Json对象转换成key/value
  return http.requestQuickGet(apiUrl+'/user/login?phone='+phone+'&password='+password);
}

export const register = (params) =>{
  return http.requestPost(apiUrl+'/user/register',params);
}

export const loginOut = () =>{
  return http.requestQuickGet(apiUrl+'/user/loginOut');
}

