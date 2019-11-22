module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')
    config.optimization.runtimeChunk({
      name: 'runtime'
    })
    config.optimization.splitChunks({
      chunks: 'async', // 默认作用于异步chunk，值为all/initial/async/function(chunk),
      minSize: 30000, // 表示在压缩前的最小模块大小,默认值是30kb
      minChunks: 1, // 表示被引用次数，默认为1；
      maxAsyncRequests: 5, // 所有异步请求不得超过5个
      maxInitialRequests: 3, // 初始话并行请求不得超过3个
      automaticNameDelimiter: '~', // 名称分隔符，默认是~
      name: true, // 打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
      cacheGroups: {
        // 脚本公共代码打包
        vendors: { // 项目基本框架等
          chunks: 'initial',
          test: /(vue|vuex|vue-router|axios|vue-axios|qs)/,
          priority: 100,
          name: 'vendors~base'
        },
        elementUI: { // element-ui单独分离出来
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          minSize: 0,
          name: 'vendors~element-ui',
          priority: 90
        },
        echarts: { // echarts单独分离出来
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          name: 'vendors~echarts',
          maxInitialRequests: 10,
          priority: 80
        },
        commons: { // 其他同步加载公共包
          chunks: 'initial', // 只打包初始时依赖的第三方
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors~commons',
          minSize: 0,
          minChunks: 1,
          maxInitialRequests: 10,
          priority: 70
        },
        'async-commons': { // 异步加载公共包、组件等
          chunks: 'async',
          minChunks: 2,
          name: 'async-commons',
          priority: 60
        }
      }
    })
  }
/*  devServer: {
    port: '8080', // 代理端口
    open: false, // 项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
    proxy: {
      '/': {// 代理api
        target: 'http://traininggatewaydev.gshbzw.com', // 服务器api地址
        changeOrigin: true, // 是否跨域
        ws: false
      }
    }
  } */
}
