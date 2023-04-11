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
  >
  </micro-app>
</div>
</template>
  
<script>

  import qs from 'qs';

  export default {
    data () {
      return {
        loading: true,
      };
    },
    computed: {
      src () {
        return this.$route.meta.iframeSrc + '?' + qs.stringify(this.$route.query)
      },
      code () {
        return this.$store.state.auth.navActiveCode;
      },
      iframe () {
        return this.$refs['iframe'].$refs['window']
      }
    },
    watch: {
      src: {
        immediate: true,
        handler (val) {
          if (val) {
            this.loading = true;
            this.$nextTick(this.onLoaded);
          }
        }
      }
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
  