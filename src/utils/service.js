import axios from 'axios'
import Message from 'element-ui/packages/message/index.js'
const service = axios.create({
  baseURL: window.URL_CONFIG.serviceUrl,
  // 超时时间
  timeout: 10000 * 12
})

service.interceptors.request.use(
  config => {
    config.crossDomain = true
    let token = sessionStorage.token
    if (token) {
      config.headers.token = token
    }
    config.async = true
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      let res = response.data
      if (res.code && res.code == 500) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 2000,
          showClose: true
        })
        return res
      } else if (res.code && res.code == 15000) {
        //已登录状态
        window.location.href = `${window.URL_CONFIG.indexUrl}?token=${res.data.token}`
        window.location.reload()
        return res
      } else if (res.code && res.code == 401) {
        // window.location.href = `${window.URL_CONFIG.loginUrl}${res.data}`
        window.location.href = res.data
        return res
      } else if (res.code && res.code === 400) {
        Message({
          message: '参数错误',
          type: 'error',
          duration: 2000,
          showClose: true
        })
        return res
      } else {
        return res
      }
    } else {
      Message.error(response.data.msg)
      return Promise.reject(response.data)
    }
  },
  error => {
    if (error.message.includes('timeout')) {
      // 判断请求异常信息中是否含有超时timeout字符串
      Message.error('网络链接超时...')
      return Promise.reject(error) // reject这个错误信息
    } else if (error.message == 'Network Error') {
      Message.error('网络异常,请稍后再试')
      return Promise.reject(error)
    } else {
      Message.error(error.message)
      return Promise.reject(error) // reject这个错误信息
    }
  }
)

export default service
