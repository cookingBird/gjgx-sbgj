import request from '@/utils/request'
import * as Misc from '@/utils/misc'

/**@description 获取单个或多个任务某条管道的分析详情 */
export function queryPipesDetail (task, query = {}) {
  const tasks = Misc.toArray(task)
  const pipeSegmentCode = tasks[0].pipeSegmentCode
  return request({
    url: '/result/resultListVo',
    method: 'post',
    data: {
      taskIds: tasks.map(task => task.id).join(','),
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
