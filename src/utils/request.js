import axios from 'axios'
import Message from 'element-ui/packages/message/index.js'
import {
  connector
} from '@gislife/micro-message'
const service = axios.create({
  baseURL: window.URL_CONFIG.baseUrl
})

service.interceptors.request.use(
  config => {
    config.crossDomain = true
    config.async = true
    config.headers.token = sessionStorage.token || ''
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function alertMsg(data) {
  if (data.code != 200) {
    if (data.code == 401) {
      //token失效
      Message.error('用户信息已过期，请重新登录')
      window.location.replace(data.data)
      try {
        connector.$send({
          target: 'main',
          type: 'logout'
        })
      } catch (e) {
        console.error(e)
      }
    } else {
      if (data.msg == 'ok') {
        return
      } else {
        Message.error(data.msg)
      }
    }
  }
}
//响应拦截器
service.interceptors.response.use(
  response => {
    //重新设置token避免过期
    if (response.headers.token) {
      sessionStorage.token = response.headers.token
      try {
        connector.$send({
          target: 'global',
          type: 'token',
          data: response.headers.token
        })
      } catch (e) {
        console.error(e)
      }
    }
    if (response.status === 200) {
      // switch
      let type = typeof response.data
      if (type == 'string') {
        let data = JSON.parse(response.data)
        alertMsg(data)
        return Promise.resolve(data)
      } else if (type == 'object' && !(response.data instanceof Blob)) {
        alertMsg(response.data)
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(response.data)
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