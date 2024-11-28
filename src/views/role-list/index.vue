<template>
  <div class="">
    <el-card>
      <el-table :data="allRoles" border style="width: 100%">
        <!-- 第一列：索引 -->
        <el-table-column :label="$t('msg.role.index')" type="index" width="120">
        </el-table-column>
        <!-- 第二列：角色名称 -->
        <!-- prop="title"表示数据对象中对应的字段 -->
        <el-table-column :label="$t('msg.role.name')" prop="title">
        </el-table-column>
        <!-- 第三列：角色描述 -->
        <el-table-column :label="$t('msg.role.desc')" prop="describe">
        </el-table-column>
        <!-- 第四列：操作按钮 -->
        <!-- 每一行数据会传递给 el-table-column 中的 #default 插槽 -->
        <!-- row 存储的是每一行的数据 -->
        <el-table-column
          :label="$t('msg.role.action')"
          prop="action"
          width="260"
          #default="{ row }"
        >
          <el-button
            type="primary"
            size="mini"
            @click="onDistributePermissionClick(row)"
            v-permission="['distributePermission']"
          >
            {{ $t('msg.role.assignPermissions') }}
          </el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的弹窗 -->
    <distribute-permission
      v-model="distributePermissionVisible"
      :roleId="selectRoleId"
    ></distribute-permission>
  </div>
</template>

<script setup>
import { roleList } from '@/api/role'
import { watchSwitchLang } from '@/utils/i18n'
import { ref } from 'vue'
import DistributePermission from './components/DistributePermission.vue'

const allRoles = ref([])
/**
 * 从后端获取 RoleList 数据
 * @returns {Promise<void>}
 */
const getRoleList = async () => {
  allRoles.value = await roleList()
}
getRoleList()
watchSwitchLang(getRoleList)

/**
 * 分配权限弹窗的显隐
 */
const distributePermissionVisible = ref(false)
const selectRoleId = ref('')
const onDistributePermissionClick = row => {
  selectRoleId.value = row.id
  distributePermissionVisible.value = true
}
</script>
