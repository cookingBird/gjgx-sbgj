<template>
<div
  v-loading="loading"
  class="micro-app-container"
>
  <micro-app
    v-for="item in list"
    :ref="item.path + 'Ref'"
    v-show="$route.path === item.path"
    :key="item.path"
    :src="src(item.meta.iframeSrc)"
    frameborder="0"
    :microAppCode="item.name"
    :state="$route"
  >
  </micro-app>
</div>
</template>
  
<script>

  import qs from 'qs';

  const caches = new WeakMap();

  export default {
    data () {
      return {
        loading: true,
      };
    },
    watch: {
      '$route.path': {
        immediate: true,
        handler: function (val) {
          this.addOnloadEventListener(val);
        }
      }
    },
    computed: {
      src () {
        return function (src) {
          return src + '?' + qs.stringify(this.$route.query)
        }
      },
      code () {
        return this.$store.state.auth.navActiveCode;
      },
      list () {
        return this.$store.state.history.list;
      }
    },

    methods: {
      addOnloadEventListener (val) {
        this.$nextTick(() => {
          let iframe = this.$refs[val + 'Ref'][0].$refs['window'];
          if (!caches.has(iframe)) {
            this.loading = true;
            iframe.addEventListener('load',() => {
              this.loading = false;
              caches.set(iframe,true);
            })
          }
        })
      },
    }
  };
</script>
  
<style lang="scss">
.micro-app-container {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
  