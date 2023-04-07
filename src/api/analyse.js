import request from '@/utils/request'

export function analyseListAPI (data) {
  return request({
    url: '/task/reanalysis',
    method: 'POST',
    data
  })
}

export function lineAround (params) {
  return request({
    url: '/highconsarea/getRegion',
    method: 'GET',
    params
  })
}

export function pipeAround ({ taskId, pipeCode }) {
  return request({
    url: '/highconsarea/getPipeRegion',
    method: 'GET',
    params: {
      taskId,
      code: pipeCode
    }
  }).then(res => res.data)
}
