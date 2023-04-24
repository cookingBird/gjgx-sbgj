import Request from '@/utils/request'

/**
 *
 * @description 任务管理
 */

export function remove (id) {
  return Request.request({
    method: 'delete',
    url: `/task/delete/${id}`
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  })
}

export function syncData (data) {
  return Request.request({
    method: 'post',
    url: '/result/hgcResultSync',
    data
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function syncPrompt (data) {
  return Request.request({
    method: 'post',
    url: '/result/hgcResultSyncPrompt',
    data
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res.msg)
    }
  })
}

export function addOrUpdateTask (data) {
  const { taskName, taskDescription, id } = data
  return Request.request({
    method: 'post',
    url: '/task/addOrUpdate',
    data: {
      id: id,
      taskDescription: taskDescription,
      taskName: taskName
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function taskDetail (id) {
  return Request.request({
    method: 'get',
    url: `/task/detail/${id}`
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}
/*******************************
 * @description 过程管理
 */

export function queryAll ({ keyWords, pageNo, pageSize }) {
  return Request.request({
    method: 'post',
    url: '/highconsarea/queryPipeLine',
    data: {
      keyWords,
      pageNo: pageNo,
      pageSize: pageSize
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function queryAllSelected (options = {}) {
  return Request.request({
    method: 'post',
    url: '/highconsarea/existList',
    data: {
      keyWords: '',
      pageNo: 1,
      pageSize: -1,
      startTime: '',
      endTime: '',
      status: 0,
      ...options
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function discernOneStep ({ taskId, nodeId }) {
  return Request.request({
    url: '/highconsarea/autRecognition',
    method: 'get',
    params: {
      taskId,
      nodeId
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function pipeLevelMutation ({
  code,
  id,
  levelName,
  levelNo,
  node,
  pipeSegmentCode,
  taskId
}) {
  return Request.request({
    url: '/highconsarea/levelOperate',
    method: 'post',
    data: {
      code,
      id,
      levelName,
      levelNo,
      node,
      pipeSegmentCode,
      taskId
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function nextStepOpr ({
  taskId,
  nodeId = 0,
  flag = 'next',
  pipeCode
} = {}) {
  return Request.request({
    url: '/highconsarea/nextOperate',
    method: 'get',
    params: {
      taskId,
      nodeId,
      flag,
      pipeCode,
      pageNo: -1,
      pageSize: 1
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function pipeAddOrUpdate ({ pipeLineVos, taskId, taskName }) {
  /**
   * pipeLineVos: [
        {
          id: 0,
          name: 'string',
          pipeCode: 'string',
          pipeSegmentCode: 'string',
          pipeType: 'string',
          specification: 'string'
        }
      ],
   */
  return Request.request({
    url: '/highconsarea/pipeAddOrUpdate',
    method: 'post',
    data: {
      pipeLineVos,
      taskId,
      taskName
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}

export function pipeSplitSegment ({
  code,
  id,
  pipeSegmentCode,
  startMileage,
  splitMileage,
  endMileage,
  taskId
}) {
  return Request.request({
    url: '/highconsarea/segmentation',
    method: 'post',
    data: {
      code,
      endMileage,
      id,
      pipeSegmentCode,
      splitMileage,
      startMileage,
      taskId
    }
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res)
    }
  })
}

export function mergePipeSegments (segments, filedKey = 'id') {
  return Request.request({
    url: '/highconsarea/segmentMerge',
    methods: 'get',
    params: {
      ids: segments.map(seg => seg[filedKey]).join(',')
    }
  }).then(res => {
    if (res.code === 200) {
      return res.data
    } else {
      return Promise.reject(res.msg)
    }
  })
}
