import request from '@/utils/request';

//获取用户信息
export const getPermission = () => {
  return request({
    url: `/permission/getPermission`,
    method: 'GET',
  });
};

//注销
export function logout() {
  return request({
    url: `/permission/loginOut`,
    method: 'GET',
  });
}

/**
 * @function 获取字典表数据
 * @param dictType {String} 字典类型
 * @return {Promise} request请求
 */
export const getDicValue = dictType => {
  return request({
    url: '/dict/getValueList',
    method: 'GET',
    params: {
      dictType,
    },
  });
};

/**
 * @function 下载模板
 * @param dictType {String} 字典类型
 * @return {Promise} request请求
 */
export const downModel = templateName => {
  return request({
    url: '/template/downModel',
    method: 'GET',
    responseType: 'blob',
    params: {
      templateName,
    },
  });
};

/**
 * @function 获取展示页所有子页面
 * **/
export const getViewPageList = () => {
  return request({
    url: '/page/pageList',
    method: 'GET'
  })
}