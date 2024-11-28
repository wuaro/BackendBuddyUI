import axios from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { isCheckTimeout } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 动态获取环境变量的值，根据不同的环境（开发、生产），取不同的baseUrl
  timeout: 5000
})

/**
 * 请求拦截器：<br>
 * 发起请求时，会首先经过 请求拦截器，在 request 发起之前，做一些预处理
 * 1. token 没过期则将 token 添加到请求头，如果过期了 则直接登出
 * 2.
 */
service.interceptors.request.use(
  (config) => {
    // 如果 token 没过期，将其注入请求头中
    if (store.getters.token) {
      // 如果 token 超时，则直接登出，并且提醒 'token 失效'
      if (isCheckTimeout()) {
        store.dispatch('user/logout')
        return Promise.reject(new Error('token 失效'))
      }
      // 将 token 以 Authorization: Bearer <token> 的格式添加到请求头中
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    // Accept-Language 是 HTTP 请求头的一种标准字段，用于告知服务器客户端希望接收到的语言种类。
    // 例如，Accept-Language: zh 表示希望接收中文响应，Accept-Language: en 则是英文
    config.headers['Accept-Language'] = store.getters.language
    // 在 axios 的请求拦截器中，你需要 返回修改后的配置对象。
    //   这是因为 axios 使用该配置对象来执行请求。如果不返回，请求就会被中止。
    // 通过 return config，拦截器完成了对请求的处理，并将修改后的 config 返回给 axios，然后 axios 会继续发出请求。
    return config
  },
  (error) => {
    // 如果请求配置出现问题（比如请求参数错误），则会进入这个 error 处理函数。
    // Promise.reject(error) 表示返回一个失败的 Promise，传递给下游的 .catch() 或 try/catch 块进行处理。
    //   这样可以确保在出现错误时能够捕获并处理错误。
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器：
 * 1. success: true，说明请求成功，返回数据，供后续的 .then() 或 await 使用     <br>
 *    success: false，会弹出一个错误消息，使用 ElMessage.error(message) 来提示用户错误信息
 * 2. 如果响应失败（如网络错误或后台返回的状态码为 4xx 或 5xx），会进入 error 分支，并弹出错误提示。     <br>
 *    如果错误是由 token 失效导致的，系统会执行登出操作。
 */
service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      // 业务错误
      ElMessage.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 处理 token 超时问题
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 401
    ) {
      // token超时
      store.dispatch('user/logout')
    }
    ElMessage.error(error.message) // 提示错误信息
    return Promise.reject(error)
  }
)

export default service
