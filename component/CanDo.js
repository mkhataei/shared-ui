import FuseUtils from '@shared/fuse/utils/FuseUtils'
import { selectUser } from 'app/store/userSlice'
import { useSelector } from 'react-redux'

const CanDo = ({ permissions, children }) => {
  const user = useSelector(selectUser)

  const canDoRequestedPermissions = permissions ? FuseUtils.hasPermission(permissions, user) : true

  return canDoRequestedPermissions ? <>{children}</> : null
}

export default CanDo
