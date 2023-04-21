import { Loading } from 'element-ui'
import './loading.css'
const FakeProgress = require('fake-progress')
export default function createLoading (ref, fakeOptions = {}) {
  if (!ref) {
    throw Error('create Loading error, ref is null')
  }
  const el = ref.$el || ref
  let loadingService, timer
  const pro = new FakeProgress({
    timeConstant: 7000,
    autoStart: false,
    ...fakeOptions
  })
  const defaultLoadingOpts = {
    target: el,
    text: '拼命加载中',
    spinner: 'el-icon-loading'
    // background: 'rgba(0, 0, 0, 0.8)'
  }
  const span = document.createElement('span')
  span.classList.add('gislife-loading-progress-span')
  if (this) {
    this.$on('hook:beforeDestory', () => {
      span.remove()
    })
  }
  return {
    start (options) {
      timer = setInterval(() => {
        span.innerText = parseInt(pro.progress * 100) + '%'
      }, 100)
      loadingService = Loading.service(
        Object.assign(defaultLoadingOpts, options)
      )
      const spinner = loadingService.$el.querySelector('.el-loading-text')
      const isExist = el.querySelector('gislife-loading-progress-span')
      if (!isExist) {
        spinner.appendChild(span)
      }
      pro.start()
    },
    stop () {
      pro.stop()
    },
    end () {
      pro.end()
      clearInterval(timer)
      setTimeout(() => {
        loadingService?.close()
      }, 100)
    }
  }
}

/**
 *
 * @param {*} ref loading元素的ref
 * @param {timer} timer router.push方法的滞后时间,单位毫秒
 * @param {*} fakeStartOps
 * @param {*} fakeOptions
 * @returns
 */
export function createRouterPushLoading (ref, timer, fakeStartOps, fakeOptions) {
  const loadingMask = createLoading(ref, fakeOptions)
  this.$on(
    'hook:beforeDestroy',
    proxyRouterPush.bind(this)(loadingMask, fakeStartOps, timer)
  )
  return loadingMask
}

function proxyRouterPush (loadingInstance, ops, timer = 500) {
  const rawPush = this.$router.push
  this.$router.push = param => {
    loadingInstance.start(ops)
    setTimeout(() => {
      loadingInstance.end()
      rawPush.bind(this.$router)(param)
    }, timer)
  }
  return () => {
    this.$router.push = rawPush
  }
}

export function createBodyLoading (fakeOptions) {
  return createLoading(document.body, fakeOptions)
}
