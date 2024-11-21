/**
 * 判断是否为外部资源：以http、https、mailto、tel 开头的，都认为是外部资源
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
