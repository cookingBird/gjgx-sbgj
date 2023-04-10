const fillEmptyRow = (function () {
  let timer
  return function triggerObserve (entry) {
    return new Promise((resolve, reject) => {
      timer && clearTimeout(timer)
      const tableNode = entry.target
      //移除之前添加的fill节点
      const fillNodes = tableNode.querySelectorAll(
        '.el-tale__row-empty-fill-tag'
      )
      fillNodes.forEach(node => node.remove())
      timer = setTimeout(() => {
        //表是否存在行内容
        const rowContent = tableNode.querySelector(
          '.el-table__body-wrapper .el-table__row'
        )
        if (rowContent) {
          //*存在行内容，复制行，并设置行内容为空
          const rowElClone = rowContent.cloneNode(true)
          rowElClone.classList.add('el-tale__row-empty-fill-tag')
          const rowNodeCloneChildren = rowElClone.childNodes
          for (const rowNodeCloneChild of rowNodeCloneChildren) {
            if (rowNodeCloneChild.hasChildNodes()) {
              rowNodeCloneChild.childNodes.forEach(node => {
                node.remove()
              })
            }
          }
          //!计算需要插入的行数
          //*1、计算table的剩余高度
          const wrapper = tableNode.querySelector('.el-table__body-wrapper')
          const content = tableNode.querySelector('.el-table__body')
          const restHeight =
            wrapper.getBoundingClientRect().height -
            content.getBoundingClientRect().height
          //*2、计算行高度
          const rowNodeHeight = rowContent.getBoundingClientRect().height
          //*3、得到空行数
          const rowNum = Math.floor(restHeight / rowNodeHeight)
          //*4、插入空行
          const contentEl = tableNode.querySelector('.el-table__body tbody')
          for (let i = 0; i < rowNum; i++) {
            const appendingNode = rowElClone.cloneNode(true)
            appendingNode.style.height = rowNodeHeight + 'px'
            contentEl.appendChild(appendingNode)
          }
          //*fixed表格
          const fixedEl = tableNode.querySelector(
            '.el-table__fixed-body-wrapper .el-table__body tbody'
          )
          for (let i = 0; i < rowNum; i++) {
            const appendingNode = rowElClone.cloneNode(true)
            appendingNode.style.height = rowNodeHeight + 'px'
            fixedEl.appendChild(appendingNode)
          }
          resolve(rowNum)
        }
        timer = void 0
      }, 300)
    })
  }
})()
export default fillEmptyRow
