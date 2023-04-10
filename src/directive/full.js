export default {
  install (Vue) {
    Vue.directive('full', {
      inserted: updateView,
      componentUpdated: updateView
    })
  }
}

function updateView ($el) {
  if ($el) {
    const style = getComputedStyle($el)
    const ml = style.marginLeft
    const mr = style.marginRight
    $el.style.maxWidth = `calc(100% - ${ml} - ${mr})`

    const mt = style.marginTop
    const mb = style.marginBottom
    $el.style.maxHeight = `calc(100% - ${mt} - ${mb})`
  }
}
