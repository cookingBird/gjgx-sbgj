import Vue from 'vue'
import App from './App.vue'
import components from './components'
import router from './router'
import store from './store'
import scroll from 'vue-seamless-scroll'
import dataV from '@jiaminghi/data-view'
import vueRef from 'vue-ref'
import gislife from 'gislife-library'
import 'gislife-library/packages/theme-chalk/lib/index.css'
import ElementUI from 'element-ui'
import Message from '@gislife/micro-message'
import { getParams } from '@gislife/micro-message/src/util/getParams.js'
import '@gislife/micro-message/dist/micro-message.css'
import Directives from './directive'
import Table from '@/components/table'
import Map from '../public/2D/main'
import './error'
import '@/assets/element_custom/index.css'
import './assets/style/index.scss'
import './assets/tailwind.css'
import './message'

Vue.use(vueRef)
Vue.use(scroll)
Vue.use(dataV)
Vue.use(Message)
Vue.use(gislife)
Directives.install(Vue)
Vue.use(ElementUI)
Vue.use(components)
Vue.component('common-table', Table)

Vue.prototype.$Map = Map
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
