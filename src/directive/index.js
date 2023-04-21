import Observe from './observe'
import full from './full'
import auth from './auth'
import uploading from './uploading'

const Plugins = [auth, Observe, full, uploading]
export default {
  install: InstallAllPlg
}

function InstallAllPlg (Vue) {
  Plugins.forEach(plg => Vue.use(plg))
}
