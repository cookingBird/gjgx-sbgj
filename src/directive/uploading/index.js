import './index.css'
export default {
  install (Vue) {
    Vue.directive('uploading', {
      bind (el, binding) {
        el.classList.add('gislife-uploading');
        function setProgress (val) {
          el.style.setProperty('--progress', val)
        }
        if (binding.value && typeof binding.value === 'function') {
          binding.value(val => {
            if (typeof val === 'number') {
              if (String(val).includes('.') || val === 1) {
                setProgress(val)
              } else if (val <= 100) {
                setProgress(val / 10)
              }
            } else {
              throw Error('type must be number')
            }
          })
        }
      }
    })
  }
}
