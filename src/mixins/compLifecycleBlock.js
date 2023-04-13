import Block from 'js-stack-utility'
export default function () {
  return {
    created () {
      /**@description map loaded */
      this.lifecycle = {
        created: new Block(),
        mounted: new Block(),
        beforeDestroy: new Block()
      }
      this.lifecycle.created.setReady()
    },
    mounted () {
      this.lifecycle.mounted.setReady()
    },
    beforeDestroy () {
      this.lifecycle.beforeDestroy.setReady()
    },
  }
}
