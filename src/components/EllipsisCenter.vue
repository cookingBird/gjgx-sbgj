<template>
<div
  ref="container"
  :data-overflow="isOverflow"
  class="gislife-ellipsis-container"
>
  <div
    class="gislife-ellipsis-left"
    ref="text"
  > {{text}} </div>
  <div
    v-if="isOverflow"
    class="gislife-ellipsis-right"
  >
    <span>{{text}}</span>
  </div>
</div>
</template>
<script>
  export default {
    props: ['text'],
    data() {
      return {
        isOverflow: false
      }
    },
    mounted() {
      this.calcIsOverFlow()
    },
    updated() {
      this.calcIsOverFlow()
    },
    methods: {
      calcIsOverFlow() {
        const { text, container } = this.$refs;
        if (text && (text.offsetWidth > container.offsetWidth)) {
          this.isOverflow = true;
        }
      }
    }
  }
</script>
<style lang='css' scoped>
  .gislife-ellipsis-container {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .gislife-ellipsis-container>* {
    flex-grow: 1;
    flex-shrink: 1;
    height: 100%;
  }

  .gislife-ellipsis-container[data-overflow] .gislife-ellipsis-left {
    overflow: hidden;
    text-overflow: "";
    white-space: wrap;
    box-decoration-break: clone;
    max-width: 7em;
  }

  .gislife-ellipsis-right {
    overflow: hidden;
    text-overflow: ellipsis;
    direction: rtl;
    white-space: nowrap;
    transform: translateX(-3px);
  }

  .gislife-ellipsis-right span {
    direction: ltr;
    unicode-bidi: bidi-override;
  }

  ;
</style>
