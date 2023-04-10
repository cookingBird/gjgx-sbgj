export default function calcMaxHeight (entry) {
  const tableContainer = entry.target
  const clientRect = tableContainer.getBoundingClientRect()
  const tableStyle = getComputedStyle(tableContainer)
  const paddingTop = parseInt(tableStyle.paddingTop.replace('px', ''))
  const paddingBottom = parseInt(tableStyle.paddingBottom.replace('px', ''))
  return clientRect.height - paddingTop - paddingBottom
}
