import FuseUtils from '@shared/fuse/utils/FuseUtils'
import { selectUser } from 'app/store/userSlice'
import { useSelector } from 'react-redux'

const CanDoByDivision = ({ permissions, children, divisionId }) => {
  const user = useSelector(selectUser)

  let canDoRequestedPermissions = permissions ? FuseUtils.hasPermission(permissions, user) : true
  if (!FuseUtils.isSuperAdmin(user) && !(user.divisions_id || []).includes(divisionId)) {
    canDoRequestedPermissions = false
  }

  return canDoRequestedPermissions ? <>{children}</> : null
}

export default CanDoByDivision
