/**
 * 所有关于user的操作
 */
import { login, getUserInfo } from '@/api/sys'
// import md5 from 'md5'
import { setItem, getItem, removeAllItem } from '@/utils/storage'
import { TOKEN } from '@/constant'
import router, { resetRouter } from '@/router'
import { setTimeStamp } from '@/utils/auth'

export default {
  // 模块化使用 namespaced: true，避免与其他模块命名冲突。
  namespaced: true,
  // 模块的状态：包含token、userInfo
  state: () => ({
    token: getItem(TOKEN) || '', // 从本地存储中获取 token
    userInfo: {} // 用户信息
  }),
  // 定义同步修改状态的方法。
  mutations: {
    setToken(state, token) {
      state.token = token // 更新 Vuex 状态中的 token。
      setItem(TOKEN, token) // 同步保存到本地存储
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  // 定义异步逻辑，包括登录、获取用户信息、退出等操作。
  actions: {
    login(context, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        // 调用 login API，传递加密后的用户名和密码。
        login({
          username,
          // password: md5(password) // 使用 md5 对密码加密，提升安全性。
          password
        })
          .then((data) => {
            this.commit('user/setToken', data.token)
            // 保存登录时间
            setTimeStamp()
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async getUserInfo(context) {
      const res = await getUserInfo() // 调用 API 获取用户信息
      this.commit('user/setUserInfo', res) // 更新 Vuex 状态
      return res
    },
    logout() {
      resetRouter() // 重置动态路由
      this.commit('user/setToken', '') // 清空 token
      this.commit('user/setUserInfo', {}) // 清空用户信息
      removeAllItem() // 清空本地存储
      router.push('/login') // 跳转到登录页
    }
  }
}
