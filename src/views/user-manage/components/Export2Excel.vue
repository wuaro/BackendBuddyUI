<template>
  <el-dialog
    :title="$t('msg.excel.title')"
    :model-value="modelValue"
    @close="closed"
    width="30%"
  >
    <el-input
      v-model="excelName"
      :placeholder="$t('msg.excel.placeholder')"
    ></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closed">{{ $t('msg.excel.close') }}</el-button>
        <el-button type="primary" @click="onConfirm" :loading="loading">{{
          $t('msg.excel.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { getUserManageAllList } from '@/api/user-manage'
import { defineProps, defineEmits, ref } from 'vue'
import { watchSwitchLang } from '@/utils/i18n'
import { useI18n } from 'vue-i18n'
import { USER_RELATIONS } from './Export2ExcelConstants'
import { dateFormat } from '@/utils/date'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

const i18n = useI18n()
let exportDefaultName = i18n.t('msg.excel.defaultName')
const excelName = ref('')
excelName.value = exportDefaultName
watchSwitchLang(() => {
  exportDefaultName = i18n.t('msg.excel.defaultName')
  excelName.value = exportDefaultName
})

const loading = ref(false)
/**
 * 导出按钮点击事件
 * @returns {Promise<void>}
 */
const onConfirm = async () => {
  loading.value = true
  // 通过 API 获取所有用户的数据。
  const allUser = (await getUserManageAllList()).list
  // 动态导入 Export2Excel 工具，用于将数据导出为 Excel 文件。
  const excel = await import('@/utils/Export2Excel')
  // 调用 formatJson 函数，将用户数据格式化为 Excel 导出所需的二维数组。
  const data = formatJson(USER_RELATIONS, allUser)
  // 调用导入的 export_json_to_excel 函数，执行 Excel 导出。
  excel.export_json_to_excel({
    // excel 表头
    header: Object.keys(USER_RELATIONS),
    // excel 数据（二维数组结构）
    data,
    // 文件名称(用户在input元素中输入)
    filename: excelName.value || exportDefaultName,
    // 是否自动列宽
    autoWidth: true,
    // 文件类型
    bookType: 'xlsx'
  })
  closed()
}

/**
 * 将用户数据转化为 Excel 所需的二维数组格式
 * @param headers
 * @param rows
 * @returns {*}
 */
const formatJson = (headers, rows) => {
  // 首先遍历数组
  // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
  return rows.map(item => {
    return Object.keys(headers).map(key => {
      // 时间特殊处理
      if (headers[key] === 'openTime') {
        return dateFormat(item[headers[key]])
      }
      // 角色特殊处理
      if (headers[key] === 'role') {
        const roles = item[headers[key]]

        return JSON.stringify(roles.map(role => role.title))
      }
      return item[headers[key]]
    })
  })
}

/**
 * 关闭对话框
 */
const closed = () => {
  loading.value = false
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
