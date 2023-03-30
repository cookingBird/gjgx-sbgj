import { getPermission } from '@/api/base'
import router from '@/router'
import _ from 'lodash'
import { getMainPath, treeTravels, isMain } from '@/message'

export default {
  namespaced: true,
  state: {
    appCode: '',
    userName: '',
    menuData: [],
    userinfo: {},
    viewPageId: null,
    navActiveCode: null,
    mainLocation: {},
    mainBtnAuthed: []
  },
  mutations: {
    SET_PREMISSION (state, data) {
      const { userName, fun, appCode } = data
      state.userinfo = data
      state.userName = userName
      state.appCode = appCode
      state.menuData = fun
      state.menuData && router.createRouter(state.menuData)
    },
    SET_VIEWPAGE_ID (state, data) {
      state.viewPageId = data
      // state.viewPageId = "1639232056653504514";
    },
    SET_NAV_ACTIVE_CODE (state, data) {
      state.navActiveCode = data
    },
    SET_MAIN_LOCATION (state, data) {
      console.log(data)
      Object.assign(state.mainLocation, data)
    }
  },
  actions: {
    getPermission ({ commit, state }) {
      return getPermission().then(({ code, data }) => {
        if (code === 200) {
          commit('SET_PREMISSION', data)
          if (!isMain()) {
            //todo 获取主应用pathname
            getMainPath()
              .then(data => {
                commit('SET_MAIN_LOCATION', data)
              })
              .then(() => {
                //todo 查找当前应用的权限配置
                const travel = treeTravels(state.menuData)
                const { pathname } = state.mainLocation
                console.log(pathname)
                travel({
                  every (node) {
                    if (node.route === pathname) {
                      console.log('every node === pathname', node)
                      let children = node.children || []
                      children.forEach(cn => {
                        if (cn.funType === 1) {
                          const indexOf = state.mainBtnAuthed.findIndex(
                            n => n.funCode === cn.funCode
                          )
                          if (indexOf > -1) {
                            state.mainBtnAuthed.splice(indexOf, 1, cn)
                          } else {
                            state.mainBtnAuthed.push(cn)
                          }
                        }
                      })
                    }
                  }
                })
                console.log('state.mainBtnAuthed', state.mainBtnAuthed)
              })
          }
        }
      })
    }
  },
  getters: {
    subnavMenu: state => {
      let { menuData, navActiveCode } = state
      menuData = _.cloneDeep(menuData)
      let res = []
      while (menuData.length) {
        const node = menuData.shift()
        if (node.funCode === navActiveCode) {
          res = node.children
          menuData = []
        } else {
          node.children && menuData.push(...node.children)
        }
      }
      return res
    }
  }
}
