import store from '@/store'
import { projectRoles } from '@/config/project/role'
// 判断是否有权限登陆
/**
 * @param {Array} value
 * @returns {Boolean}
 */
export function checkLogin(value) {
  console.log(value)
  if (value && value instanceof Array && value.length > 0) {
    if (
      projectRoles &&
      projectRoles instanceof Array &&
      projectRoles.length > 0
    ) {
      const roles = projectRoles
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })
      return hasPermission
    } else {
      console.error(
        '开发者错误：文件src/config/project/role中未配置projectRoles'
      )
    }
  } else {
    return false
  }
}
// 判断是否有权限
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`角色丢失`)
    return false
  }
}
