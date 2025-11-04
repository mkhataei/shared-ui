import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

const ActiveToggleButton = ({
  isActive,
  onChange,
  method = 'PATCH',
  url,
  getRequestDataObject,
  activeLabel = 'فعال',
  disableLabel = 'غیر فعال',
}) => {
  const [visibilityWaiting, setVisibilityWaiting] = useState(false)

  const sendToggleVisibilityRequest = (visibility) => {
    setVisibilityWaiting(true)
    axios({
      method,
      url,
      data: getRequestDataObject(visibility),
    })
      .then((resp) => {
        setVisibilityWaiting(false)
        onChange(resp.data)
      })
      .catch((error) => {
        setVisibilityWaiting(false)
      })
  }

  if (visibilityWaiting) {
    return <CircularProgress size={24} />
  }

  return isActive ? (
    <Button
      variant='text'
      startIcon={<VisibilityIcon style={{ color: 'green' }} />}
      onClick={() => sendToggleVisibilityRequest(false)}
    >
      {activeLabel}
    </Button>
  ) : (
    <Button
      variant='text'
      startIcon={<VisibilityOffIcon style={{ color: 'red' }} />}
      onClick={() => sendToggleVisibilityRequest(true)}
    >
      {disableLabel}
    </Button>
  )
}

export default ActiveToggleButton
