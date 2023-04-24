import Block from 'js-stack-utility'
export default function () {
  return {
    created () {
      /**@description map loaded */
      this.mapLifecycle = {
        loaded: new Block()
      }
    },
    methods: {
      setMapLoaded () {
        this.mapLifecycle.loaded.setReady()
      }
    }
  }
}
