import router from '@/router'
import store from '@/store'
import { connector } from '@gislife/micro-message'
import { logout } from '@/api/base'
import { Message } from 'element-ui'
import qs from 'qs'

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
     * @description 子应用在当前跳转
     */
    connector.$on(null, 'routeReplace', ({ data, responser }) => {
      //获取后台配置路由信息
      const travel = getTreeTraveler({
        every (node) {
          if (node.route === data.path) {
            if (node.reqPath) {
              if (node.reqPath.includes('?')) {
                throw Error(`
                node.reqPath should not has search query;\n 
                node.reqPath is ${node.reqPath}`)
              }
              if (data.query) {
                responser(node.reqPath + '?' + qs.stringify(data.query))
              } else {
                responser(node.reqPath)
              }
            } else {
              throw Error(`on routeReplace error;\n 
              data.path is ${data.path}; \n
              node.reqPath is ${node.reqPath};`)
            }
          }
        }
      })
      store.state.auth.userinfo.fun.forEach(travel)
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
  } else {
    /**
     * @description 子应用路由跳转替换当前页面
     */
    connector.$on(null, 'routeReplace', ({ data }) => {
      const search = location.href.split('?')[1]
      if (search) {
        location.href = data + '&microAppCode=' + connector.appCode
      } else {
        location.href = data + '?microAppCode=' + connector.appCode
      }
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

/**
 * @deprecated 请使用 getTreeTraveler
 * @param {*} target
 * @returns traveler
 */
export function treeTravels (target) {
  return visitor => {
    const travel = getTreeTraveler(visitor)
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
  fileds = fileds.flat()
  for (const key of fileds) {
    result[key] = origin[key]
  }
  return result
}

export function getTreeTraveler (visitor, childrenKey = 'children') {
  const { firstEnter, every } = visitor || {}
  return target => {
    function travel (tar, isFirst = true) {
      if (isFirst) {
        firstEnter && firstEnter(tar)
      }
      if (Array.isArray(tar)) {
        tar.forEach(element => {
          travel(element, false)
        })
      } else if (typeof tar === 'object') {
        every && every(tar)
        if (tar[childrenKey] && tar[childrenKey].length) {
          travel(tar[childrenKey], false)
        }
      }
    }
    travel(target)
  }
}
