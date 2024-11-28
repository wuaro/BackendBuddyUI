<template>
  <!-- Element Plus UI 库中的对话框组件，提供一个弹出框 -->
  <!-- @close="closed"：关于弹窗时调用 closed() 函数 -->
  <el-dialog
    :title="$t('msg.excel.roleDialogTitle')"
    :model-value="modelValue"
    @close="closed"
  >
    <!-- :data="allPermission"：树的数据内容存储在 allPermission 中（权限列表） -->
    <!-- show-checkbox：显示复选框，用来选择权限。 -->
    <!-- check-strictly：表示复选框的选中状态与父子节点无关，子节点的选中状态不会影响父节点。 -->
    <!-- node-key="id"：每个树节点的唯一标识，用 id 来作为每个权限的唯一键。 -->
    <!-- default-expand-all：默认展开所有树节点。 -->
    <!-- :props="defaultProps"：指定树的属性结构，defaultProps 用于定义每个节点的显示标签（权限名称）和子节点。 -->
    <el-tree
      ref="treeRef"
      :data="allPermission"
      show-checkbox
      check-strictly
      node-key="id"
      default-expand-all
      :props="defaultProps"
    >
    </el-tree>
    <!-- #footer：插槽，定义了对话框底部的内容。-->
    <!-- <el-button @click="closed">：取消按钮，点击时触发 closed 方法，关闭对话框。-->
    <!-- <el-button type="primary" @click="onConfirm">：确认按钮，点击时触发 onConfirm 方法，用于提交选中的权限。-->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closed">{{ $t('msg.universal.cancel') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{
          $t('msg.universal.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { permissionList } from '@/api/permission'
import { watchSwitchLang } from '@/utils/i18n'
import { rolePermission, distributePermission } from '@/api/role'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  roleId: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

// 所有权限
const allPermission = ref([])

const getPermissionList = async () => {
  allPermission.value = await permissionList()
}
getPermissionList()
watchSwitchLang(getPermissionList)

// 属性结构配置
const defaultProps = {
  children: 'children',
  label: 'permissionName'
}

// tree 节点
const treeRef = ref(null)

// 获取当前用户角色的权限
const getRolePermission = async () => {
  const checkedKeys = await rolePermission(props.roleId)
  treeRef.value.setCheckedKeys(checkedKeys)
}

/**
 * 用来监听 props.roleId 的变化。<br>
 * 每当 roleId 发生变化时，调用 getRolePermission 来更新该角色的权限。
 */
watch(
  () => props.roleId,
  val => {
    if (val) getRolePermission()
  }
)

const i18n = useI18n()

/**
 * 确定按钮点击事件: <br>
 * 它通过 distributePermission API 将选中的权限分配给角色。
 * * treeRef.value.getCheckedKeys() 获取 el-tree 组件中选中的权限。
 * * 操作成功后，使用 ElMessage.success 显示成功提示。
 * * 调用 closed() 关闭对话框。
 */
const onConfirm = async () => {
  await distributePermission({
    roleId: props.roleId,
    permissions: treeRef.value.getCheckedKeys()
  })
  ElMessage.success(i18n.t('msg.role.updateRoleSuccess'))
  closed()
}

/**
 * 关闭对话框: <br>
 * 触发 update:modelValue 事件，并将 false 传递给父组件，表示对话框应该关闭
 */
const closed = () => {
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
