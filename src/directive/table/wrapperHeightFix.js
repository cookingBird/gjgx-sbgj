const fixTableBodyWrapper = (function () {
  let timer,
    done = false
  return function fixTableBodyWrapper (el, cb) {
    console.log('fixTableBodyWrapper----------', el)
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      const tableHeight = el.getBoundingClientRect().height
      const tableHeaderHeight = el
        .querySelector('.el-table__header-wrapper')
        .getBoundingClientRect().height
      const bodyHeight = Math.floor(tableHeight - tableHeaderHeight)
      el.querySelector('.el-table__body-wrapper').style.height =
        bodyHeight + 'px'
      el.querySelector('.el-table__body-wrapper').style.overflowY = 'scroll'

      cb &&
        (() => {
          !done && cb(bodyHeight)
          done = true
        })()

      timer = void 0
    }, 300)
  }
})()

export default fixTableBodyWrapper
