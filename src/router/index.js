import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewRouter from '@/views/viewRouter'
import Iframe from '@/views/iframe'
import Layout from '@/views/index'
import Main from '@/views/main'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: []
})

router.beforeEach((to, from, next) => {
  if (to.query.token) {
    sessionStorage.token = to.query.token;
    delete to.query.token;
    next({
      path:to.path,
      query:to.query
    })
  }else{
    next()
  }
})

router.createRouter = function (menuList) {
  const route = {
    path: '/',
    name: 'root',
    component: ViewRouter,
    redirect: '/main',
    children: [
      //权限系统生成路由
      {
        path: '/main',
        name: 'main',
        component: Main,
        children: []
      },
      //业务页面静态路由
      {
        path: '/DiscernStandardManage',
        component: () => import('@/views/DiscernStandardManage')
      },
      {
        path: '/PotentialEffectAnalysis',
        component: () => import('@/views/PotentialEffectAnalysis')
      },
      {
        path: '/GhgqDiscern',
        component: () => import('@/views/GhgqDiscern')
      },
      {
        path: '/detail',
        component: () => import('@/views/detail.vue')
      },
      {
        path: '/DiscernSteps',
        component: () => import('@/views/GhgqDiscern/stepLayout.vue'),
        redirect: '/DiscernSteps/choose',
        children: [{
            path: '/DiscernSteps/choose',
            component: () => import('@/views/GhgqDiscern/choose.vue'),
            meta: {
              step: 1,
              name: '管道选择'
            }
          },
          {
            path: '/DiscernSteps/section',
            component: () => import('@/views/GhgqDiscern/section.vue'),
            meta: {
              step: 2,
              name: '管道分段'
            }
          },
          {
            path: '/DiscernSteps/level',
            component: () => import('@/views/GhgqDiscern/level.vue'),
            meta: {
              step: 3,
              name: '管道等级划分'
            }
          },
          {
            path: '/DiscernSteps/discern',
            component: () => import('@/views/GhgqDiscern/discern.vue'),
            meta: {
              step: 4,
              name: '高后果区识别'
            }
          }
        ]
      },
      {
        path: '/DiscernResultManage',
        component: () => import('@/views/DiscernResultManage')
      },
      {
        path: '/DiscernResultManage/detail',
        component: () => import('@/views/DiscernResultManage/detail.vue')
      },
      {
        path: '/DiscernResultManage/contrast',
        component: () => import('@/views/DiscernResultManage/contrast.vue')
      }
    ]
  }

  const loop = (arr, target) => {
    arr.forEach(item => {
      const {
        funCode,
        route,
        children,
        funName,
        reqPath,
        funType,
        openMode
      } =
      item
      //按钮类型不创建路由
      if (funType === 1) return
      const option = {
        path: route,
        name: funCode,
        meta: {
          name: funName,
          iframeSrc: reqPath,
          type: funType
        },
        children: []
      }

      option.component = openMode === 'iframe' ? Iframe : Layout
      target.push(option)
      if (children instanceof Array) {
        let c = children.filter(item => item.funType !== 1)
        if (c.length) {
          option.redirect = children[0].route
        }
        loop(children, option.children)
      }
    })
  }
  loop(menuList, route.children[0].children)
  this.addRoute(route)
}
export default router
