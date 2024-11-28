<!-- AppMain组件（主内容区） -->
<template>
  <!-- 主内容区 -->
  <div class="app-main">
    <!--
      路由视图：
        1. 用于根据当前路由动态加载对应的组件。
        2. 使用 v-slot 解构出 Component（当前路由对应的组件）和 route（当前路由对象）
    -->
    <router-view v-slot="{ Component, route }">
      <!--
        过渡动画组件：
          1. Vue 提供的过渡动画组件，添加名为 fade-transform 的动画。
          2. mode="out-in" 表示切换组件时，先执行“移出动画”再执行“移入动画”。
      -->
      <transition name="fade-transform" mode="out-in">
        <!--
          缓存组件：
            1. 用于根据当前路由动态加载对应的组件。
            2. 使用 v-slot 解构出 Component（当前路由对应的组件）和 route（当前路由对象）
        -->
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { watch } from 'vue' // Vue 的响应式 API，用于监听数据变化。
import { isTags } from '@/utils/tags' // 自定义工具函数，判断当前路由是否需要添加到标签页。
import { generateTitle, watchSwitchLang } from '@/utils/i18n' //  用于处理国际化标题和监听语言切换的工具函数。
import { useRoute } from 'vue-router' // Vue Router 和 Vuex 的组合式 API。
import { useStore } from 'vuex'

const route = useRoute() // 获取当前路由对象

/**
 * 生成标题
 * 1. 负责为路由生成对应的标题。
 * 2. 如果路由没有 meta 信息，使用路径的最后一段；如果有 meta 信息，调用 generateTitle。
 */
const getTitle = (route) => {
  let title = ''
  if (!route.meta) {
    // 如果路由没有 meta 信息，使用路由路径的最后一段作为标题
    const pathArr = route.path.split('/')
    title = pathArr[pathArr.length - 1]
  } else {
    // 如果有 meta 信息，使用 meta.title 中定义的标题
    title = generateTitle(route.meta.title)
  }
  return title
}

/**
 * 监听路由变化
 * 1. 使用 watch 监听路由对象 route 的变化。
 * 2. 当路由切换时，将当前路由信息存储到 Vuex 的 app/addTagsViewList 中。
 * 3. immediate: true 确保初次加载时也执行回调。
 */
const store = useStore() // 获取 Vuex 存储对象
watch(
  route, // 监听当前路由对象的变化
  (to, from) => {
    if (!isTags(to.path)) return // 判断是否需要记录标签，不需要则直接返回
    const { fullPath, meta, name, params, path, query } = to // 解构路由对象的字段
    store.commit('app/addTagsViewList', {
      fullPath,
      meta,
      name,
      params,
      path,
      query,
      title: getTitle(to) // 调用 getTitle 生成标题
    })
  },
  {
    immediate: true // 在初始化时立即执行回调
  }
)

/**
 * 国际化 tags
 * 1. 通过 watchSwitchLang 监听语言切换。
 * 2. 更新 Vuex 中的标签标题为当前语言对应的翻译。
 */
watchSwitchLang(() => {
  // 当语言切换时，更新标签的标题
  store.getters.tagsViewList.forEach((route, index) => {
    store.commit('app/changeTagsView', {
      index, // 标签索引
      tag: {
        ...route, // 保留原有信息
        title: getTitle(route) // 更新标题
      }
    })
  })
})
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(
    100vh - 50px - 43px
  ); // 设置最小高度，减去顶部导航栏和底部标签栏的高度
  width: 100%; // 占满容器宽度
  position: relative; // 相对定位
  overflow: hidden; // 隐藏溢出的内容
  padding: 104px 20px 20px 20px; // 内边距：顶部 104px，其余方向 20px
  box-sizing: border-box; // 包括内边距在内的宽高计算
}
</style>
