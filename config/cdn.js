const CDN = {
  // js: ['/cdn/element-ui.umd.js'],
  js: [],
  css: []
}

module.exports = function (mode) {
  const getMapCdn = require('./map')
  const mapCdn = getMapCdn(mode)
  // return {
  //   js: [],
  //   css: []
  // }
  return {
    js: mapCdn.js.concat(CDN.js),
    css: mapCdn.css.concat(CDN.css)
  }
}
