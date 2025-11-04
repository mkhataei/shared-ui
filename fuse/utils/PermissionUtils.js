import FuseUtils from './FuseUtils'

class PermissionUtils {
  static can(permission, user) {
    return this.canList([permission], user)
  }

  static canList(permissions, user) {
    if (!user) return false

    if (!permissions || permissions.length === 0) return true

    return FuseUtils.hasPermission(permissions, user)
  }
}

export default PermissionUtils
