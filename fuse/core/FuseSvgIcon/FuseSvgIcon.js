import Icon from '@mui/material/Icon'
import {styled} from '@mui/material/styles'
import {Box} from '@mui/system'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {forwardRef} from 'react'

const Root = styled(Box)(({ theme, ...props }) => ({
  width: props.size,
  height: props.size,
  minWidth: props.size,
  minHeight: props.size,
  fontSize: props.size,
  lineHeight: props.size,
  color: {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    'secondary.light': theme.palette.secondary.light,
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    action: theme.palette.action.active,
    error: theme.palette.error.main,
    disabled: theme.palette.action.disabled,
    inherit: undefined,
  }[props.color],
}))

const FuseSvgIcon = forwardRef((props, ref) => {
  // Guard: if children is not a string, fall back to MUI Icon
  if (typeof props.children !== 'string' || !props.children.includes(':')) {
    return <Icon ref={ref} {...props} />
  }

  // Convert 'collection:name' -> 'collection.name.svg#name'
  const iconPath = props.children.replace(':', '.svg#')

  // Use absolute path to ensure the sprite is resolved regardless of route
  const href = `/assets/icons/${iconPath}`

  return (
    <Root
      {...props}
      component='svg'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 100 100'
      className={clsx('shrink-0 fill-current ', props.className)}
      ref={ref}
      size={props.size}
      sx={props.sx}
      color={props.color}
    >
      <use xlinkHref={href} />
    </Root>
  )
})

FuseSvgIcon.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sx: PropTypes.object,
  color: PropTypes.oneOf([
    'inherit',
    'disabled',
    'primary',
    'secondary',
    'secondary.light',
    'action',
    'error',
    'info',
    'success',
    'warning',
  ]),
}

FuseSvgIcon.defaultProps = {
  children: '',
  size: 24,
  sx: {},
  color: 'inherit',
}

export default FuseSvgIcon
