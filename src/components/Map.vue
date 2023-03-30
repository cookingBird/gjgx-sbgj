<template>
  <div class="map-container">
    <gislife-map v-if="appConfig.baseUrl" v-on="$listeners" ref="map" :appcode="appConfig.appCode"
      :baseUrl="appConfig.baseUrl" :requestHeader="requestHeader" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestHeader: {},
      appConfig: window.URL_CONFIG
    }
  },
  created() {
    this.$connector.$on(this, 'token', ({ data }) => {
      this.requestHeader.token = data
    })
  },
  methods: {
    resize() {
      this.$refs['map'].resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 100%;

  ::v-deep .map-type-controller {
    display: none;
  }
}
</style>
