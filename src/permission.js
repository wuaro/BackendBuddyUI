// 功能总结：
//  权限校验：
//    判断用户是否登录（token）。
//    如果未登录，只允许访问白名单中的路由（如 /login）。
//  动态路由添加：
//    已登录用户，根据权限动态加载路由，确保每个用户只能访问其权限范围内的功能。
//  路由跳转优化：
//    防止已登录用户访问登录页面（直接跳转到主页）。
//    添加动态路由后主动重新跳转，以确保新路由立即生效。
import router from './router'
import store from './store'

// 白名单
const whiteList = ['/login']
/**
 * 路由前置守卫
 */
router.beforeEach(async (to, from, next) => {
  // 如果存在 token ，进入主页
  if (store.getters.token) {
    // 如果用户已经登录，则再访问login页面是会被强制跳转到'/'（主页）
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断用户资料是否获取
      // 若不存在用户信息，则需要获取用户信息
      if (!store.getters.hasUserInfo) {
        // 触发获取用户信息的 action，并获取用户当前权限
        const { permission } = await store.dispatch('user/getUserInfo')
        console.log('该用户的信息：')
        console.log(await store.dispatch('user/getUserInfo'))
        console.log('该用户的权限：')
        console.log(permission)
        // 处理用户权限，筛选出需要添加的权限
        const filterRoutes = await store.dispatch(
          'permission/filterRoutes',
          permission.menus
        )
        // 利用 addRoute 循环添加
        filterRoutes.forEach((item) => {
          router.addRoute(item)
        })
        // 添加完动态路由之后，需要在进行一次主动跳转
        return next(to.path)
      }
      next()
    }
  } else {
    // 没有token的情况下，可以进入白名单（'/login'）
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
