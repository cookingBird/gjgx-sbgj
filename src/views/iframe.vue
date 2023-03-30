<template>
  <micro-app
    :src="src"
    frameborder="0"
    :microAppCode="code"
    :state="$route"
  ></micro-app>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
    };
  },
  computed: {
    src () {
      return this.$route.meta.iframeSrc
    },
    code () {
      return this.$store.state.auth.navActiveCode;
    }
  },
};
</script>

<style lang="scss" scoped>
.iframe-container {
  width: 100%;
  height: 100%;

  /deep/iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
