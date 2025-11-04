import { LoadingButton } from '@mui/lab'
import { IconButton, Tooltip } from '@mui/material'
import FuseSvgIcon from '@shared/fuse/core/FuseSvgIcon'

function TableActionButton({
  onClick,
  fuseIconText,
  title,
  withoutTitle = false,
  className,
  ...others
}) {
  if (withoutTitle) {
    return (
      <Tooltip title={title || ''}>
        <IconButton aria-label={title} sx={{ color: 'gray' }} onClick={onClick}>
          <FuseSvgIcon color='action'>{fuseIconText}</FuseSvgIcon>
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={title || ''}>
      <LoadingButton
        aria-label={title}
        sx={{
          color: 'gray',
          // whiteSpace: 'nowrap',
          // overflow: 'hidden',
        }}
        className={className || ''}
        onClick={onClick}
        startIcon={<FuseSvgIcon color='action'>{fuseIconText}</FuseSvgIcon>}
        {...others}
      >
        {title}
      </LoadingButton>
    </Tooltip>
  )
}

export default TableActionButton
