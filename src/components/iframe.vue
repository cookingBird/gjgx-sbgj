<template>
  <div
    class="iframe-container"
    ref="iframe-container"
    v-loading="loading"
    element-loading-text="页面加载中..."
  ></div>
</template>

<script>
export default {
  props: {
    src: {
      require: true,
      type: String,
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    this.createIframe();
  },
  methods: {
    createIframe() {
      const iframe = document.createElement("iframe");
      iframe.src = this.src;
      iframe.onload = () => {
        this.loading = false;
      };
      this.$refs["iframe-container"].appendChild(iframe);
    },
  },
};
</script>

<style lang="scss" scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  ::v-deep iframe {
    width: 100%;
    height: 100%;
  }
}
</style>