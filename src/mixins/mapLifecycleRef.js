import { requestDom } from '@/utils/misc'
export default function (refName = 'mixMap') {
  return {
    inject: ['getRef'],
    computed: {
      [buildRefName(refName)] () {
        return () => this.getRef(refName)
      }
    },
    methods: {
      async [getName(refName, 'loaded')] (cb) {
        const ref = await requestDom(() => this[buildRefName(refName)]())
        await ref.mapLoadReady()
        cb && cb(ref)
        return ref
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
