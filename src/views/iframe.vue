<template>
<div
  v-loading="loading"
  class="micro-app-container"
>
  <micro-app
    ref="iframe"
    :src="src"
    frameborder="0"
    :microAppCode="code"
    :state="$route"
  ></micro-app>
</div>
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
      },
      iframe () {
        console.log('object',this.$refs['iframe'].$refs['window']);
        return this.$refs['iframe'].$refs['window']
      }
    },
    created () {
      console.log('created-----------------------------')
      this.$nextTick(this.onLoaded)
    },
    activated () {
      console.log('activated--------------------------');
      this.loading = true;
    },
    methods: {
      /**
       * 
       * @param {HTMLIFrameElement} el 
       */
      onLoaded (el = this.iframe) {
        el.addEventListener('load',() => {
          this.loading = false;
        })
      }
    }
  };
</script>

<style lang="css">
  .micro-app-container {
    width: 100%;
    height: 100%;
  }

  ::v-deep.micro-app-container iframe {
    width: 100%;
    height: 100%;
  }
</style>
