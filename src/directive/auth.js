import store from '@/store'
import router from '@/router'
import { connector } from '@gislife/micro-message'

export default {
  install
}

function isAuthed(funcCode, state) {
  return connector.isMain()
    ? state.funCode.find(code => code == funcCode)
    : state.mainBtnAuthed.find(btn => btn.funCode == funcCode)
}

function getButtonInfo(funcCode, state) {
  return connector.isMain()
    ? state.btnInfo.find(btn => btn.funCode == funcCode)
    : state.mainBtnAuthed.find(btn => btn.funCode == funcCode)
}

function install(vue, options = {}) {
  vue.directive(options.name || 'auth', {
    async inserted(el, binding) {
      const code = binding.value;
      await new Promise((resolve) => { setTimeout(resolve, 500) });
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
    let value = bind.value
    let height =
      value === 0 || value
        ? `calc(${ bind.arg || '100%' } - ${ value }px)`
        : bind.arg
    el.style.height = height
  })
  vue.directive('width', (el, bind) => {
    let value = bind.value
    let width =
      value === 0 || value
        ? `calc(${ bind.arg || '100%' } - ${ value }px)`
        : bind.arg
    el.style.width = width
  })
}
