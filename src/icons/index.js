//  1. 导入所有的 `svg` 图标
//  2. 完成 `SvgIcon` 的全局注册

import SvgIcon from '@/components/SvgIcon'

// 查看require.context()的用法：https://webpack.docschina.org/guides/dependency-management/#requirecontext
// 三个参数：要搜索的目录（'./svg'），是否有子目录（false），匹配的正则表达式（/\.svg$/）
const svgRequire = require.context('./svg', false, /\.svg$/)
// 此时返回一个 require 的函数，可以接受一个 request 的参数，用于 require 的导入。
// 该函数提供了三个属性，可以通过 require.keys() 获取到所有的 svg 图标
// 遍历图标（forEach），把图标每次得到的图标（svgIcon）作为 request 参数传入到 require 导入函数中，完成本地 svg 图标的导入
svgRequire.keys().forEach((svgIcon) => svgRequire(svgIcon))

export default (app) => {
  app.component('svg-icon', SvgIcon) // 完成 `SvgIcon` 的全局注册，注册之后，在其他组件中使用svg-icon组件无需import
}
