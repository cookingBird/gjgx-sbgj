const fixTableBodyWrapper = (function () {
  let timer
  return function fixTableBodyWrapper (el) {
    timer && cancelAnimationFrame(timer)
    timer = requestAnimationFrame(() => {
      const tableHeight = el.getBoundingClientRect().height
      const tableHeaderHeight = el
        .querySelector('.el-table__header-wrapper')
        .getBoundingClientRect().height
      const bodyHeight = Math.floor(tableHeight - tableHeaderHeight)
      el.querySelector('.el-table__body-wrapper').style.height =
        bodyHeight + 'px'
      timer = void 0
    })
  }
})()

export default fixTableBodyWrapper
