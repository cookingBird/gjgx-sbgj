import request from '@/utils/request'

/**@description 获取单个或多个任务某条管道的分析详情 */
export function queryPipesDetail (taskIds,pipeSegmentCode, query = {}) {
  return request({
    url: '/result/resultListVo',
    method: 'post',
    data: {
      taskIds: taskIds,
      startTime: '',
      endTime: '',
      higLevel: query.higLevel || '',
      keyWords: query.keyWords || '',
      orgCode: '',
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      pipeSegmentCode: pipeSegmentCode
    }
  })
  .then(res => {
    if (res.code === 200) {
      return res.data
    } else {
      return Promise.reject(res)
    }
  })
}

/**@description 获取单个或多个任务某条管道的分析详情 */
export function queryPipeRegion (taskId, pipeSegmentCode) {

  return request({
    url: '/highconsarea/getPipeRegion',
    method: 'get',
    params: {
      taskId: taskId,
      code: pipeSegmentCode
    }
  })
  .then(res => {
    if (res.code === 200) {
      return res.data
    } else {
      return Promise.reject(res)
    }
  })
}
