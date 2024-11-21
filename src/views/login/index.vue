<template>
  <!-- 包裹整个登录页面的容器，提供背景样式和布局。 -->
  <div class="login-container">
    <!-- 登录的表单 -->
    <el-form
      class="login-form"
      ref="loginFromRef"
      :model="loginForm"
      :rules="loginRules"
    >
      <!-- 登录的标题 -->
      <div class="title-container">
        <h3 class="title">{{ $t('msg.login.title') }}</h3>
        <lang-select class="lang-select" effect="light"></lang-select>
      </div>

      <!-- 登录 —— 用户名表单项 ：绑定字段 username，内含用户图标和输入框-->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon="user" />
        </span>
        <el-input
          placeholder="username"
          name="username"
          type="text"
          v-model="loginForm.username"
        />
      </el-form-item>

      <!-- 登录 —— 密码表单项 ：绑定字段 password，带有密码输入框和切换密码显示的按钮。-->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon="password" />
        </span>
        <el-input
          placeholder="password"
          name="password"
          :type="passwordType"
          v-model="loginForm.password"
        />
        <span class="show-pwd">
          <svg-icon
            :icon="passwordType === 'password' ? 'eye' : 'eye-open'"
            @click="onChangePwdType"
          />
        </span>
      </el-form-item>

      <!-- 登录按钮：设置了加载动画状态 loading，点击触发登录逻辑。 -->
      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        :loading="loading"
        @click="handleLogin"
        >{{ $t('msg.login.loginBtn') }}</el-button
      >

      <div class="tips" v-html="$t('msg.login.desc')"></div>
    </el-form>
  </div>
</template>

<script setup>
import LangSelect from '@/components/LangSelect/index.vue'
import { ref } from 'vue'
import { validatePassword } from './rules'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// 数据源
const loginForm = ref({
  username: 'super-admin',
  password: '123456'
})
// 验证规则
const i18n = useI18n()
const loginRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.login.usernameRule')
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword()
    }
  ]
})

// 处理密码框文本显示状态
const passwordType = ref('password')
const onChangePwdType = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
}

// 登录动作处理
const loading = ref(false)
const loginFromRef = ref(null)
const store = useStore()
const router = useRouter()
const handleLogin = () => {
  loginFromRef.value.validate((valid) => {
    if (!valid) return

    loading.value = true
    store
      .dispatch('user/login', loginForm.value)
      .then(() => {
        loading.value = false
        // 登录后操作
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
        loading.value = false
      })
  })
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b; // 背景颜色
$dark_gray: #889aa4; // 深灰色，通常用于图标或文字
$light_gray: #eee; // 浅灰色，常用于文字或背景
$cursor: #fff; // 光标颜色

.login-container {
  min-height: 100%; // 内容最小高度占满整个视口
  width: 100%; // 宽度占满屏幕
  background-color: $bg; // 背景色（深蓝）
  overflow: hidden; // 隐藏溢出内容

  .login-form {
    position: relative; // 相对定位，便于内部内容的绝对定位
    width: 520px; // 表单宽度
    max-width: 100%; // 保证表单在小屏幕上不会超出屏幕
    padding: 160px 35px 0; // 内边距：上方空出160px用于居中，左右间距35px
    margin: 0 auto; // 水平居中
    overflow: hidden; // 隐藏超出部分

    ::v-deep .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1); // 边框透明白色
      background: rgba(0, 0, 0, 0.1); // 背景半透明黑色
      border-radius: 5px; // 圆角
      color: #454545; // 字体颜色
    }

    ::v-deep .el-input {
      display: inline-block; // 保证布局正常
      height: 47px; // 高度
      width: 85%; // 宽度为 85%，留出部分空间用于图标或按钮

      input {
        background: transparent; // 输入框背景透明
        border: 0px; // 无边框
        -webkit-appearance: none; // 移除默认样式（主要针对 iOS）
        border-radius: 0px; // 无圆角
        padding: 12px 5px 12px 15px; // 内边距
        color: $light_gray; // 字体颜色
        height: 47px; // 高度
        caret-color: $cursor; // 光标颜色
      }
    }
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px; // 图标与输入框的间距
    color: $dark_gray; // 图标颜色
    vertical-align: middle; // 垂直居中
    display: inline-block; // 与输入框同行显示
  }

  .title-container {
    position: relative; // 相对定位

    .title {
      font-size: 26px; // 标题文字大小
      color: $light_gray; // 浅灰色字体
      margin: 0px auto 40px auto; // 垂直居中，上下间距 40px
      text-align: center; // 居中对齐
      font-weight: bold; // 加粗
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute; // 绝对定位
    right: 10px; // 距右侧 10px
    top: 7px; // 距顶部 7px
    font-size: 16px; // 按钮字体大小
    color: $dark_gray; // 深灰色
    cursor: pointer; // 鼠标悬停时变为手型
    user-select: none; // 禁止用户选中文字
  }
}
</style>
