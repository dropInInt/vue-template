const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  // console.info('dirdirdir---','./'+dir)
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
      Vue-cli3:
      Crashed when using Webpack `import()` #2463
      https://github.com/vuejs/vue-cli/issues/2463

     */
  /*
    pages: {
      index: {
        entry: 'src/main.js',
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      }
    },
    */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义主题 */

          //   'primary-color': '#F68524',
          //   'border-radius-base': '4px'‘
          'disabled-color': '#9F9F9F' // 失效色rgba(0, 0, 0, 0.25)
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    // host: '192.168.100.64',
    host: 'localhost',
    // host: '192.168.2.31',
    port: 8020,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js')
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}
