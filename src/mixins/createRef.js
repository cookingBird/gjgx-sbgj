import { requestDom } from '@/utils/misc'
export default function createRefMixin (LIFECYCLE_FILED, LIFECYCLE) {
  return function (refName, via = 'ctx') {
    return {
      inject: ['getRef'],
      computed: {
        [buildRefName(refName)] () {
          return () =>
            via == 'ctx' || via == 'context'
              ? this.getRef(refName)
              : this.$refs[refName]
        }
      },
      methods: LIFECYCLE.reduce((pre, cur) => {
        return {
          ...pre,
          [getName(refName, cur)]: async function (cb) {
            const ref = await requestDom(() => this[buildRefName(refName)]())
            await ref[LIFECYCLE_FILED][cur].ready()
            cb && cb(ref)
            return ref
          }
        }
      }, {})
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
