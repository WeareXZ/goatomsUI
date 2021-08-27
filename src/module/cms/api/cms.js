import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

//页面查询
//axios实现了http方法的封装，vue.js官方不再继续维护vue-resource,推荐使用 axios。
export const page_list = (page,size,params) =>{
  //将Json对象转换成key/value
  let query = querystring.stringify(params);
  //请求服务端的页面查询接口
  return http.requestQuickGet(apiUrl+'/oms/findAll?page='+page+'&size='+size+"&"+query);
}

export const page_add = (params) =>{
  return http.requestPost(apiUrl+'/oms/saveOrder',params);
}

export const page_findByOrderId = (pageId) =>{
  return http.requestQuickGet(apiUrl+'/oms/findOne?id='+pageId);
}

export const page_findByOrderIdByStatus = (pageId) =>{
  return http.requestQuickGet(apiUrl+'/oms/findOneByStatus?id='+pageId);
}

export const page_edit = (params,id) =>{
  return http.requestPut(apiUrl+'/oms/edit/'+id,params);
}

export const page_out = (params,id) =>{
  return http.requestPut(apiUrl+'/oms/inStorage/'+id,params);
}




