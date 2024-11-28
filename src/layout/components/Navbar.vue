<!-- 顶部的Navbar组件（导航栏） -->
<template>
  <div class="navbar">
    <!-- 左侧的汉堡菜单：用于切换侧边栏 显示/隐藏 状态 -->
    <hamburger class="hamburger-container" />

    <!-- 面包屑导航：实现当前页面的路径导航（如首页 > 设置 > 用户） -->
    <breadcrumb id="guide-breadcrumb" class="breadcrumb-container" />

    <!-- 右侧菜单 -->
    <div class="right-menu">
      <!-- 新手引导按钮：触发新手引导功能-->
      <guide class="right-menu-item hover-effect" />

      <!-- 头部搜索框：头部搜索框组件，用于全局搜索。 -->
      <header-search class="right-menu-item hover-effect"></header-search>

      <!-- 全屏切换按钮：全屏切换功能 -->
      <screenfull class="right-menu-item hover-effect" />

      <!-- 主题选择器： 主题选择器，用于切换系统主题 -->
      <theme-picker class="right-menu-item hover-effect"></theme-picker>

      <!-- 语言切换：语言切换功能 -->
      <lang-select class="right-menu-item hover-effect" />

      <!--
        用户头像和下拉菜单：
          1. 显示用户头像和设置图标。
          2. 提供“返回首页” “课程页面”“注销”等操作。
      -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 用户头像 -->
          <el-avatar
            shape="square"
            :size="40"
            :src="$store.getters.userInfo.avatar"
          ></el-avatar>
          <!-- 设置图标 -->
          <i class="el-icon-s-tools"></i>
        </div>
        <!-- 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <!-- 返回首页链接 -->
            <router-link to="/">
              <el-dropdown-item> {{ $t('msg.navBar.home') }} </el-dropdown-item>
            </router-link>
            <!-- 前往课程页面的外部链接 -->
            <a target="_blank" href="">
              <el-dropdown-item>{{ $t('msg.navBar.course') }}</el-dropdown-item>
            </a>
            <!-- 注销按钮 -->
            <el-dropdown-item divided @click="logout">
              {{ $t('msg.navBar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import Hamburger from '@/components/Hamburger' // 汉堡菜单组件
import Breadcrumb from '@/components/Breadcrumb' // 面包屑导航组件
import LangSelect from '@/components/LangSelect' // 语言切换组件
import ThemePicker from '@/components/ThemePicker' // 主题选择器组件
import Screenfull from '@/components/Screenfull' // 全屏切换组件
import HeaderSearch from '@/components/HeaderSearch' // 搜索框组件
import Guide from '@/components/Guide' // 新手引导组件
import { useStore } from 'vuex' // Vuex状态管理工具

const store = useStore() //  获取 Vuex 状态管理实例
const logout = () => {
  // 调用 Vuex 中的 user/logout 动作，用于注销用户登录。
  store.dispatch('user/logout')
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px; // 设置导航栏的固定高度
  overflow: hidden; // 隐藏溢出的内容
  position: relative; // 设置相对定位
  background: #fff; // 背景色为白色
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); // 添加阴影

  .hamburger-container {
    line-height: 46px; // 垂直对齐
    height: 100%; // 撑满父容器
    float: left; // 靠左浮动
    cursor: pointer; // 鼠标悬浮时变为指针
    transition: background 0.5s; // 背景色的平滑过渡

    &:hover {
      background: rgba(0, 0, 0, 0.1); // 鼠标悬停时背景色变化
    }
  }

  .breadcrumb-container {
    float: left; // 面包屑导航靠左浮动
  }

  .right-menu {
    display: flex; // 使用 Flex 布局
    align-items: center; // 垂直居中对齐
    float: right; // 靠右浮动
    padding-right: 16px; // 右侧内边距

    ::v-deep .right-menu-item {
      display: inline-block; // 行内块级元素
      padding: 0 18px 0 0; // 设置左右内边距
      font-size: 24px; // 字体大小
      color: #5a5e66; // 字体颜色
      vertical-align: text-bottom; // 垂直对齐

      &.hover-effect {
        cursor: pointer; // 鼠标悬浮时变为指针
        transition: background 0.3s; // 背景色的平滑过渡

        &:hover {
          background: rgba(0, 0, 0, 0.025); // 鼠标悬停时背景色变化
        }
      }
    }

    ::v-deep .avatar-container {
      cursor: pointer; // 鼠标悬浮时变为指针

      .avatar-wrapper {
        margin-top: 5px; // 顶部外边距
        position: relative; // 相对定位

        .el-avatar {
          --el-avatar-background-color: none; // 移除默认背景色
          margin-right: 12px; // 右侧外边距
        }
      }
    }
  }
}
</style>
