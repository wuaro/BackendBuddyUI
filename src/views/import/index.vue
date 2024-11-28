<template>
  <upload-excel :onSuccess="onSuccess"></upload-excel>
</template>

<script setup>
import UploadExcel from '@/components/UploadExcel'
import { userBatchImport } from '@/api/user-manage'
import { USER_RELATIONS, formatDate } from './utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const i18n = useI18n()
const router = useRouter()
/**
 * 数据解析成功之后的回调
 */
const onSuccess = async ({ header, results }) => {
  // 筛选数据
  const updateData = generateData(results)
  // 给后台发请求，更新数据
  await userBatchImport(updateData)
  // 操作成功时弹出的消息。
  ElMessage.success({
    message: results.length + i18n.t('msg.excel.importSuccess'),
    type: 'success'
  })
  // 在导入成功后，用户会被重定向到 /user/manage 页面
  router.push('/user/manage')
}

/**
 * 筛选数据
 */
const generateData = results => {
  const arr = []
  results.forEach(item => {
    const userInfo = {}
    Object.keys(item).forEach(key => {
      if (USER_RELATIONS[key] === 'openTime') {
        userInfo[USER_RELATIONS[key]] = formatDate(item[key])
        return
      }
      userInfo[USER_RELATIONS[key]] = item[key]
    })
    arr.push(userInfo)
  })
  return arr
}
</script>

<style lang="scss" scoped></style>
