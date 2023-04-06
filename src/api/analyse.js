import request from '@/utils/request';

export function analyseListAPI(data) {
  return request({
    url: '/task/reanalysis',
    method: 'POST',
    data
  })
}

export function lineAround(params) {
  return request({
    url: '/highconsarea/getRegion',
    method: 'GET',
    params
  })
}