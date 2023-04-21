import router from '@/router'
import store from '@/store'
import { connector } from '@gislife/micro-message'
import { logout } from '@/api/base'
import { Message } from 'element-ui'

setTimeout(() => {
  if (connector.isMain()) {
    /**
     * @description 子应用获取功能权限
     */
    connector.$on(null, 'getPermission', ({ data, responser }) => {
      responser(store.state.auth)
    })
    /**
     * @description 子应用获取location
     */
    connector.$on(null, 'getPath', ({ responser }) => {
      responser(
        getFiledValue(
          location,
          'hash',
          'host',
          'hostname',
          'href',
          'origin',
          'pathname',
          'port',
          'search'
        )
      )
    })
    /**
     * @description 子应用路由跳转
     */
    connector.$on(null, 'router', ({ data }) => {
      router.push(data)
    })
    /**
     * @description 子应用登出
     */
    connector.$on(null, 'logout', async () => {
      try {
        const { code } = await logout()
        if (code === 200) {
          Message({
            type: 'success',
            message: '操作成功'
          })
          location.reload()
        }
      } catch (err) {
        console.log(err)
      }
    })
    /**
     * @description 子应用获取token
     */
    connector.$on(null, 'getToken', ({ responser }) => {
      responser(sessionStorage.token)
    })
    /**
     * @description 打开外部窗口
     */
    connector.$on(null, 'open', ({ data }) => {
      window.open(data.to)
    })
  }
  /**
   * @description token全局刷新
   */
  connector.$on(null, 'token', ({ data }) => {
    sessionStorage.token = data
  })
})

export function getMainPath () {
  return connector
    .$send({
      target: 'main',
      type: 'getPath'
    })
    .then(data => {
      localStorage.setItem('mainPath', JSON.stringify(data))
      return data
    })
}

export function treeTravels (target) {
  return visitor => {
    const { firstEnter, every } = visitor || {}

    function travel (tar, isFirst = true) {
      if (isFirst) {
        firstEnter && firstEnter(tar)
      }
      if (Object.prototype.toString.call(tar) === '[object Object]') {
        every && every(tar)
        if (tar.children && tar.children.length) {
          travel(tar.children, false)
        }
      }
      if (Object.prototype.toString.call(tar) === '[object Array]') {
        tar.forEach(element => {
          travel(element, false)
        })
      }
    }

    travel(target)
  }
}

export function getPermission () {
  return connector.$send({
    target: 'main',
    type: 'getPermission'
  })
}

export function getToken () {
  return connector
    .$send({
      target: 'main',
      type: 'getToken'
    })
    .then(token => {
      sessionStorage.setItem('token', token)
      return token
    })
}

export function isMain () {
  return connector.isMain()
}


function getFiledValue (origin, ...fileds) {
  const result = {}
  fileds = fileds.flat();
  for (const key of fileds) {
    result[key] = origin[key]
  }
  return result
}
