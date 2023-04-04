// import * as PDFJS from "pdfjs-dist/legacy/build/pdf";
import Request from '@/utils/request'

export function remove (id) {
  return Request.request({
    method: 'delete',
    url: `/criterion/delete/${id}`
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  })
}

export function addOrUpdate (data) {
  const formData = new FormData()
  Object.entries(data).forEach(item => {
    formData.append(item[0], item[1])
  })
  return Request.request({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/criterion/createOrUpdate',
    data: formData
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  })
}

export function query (query) {
  return Request.request({
    method: 'post',
    url: '/criterion/list',
    data: query
  }).then(res => {
    if (res.code === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject()
    }
  })
}


// export function renderPdf (srcUrl, canvasID) {
//   fetch(srcUrl).then(response => {
//     response.arrayBuffer().then(buffer => {
//       // 设置pdf.worker.js文件的引入地址
//       PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.entry.js')
//       // data是一个ArrayBuffer格式，也是一个buffer流的数据
//       PDFJS.getDocument(buffer).promise.then(pdfDoc => {
//         const numPages = pdfDoc.numPages // pdf的总页数
//         // 获取第1页的数据
//         pdfDoc.getPage(1).then(page => {
//           // 设置canvas相关的属性
//           const canvas = document.getElementById(canvasID)
//           const ctx = canvas.getContext('2d')
//           const dpr = window.devicePixelRatio || 1
//           const bsr =
//             ctx.webkitBackingStorePixelRatio ||
//             ctx.mozBackingStorePixelRatio ||
//             ctx.msBackingStorePixelRatio ||
//             ctx.oBackingStorePixelRatio ||
//             ctx.backingStorePixelRatio ||
//             1
//           const ratio = dpr / bsr
//           const viewport = page.getViewport({ scale: 1 })
//           canvas.width = viewport.width * ratio
//           canvas.height = viewport.height * ratio
//           canvas.style.width = viewport.width + 'px'
//           canvas.style.height = viewport.height + 'px'
//           ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
//           const renderContext = {
//             canvasContext: ctx,
//             viewport: viewport
//           }
//           // 数据渲染到canvas画布上
//           page.render(renderContext)
//         })
//       })
//     })
//   })
// }
