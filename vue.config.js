const path = require('path')
// 传入相对路径，返回绝对路径
function resolve(dir) {
  return path.join(__dirname, dir)
}
// https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    host: 'localhost',
    port: 8080,
    https: false,
    open: true,
    hotOnly: true,
    // 配置反向代理
    proxy: {
      // 当地址中有/api的时候会触发代理机制
      '/api': {
        // 要代理的服务器地址  这里不用写 api
        target: 'http://localhost:4000',
        changeOrigin: true // 是否跨域
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  // chainWebpack 是 Vue CLI 提供的扩展 Webpack 配置的方法。
  chainWebpack(config) {
    // 设置 svg-sprite-loader
    // config 是 Webpack 配置对象，支持链式调用修改配置。
    // config.module 表示创建一个具名规则，以后用来修改规则
    config.module
      // 选中默认的 svg 规则
      .rule('svg')
      // 将 src/icons 排除
      // 为什么需要排除？
      //   默认规则可能是用 file-loader 或 url-loader 来处理 SVG 文件。
      //   而我们希望 src/icons 的 SVG 文件使用 svg-sprite-loader 来处理。
      .exclude.add(resolve('src/icons'))
      // 结束
      .end()

    // config.module 表示创建一个具名规则，以后用来修改规则
    config.module
      // 新增一个规则，命名为 icons
      .rule('icons')
      // 正则，匹配文件类型为 .svg 的文件。
      .test(/\.svg$/)
      // 设置解析的文件，仅应用于 src/icons 目录，避免影响其他目录的 .svg 文件。
      .include.add(resolve('src/icons'))
      // 结束
      .end()
      // 添加 svg-sprite-loader，用于将多个 SVG 文件打包成一个 SVG 精灵图（Sprite）。
      // 新增了一个解析的loader
      .use('svg-sprite-loader')
      // 具体的loader
      .loader('svg-sprite-loader')
      // loader 的配置
      .options({
        // 指定每个图标的 ID 格式：例如 home.svg 会生成 icon-home
        symbolId: 'icon-[name]'
      })
      // 结束
      .end()
  }
}
