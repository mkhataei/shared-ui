import { IconButton } from '@mui/material'
import FuseSvgIcon from '@shared/fuse/core/FuseSvgIcon/FuseSvgIcon'
import { showMessage } from 'app/store/fuse/messageSlice'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

function CopyableText({ text, copyText, onCopy, iconSize = 16, showIcon = true, className = '' }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const dispatch = useDispatch()

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText || text)
    setIsAnimating(true)
    if (onCopy) {
      onCopy()
    } else {
      dispatch(showMessage({ message: 'متن مورد نظر کپی شد.', variant: 'success' }) )
    }
    setTimeout(() => setIsAnimating(false), 2000)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className='cursor-pointer hover:text-blue-600'
        onClick={handleCopy}
      >
        {text}
      </span>
      {showIcon && (
        <IconButton size='small' onClick={handleCopy}>
          <FuseSvgIcon size={iconSize} color='action'>
            {isAnimating ? 'heroicons-solid:clipboard-check' : 'heroicons-outline:clipboard'}
          </FuseSvgIcon>
        </IconButton>
      )}
    </div>
  )
}

export default CopyableText
