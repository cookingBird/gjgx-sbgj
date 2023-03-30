import Fix from './table/wrapperHeightFix'
import fillEmptyRow from './table/fillEmptyRow'
import calcRow from './table/calcRow'

const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    observedMap.get(entry.target) &&
      observedMap.get(entry.target).forEach(cb => cb(entry))
  }
})
const observedMap = new WeakMap()

function setObserve (el, val) {
  observedMap.set(el, (observedMap.get(el) || []).concat(val))
}

function recordObserve (el, binding) {
  const arg = binding.arg
  if (arg) {
    switch (arg) {
      case 'tableEmptyRow': {
        setObserve(el, fillEmptyRow)
        break
      }
      case 'tableCalcRow': {
        if (!binding.value || !binding.value.callback) {
          throw Error('observe tableCalcRow error')
        }
        const { height, callback } = binding.value
        setObserve(el, entry => {
          calcRow(entry, height).then(rowNum => callback(rowNum))
        })
        break
      }
      case 'tableWrapperFix': {
        setObserve(el, entry => Fix(entry.target))
        break
      }
      default: {
        if (binding.value) {
          setObserve(el, binding.value)
        }
      }
    }
  }
}

function install (Vue) {
  Vue.directive('observe', {
    bind (el, binding, vnode) {},
    inserted (el, binding, vnode) {
      observer.observe(el)
      recordObserve(el, binding)
    },
    unbind (el, binding, vnode) {}
  })
}

export default {
  install
}
