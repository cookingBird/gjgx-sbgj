import createRefMixin from './createRef'

export const createMap = (refName, via = '$refs') =>
  createRefMixin('mapLifecycle', ['loaded'])(refName, via)

export const createTable = (refName, via = '$refs') =>
  createRefMixin('lifecycle', ['created', 'mounted', 'beforeDestroyed'])(
    refName,
    via
  )

export default {
  createMap,
  createTable
}
