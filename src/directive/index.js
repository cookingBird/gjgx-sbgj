import Observe from './observe'
import full from './full'
import auth from './auth'

const Plugins = [auth, Observe, full]
export default {
  install: InstallAllPlg
}

function InstallAllPlg (Vue) {
  Plugins.forEach(plg => Vue.use(plg))
}
