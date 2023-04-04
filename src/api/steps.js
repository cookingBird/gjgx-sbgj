import request from '@/utils/request';

export const queryPipeLine = (data) => {
  return request({
    url: '/highconsarea/queryPipeLine',
    method: 'POST',
    data
  })
}