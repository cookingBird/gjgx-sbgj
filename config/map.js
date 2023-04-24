const mapBox2DJs = [
  '/2D/mapboxgl/mapbox-gl.js',
  '/2D/mapboxgl/mapbox-gl-enhance.js',
  '/2D/mapboxgl/iclient-mapboxgl.min.js',
  '/2D/mapboxgl/iclient-mapboxgl-es6.min.js',
  '/2D/mapboxgl/echarts.min.js',
  '/2D/mapboxgl/EchartsLayer.min.js',
  '/2D/mapboxgl/echarts-liquidfill.min.js',
  '/2D/mapboxgl/turf.min.js',
  '/2D/mapboxgl/terraformer.js',
  '/2D/mapboxgl/terraformer-wkt-parser.js',
  '/2D/mapboxgl/transform.js'
]
const mapBox2DCss = [
  '/2D/mapboxgl/mapbox-gl.css',
  '/2D/mapboxgl/mapbox-gl-enhance.css',
  '/2D/mapboxgl/iclient-mapboxgl.css',
  '/2D/mapboxgl/iclient-mapboxgl.min.css',
  '/2D/mapboxgl/iclient-mapboxgl-vue.css',
  '/2D/mapboxgl/pop.css'
]
const cesium3DJs = [
  '/3D/Cesium/Cesium.js',
  '/3D/Cesium/JS/SuperMap-7.1-11828.js',
  '/3D/Cesium/ThirdParty/Workers/PlotAlgo/PlotAlgoInclude.js',
  '/3D/Cesium/JS/Lang/zh-CN.js',
  '/3D/Cesium/JS/tooltip.js',
  '/3D/Cesium/JS/kriging-contour.js',
  '/3D/Cesium/JS/gauge.min.js'
]
const cesium3DCommon = [
  '/3D/Cesium/JS/turf.min.js',
  '/3D/Cesium/JS/terraformer.js',
  '/3D/Cesium/JS/terraformer-wkt-parser.js',
  '/3D/Cesium/JS/transform.js'
]

const cesium3DCss = [
  '/3D/Cesium/CSS/pretty.css',
  '/3D/Cesium/Widgets/widgets.css'
]

module.exports = function getCDN (mode) {
  if (!mode) return { js: [], css: [] }
  if (mode.toLowerCase() === '2d') {
    return {
      js: mapBox2DJs,
      css: mapBox2DCss
    }
  }
  if (mode.toLowerCase() === '3d') {
    return {
      js: cesium3DJs.concat(cesium3DCommon),
      css: cesium3DCss
    }
  }

  return {
    js: mapBox2DJs.concat(cesium3DJs),
    css: mapBox2DCss.concat(cesium3DCss)
  }
}
