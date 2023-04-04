import request from '@/utils/request';


//识别成果
export function resultList(params) {
  return request({
    method: 'GET',
    url: '/task/resultListVo',
    params
  })
}


//管线集合
export function pipeListAPI(data) {
  return request({
    method: 'POST',
    url: '/highconsarea/queryPipeLine',
    data
  })
}

//同步数据
export function syncData(data) {
  return request({
    method: 'POST',
    url: '/task/synData',
    data
  })
}