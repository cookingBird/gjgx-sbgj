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
  import { getToken, isMain } from './message';

  export default {
    mixins: [ref],
    provide() {
      return {
        appCtx: this,
      }
    },
    async created() {
      //获取登录用户信息
      if (isMain()) {
        await this.$store.dispatch("auth/getPermission");
      }
      else {
        await getToken();
        await this.$store.dispatch("auth/getPermission");
      }
    },
    methods: {
      makeUrl(path) {
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
