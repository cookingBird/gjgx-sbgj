import AuthVue from "./Auth.vue";

const components = [AuthVue];


export default {
  install(Vue) {
    components.forEach(com => {
      Vue.component(com.name, com)
    })
  }
}
