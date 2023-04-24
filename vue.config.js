/** @type {import('@vue/cli-service').ProjectOptions} */
const path = require('path')
const { ElementUiResolver } = require('unplugin-vue-components/resolvers')
const CDN = require('./config/cdn')('')
const transform = require('./config/dataTransform')
module.exports = {
  publicPath: '/',
  lintOnSave: false,
  assetsDir: 'static',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = ''
      args[0].CDN = CDN
      return args
    })
  },
  css: {
    //全局使用
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/style/baseColor.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      // require('unplugin-vue-components/webpack')({
      //   resolvers: [ElementUiResolver()],
      //   dts: false,
      //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      //   importStyle: false
      // })
    ]
    // externals:
    // process.env.NODE_ENV === 'production'
    //   ? {
    //       'element-ui': 'ElementUI'
    //     }
    //   : {}
  },
  devServer: {
    port: 8091,
    proxy: {
      '/': {
        target: 'http://192.168.3.53:17878/',
        bypass: transform
      }
    }
  }
}
