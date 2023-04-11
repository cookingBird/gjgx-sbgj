import Block from 'js-stack-utility'
export default function () {
  return {
    created () {
      /**@description map loaded */
      this.lifecycle = {
        created: new Block(),
        mounted: new Block(),
        beforeDestory: new Block()
      }
      this.lifecycle.created.setReady()
    },
    mounted () {
      this.lifecycle.mounted.setReady()
    },
    beforeDestroy () {
      this.lifecycle.beforeDestory.setReady()
    },
    methods: {
      createdReady () {
        return this.lifecycle.created.ready()
      },
      mountedReady () {
        return this.lifecycle.mounted.ready()
      },
      beforeDestoryReady () {
        return this.lifecycle.beforeDestory.ready()
      }
    }
  }
}
