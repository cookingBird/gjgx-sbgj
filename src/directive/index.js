import store from '@/store'
import router from '@/router'
import { connector } from '@gislife/micro-message'
import Observe from './observe'
const Auth = { install }

const Plugins = [Auth, Observe]
function InstallAllPlg (Vue) {
  Plugins.forEach(plg => Vue.use(plg))
}
export default {
  Observe,
  install: InstallAllPlg
}

function isAuthed (funcCode, state) {
  return !!state.mainBtnAuthed.find(n => n.funCode === funcCode)
}

function getButtonInfo (funcCode, state) {
  return state.mainBtnAuthed.find(n => n.funCode === funcCode)
}

function install (vue, options = {}) {
  vue.directive(options.name || 'auth', {
    inserted (el, binding) {
      const code = binding.value
      if (!isAuthed(code, store.state.auth)) {
        el.parentNode && el.parentNode.removeChild(el)
      } else {
        const info = getButtonInfo(code, store.state.auth)
        el.addEventListener('click', () => {
          if (connector.isMain()) {
            //主应用
            switch (info.openMode) {
              case 'self': {
                router.push(info.route)
                return
              }
              case 'iframe': {
                //* 按钮的打开方式不能是iframe
                return
              }
              case 'black': {
                //* 由开发绝对按钮的点击行为
                return
              }
              case 'open': {
                window.open(info.reqPath)
              }
            }
          } else {
            //子应用
            switch (info.openMode) {
              case 'self': {
                connector.$send({
                  target: 'main',
                  type: 'router',
                  data: {
                    to: info.route
                  }
                })
                return
              }
              case 'iframe': {
                //* 按钮的打开方式不能是iframe
                return
              }
              case 'black': {
                //* 由开发绝对按钮的点击行为
                return
              }
              case 'open': {
                connector.$send({
                  target: 'main',
                  type: 'open',
                  data: {
                    to: info.reqPath
                  }
                })
                return
              }
            }
          }
        })
      }
    }
  })
  vue.directive('height', (el, bind) => {
    let value = bind.value;
    let height =
      value === 0 || value ? `calc(${bind.arg || '100%'} - ${value}px)` : bind.arg;
    el.style.height = height;
  });
  vue.directive('width', (el, bind) => {
    let value = bind.value;
    let width = value === 0 || value ? `calc(${bind.arg || '100%'} - ${value}px)` : bind.arg;
    el.style.width = width;
  });
}
