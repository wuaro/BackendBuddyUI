<template>
  <!-- sidebarOpened 是 Vuex 的一个状态值，用于判断侧边栏是否展开： -->
  <div
    class="app-wrapper"
    :class="[$store.getters.sidebarOpened ? 'openSidebar' : 'hideSidebar']"
  >
    <!-- Sidebar组件（侧边栏） -->
    <!-- 动态设置侧边栏的背景颜色。
     menuBg 是 Vuex 中的全局变量，可能来自用户主题设置。 -->
    <sidebar
      id="guide-sidebar"
      class="sidebar-container"
      :style="{ backgroundColor: $store.getters.cssVar.menuBg }"
    />
    <div class="main-container">
      <div class="fixed-header">
        <!-- 顶部的Navbar组件（导航栏） -->
        <navbar />
        <!-- TagsView组件（标签视图） -->
        <tags-view id="guide-tags"></tags-view>
      </div>
      <!-- AppMain组件（主内容区） -->
      <app-main />
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AppMain from './components/AppMain'
import TagsView from '@/components/TagsView'
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix; // 清除浮动，确保子元素不会溢出父容器
  position: relative; // 设置容器为相对定位，以支持子元素的绝对定位
  height: 100%; // 设置容器高度为100%，撑满整个页面
  width: 100%; // 设置容器宽度为100%，覆盖整个页面
}

.fixed-header {
  position: fixed; // 将头部固定在页面顶部，保持不随滚动条滚动（保持<navbar />组件始终位于最上方）
  top: 0; // 距页面顶部的距离为0
  right: 0; // 距页面右侧的距离为0
  z-index: 9; // 设置 z-index 为 9，确保头部内容在其他元素之上
  width: calc(
    100% - #{$sideBarWidth}
  ); // 动态计算头部宽度，减去侧边栏展开时的宽度
  transition: width #{$sideBarDuration}; // 添加宽度变化的过渡动画，动画持续时间由 $sideBarDuration 决定
}

.hideSidebar .fixed-header {
  width: calc(
    100% - #{$hideSideBarWidth}
  ); // 当侧边栏隐藏时，调整头部宽度，适配隐藏侧边栏后的布局
}
</style>
