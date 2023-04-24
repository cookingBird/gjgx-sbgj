import { Loading } from 'element-ui'
import './loading.css'
const FakeProgress = require('fake-progress')
export default function createLoading (ref, fakeOptions = {}) {
  const el = (ref && ref.$el) || ref
  let loadingService, timer
  const pro = new FakeProgress({
    timeConstant: 7000,
    autoStart: false,
    ...fakeOptions
  })
  const defaultLoadingOpts = {
    target: el,
    text: '拼命加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  }
  const span = document.createElement('span')
  span.classList.add('gislife-loading-progress-span')
  if (this) {
    this.$on('hook:beforeDestroy', end)
  }
  function start (options = {}) {
    timer = setInterval(() => {
      span.innerText = parseInt(pro.progress * 100) + '%'
    }, 100)
    loadingService = Loading.service(
      Object.assign(defaultLoadingOpts, fakeOptions, options)
    )
    if (fakeOptions.progress || options.progress) {
      const container =
        loadingService.$el.querySelector('.el-loading-text') ||
        loadingService.$el.querySelector('.el-loading-spinner')
      const isExist = container.querySelector('gislife-loading-progress-span')
      if (!isExist) {
        container.appendChild(span)
      }
    }
    pro.start()
  }
  function end () {
    pro.end()
    timer && clearInterval(timer)
    loadingService && loadingService.close()
  }
  return {
    start,
    stop () {
      pro.stop()
    },
    end
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
