import AuthVue from "./Auth.vue";
import FolderBlock from './FolderBlock.vue';

const components = [AuthVue,FolderBlock];


export default {
  install(Vue) {
    components.forEach(com => {
      Vue.component(com.name, com)
    })
  }
}
