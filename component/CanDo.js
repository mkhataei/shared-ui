import FuseUtils from '@shared/fuse/utils/FuseUtils'
import { selectUser } from 'app/store/userSlice'
import { useSelector } from 'react-redux'

const CanDo = ({ permissions, children }) => {
  const user = useSelector(selectUser)

  const canDoRequestedPermissions = permissions ? FuseUtils.hasPermission(permissions, user) : true

  // Debug logging
  if (permissions && !canDoRequestedPermissions) {
    const userPermissions = FuseUtils.getPermissionsFromUser(user)
    console.log('🔒 CanDo - Access Denied:', {
      requested: permissions,
      userHas: userPermissions,
      userRoles: user?.roles?.map((r) => r.name),
      userGroups: user?.groups?.map((g) => g.name),
    })
  }

  return canDoRequestedPermissions ? <>{children}</> : null
}

export default CanDo
