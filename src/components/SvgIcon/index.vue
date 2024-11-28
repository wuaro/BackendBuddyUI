<template>
  <!--
    外部图标：
      v-if="isExternal":
        当 isExternal 的计算结果为 true 时
        使用 <div> 显示图标，并通过 styleExternalIcon 动态绑定样式。
      :class="className":
        动态绑定额外的类名，使组件样式更加灵活。
        className在下面已经定义了
  -->
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    :class="className"
  />
  <!--
    内部图标：
      v-else:
        使用 <svg> 标签显示项目内部图标。
        <use> 元素通过 xlink:href 引用内部图标的路径。
      :xlink:href="iconName":
        SVG 中用于指定引用路径的属性。
        引用内部图标的具体路径，iconName 是一个计算属性，自动为图标路径添加 #icon- 前缀。
  -->
  <svg v-else class="svg-icon" :class="className" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
// isExternal:从工具库中引入，用于判断图标是否为外部图标。
import { isExternal as external } from '@/utils/validate'
// defineProps 和 computed:使用 Vue 3 的组合式 API 定义属性和计算逻辑。
import { defineProps, computed } from 'vue'
const props = defineProps({
  // icon 图标
  icon: {
    type: String, // 强制类型必须为String
    required: true // 设为 true，调用组件时必须传递该属性。组件依赖此属性渲染图标。
  },
  // 图标类名
  className: {
    type: String, // 强制类型必须为String
    default: '' // 非必填项，默认为空字符串。
  }
})

/**
 * 判断是否为外部图标：
 *  将icon对象传入从工具库中导入的isExternal函数（external函数）中，返回一个布尔值
 */
const isExternal = computed(() => external(props.icon))
/**
 * 外部图标样式
 */
const styleExternalIcon = computed(() => ({
  // 设置图标为背景遮罩，图标内容取决于 icon 的 URL。
  mask: `url(${props.icon}) no-repeat 50% 50%`,
  // 兼容 Webkit 内核的浏览器。
  '-webkit-mask': `url(${props.icon}) no-repeat 50% 50%`
}))
/**
 * 项目内图标:
 *  当 icon 为内部图标时，生成 SVG 图标的路径。
 *  添加 #icon- 前缀，使图标路径符合项目的 SVG 使用约定。
 */
const iconName = computed(() => `#icon-${props.icon}`)
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
