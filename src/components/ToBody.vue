<template>
<div class="gislife-toBody">
  <slot></slot>
</div>
</template>

<script>
  export default {
    name: 'ToBody',
    mounted () {
      document.body.appendChild(this.$el);
    },
    destroyed () {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    },
  };
</script>
<style>
  .gislife-toBody {
    position: absolute;
    inset: 0;
    z-index: 10;
  }
</style>
