import request from '@/utils/request';

export function analyseListAPI(data) {
  return request({
    url: '/task/reanalysis',
    method: 'POST',
    data
  })
}