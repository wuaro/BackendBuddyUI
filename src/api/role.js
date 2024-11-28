import request from '@/utils/request'

/**
 * 获取所有角色：
 * '/role/list'
 */
export const roleList = () => {
  return request({
    url: '/role/list'
  })
}

/**
 * 获取指定角色的权限：`/role/permission/${roleId}`
 */
export const rolePermission = roleId => {
  return request({
    url: `/role/permission/${roleId}`
  })
}

/**
 * 为角色修改权限：'/role/distribute-permission',
 */
export const distributePermission = data => {
  return request({
    url: '/role/distribute-permission',
    method: 'POST',
    data
  })
}
