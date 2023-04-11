<template>
<div
  id="app"
  :class="{ homepageBgColor: $route.path == '/home' || $route.path == '/main/home'}"
>
  <router-view />
</div>
</template>

<script>
  import ref from './mixins/ref';
  import { getToken,isMain } from './message';

  export default {
    mixins: [ref],
    provide () {
      return {
        appCtx: this,
      }
    },
    created () {
      //获取登录用户信息
      if (isMain()) {
        this.$store.dispatch("auth/getPermission");
      } else {
        getToken().then(_ => {
          this.$store.dispatch("auth/getPermission");
        })
      }
      // sessionStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpcCI6IjE5Mi4xNjguMS4yMzYiLCJleHAiOjE2ODA5Mzg0OTUsInVzZXJJZCI6MSwidXNlcm5hbWUiOiJhZG1pbiJ9.QeNwtz9w-gJr0jiJmpVNIPxzHxnemsirVKdvDRLDUq4")
    },
    methods: {
      makeUrl (path) {
        return window.URL_CONFIG.baseUrl + path
      }
    }
  };
</script>

<style lang="scss" >
@import "@/assets/style/main.scss";

* {
  background-color: transparent;
  box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100%;
  background-color: #e6eef7;
}
</style>
