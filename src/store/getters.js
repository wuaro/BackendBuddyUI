import { MAIN_COLOR } from '@/constant'
import { getItem } from '@/utils/storage'
import { generateColors } from '@/utils/theme'

/**
 * getters：
 * * token: 获取token
 * * userInfo: 获取用户状态
 * * hasUserInfo: 获取用户信息（用于判断是否登录）
 * * cssVar: 获取CSS变量（用于动态主题）
 * * sidebarOpened: 获取侧边栏的开/闭状态
 * * language: 获取当前使用的语言
 * * mainColor: 获取主色调
 * * tagsViewList: 获取标签视图列表
 * @type {{token: (function(*): *), userInfo: (function(*): {}), hasUserInfo: (function(*): boolean), cssVar: (function(*): *&{primary: *}), sidebarOpened: (function(*): boolean), language: (function(*): *), mainColor: (function(*): *), tagsViewList: (function(*): *)}}
 */
const getters = {
  /**
   * 获取 user 模块中的 token
   * @param state
   * @returns {*}
   */
  token: state => state.user.token,
  /**
   * 获取 user 模块中的 userInfo 状态
   * @param state
   * @returns {{}}
   */
  userInfo: state => state.user.userInfo,

  /**
   * 检查是否登录（是否存在用户信息）：<br>
   * 检查 userInfo 是否为空对象，返回 true 或 false。
   * * JSON.stringify(state.user.userInfo) 将 userInfo 对象转换为字符串形式。
   * * 如果 userInfo 为空对象（{}），则 JSON.stringify(state.user.userInfo) 返回 '{}',说明用户未登录
   * * 如果 userInfo 不等于 '{}'，则表示 userInfo 已经有数据，返回 true。
   * * 用于判断用户是否已经登录。
   * @param state
   * @returns {boolean}
   */
  hasUserInfo: state => {
    return JSON.stringify(state.user.userInfo) !== '{}'
  },
  /**
   * 获取CSS变量（用于动态主题）：<br>
   * 返回一个组合的 CSS 变量对象，用于动态主题样式。
   *
   *
   * @param state
   * @returns {*&{primary: *}}
   */
  cssVar: state => {
    return {
      ...state.theme.variables,
      ...generateColors(getItem(MAIN_COLOR))
    }
  },
  /**
   * 获取侧边栏的打开与关闭状态：
   * * 箭头函数
   * * 接收state，返回state.app.sidebarOpened
   * * 获取 Vuex store 中的 app 模块下的 sidebarOpened 状态，用来标识侧边栏的打开与关闭状态
   */
  sidebarOpened: state => state.app.sidebarOpened,
  /**
   * 获取当前使用的语言
   * @param state
   * @returns {*}
   */
  language: state => state.app.language,
  /**
   * 获取主色调
   * @param state
   * @returns {*}
   */
  mainColor: state => state.theme.mainColor,
  /**
   * 获取标签视图列表
   * @param state
   * @returns {*}
   */
  tagsViewList: state => state.app.tagsViewList
}
export default getters
