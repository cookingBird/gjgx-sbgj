import { requestDom } from '@/utils/misc'
export default function (refName = 'mixTable') {
  return {
    inject: ['getRef'],
    computed: {
      [buildRefName(refName)] () {
        return () => this.getRef(refName)
      }
    },
    methods: {
      async [getName(refName, 'created')] (cb) {
        await requestDom(() => this[buildRefName(refName)]())
        const refCtx = this[buildRefName(refName)]()
        await refCtx.createdReady()
        cb && cb(refCtx)
        return refCtx
      },
      async [getName(refName, 'mounted')] (cb) {
        await requestDom(() => this[buildRefName(refName)]())
        const refCtx = this[buildRefName(refName)]()
        await refCtx.mountedReady()
        cb && cb(refCtx)
        return refCtx
      },
      async [getName(refName, 'beforeDestory')] (cb) {
        await requestDom(() => this[buildRefName(refName)]())
        const refCtx = this[buildRefName(refName)]()
        await refCtx.beforeDestoryReady()
        cb && cb(refCtx)
        return refCtx
      }
    }
  }
}

function buildRefName (name) {
  return name + 'Ref'
}

function getName (name, lifeCycle) {
  return 'sync' + camelToPascal(name) + camelToPascal(lifeCycle)
}

function camelToPascal (name) {
  return name[0].toUpperCase() + name.slice(1)
}
