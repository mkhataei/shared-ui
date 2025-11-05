/**
 * @module ActionButton
 * @description کامپوننت دکمه عمل قابل تنظیم برای انواع اقدامات
 */

import { Button } from '@mui/material'
import FuseSvgIcon from '@shared/fuse/core/FuseSvgIcon/FuseSvgIcon'
import clsx from 'clsx'
import PropTypes from 'prop-types'

/**
 * @component ActionButton
 * @description کامپوننت دکمه قابل تنظیم برای انواع اقدامات
 * @param {Object} props - props کامپوننت
 * @param {string} props.className - کلاس CSS اضافی
 * @param {string} props.variant - نوع دکمه (contained, outlined, text)
 * @param {string} props.color - رنگ دکمه
 * @param {string} props.text - متن دکمه
 * @param {string} props.icon - آیکون دکمه
 * @param {number} props.iconSize - اندازه آیکون
 * @param {Function} props.onClick - تابع کلیک
 * @param {string} props.href - لینک برای دکمه
 * @param {string} props.target - target برای لینک
 * @param {string} props.rel - rel برای لینک
 * @param {Object} props.component - کامپوننت سفارشی
 * @param {Object} props.sx - استایل Material-UI
 * @param {boolean} props.disabled - غیرفعال کردن دکمه
 * @param {string} props.size - اندازه دکمه
 */
function ActionButton({
  className,
  variant = 'contained',
  color = 'secondary',
  text,
  icon,
  iconSize = 20,
  onClick,
  href,
  target,
  rel,
  component,
  sx,
  disabled = false,
  size = 'medium',
  ...otherProps
}) {
  const buttonProps = {
    className: clsx('', className),
    variant,
    color,
    onClick,
    disabled,
    size,
    sx: {
      minWidth: 160,
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      ...sx,
    },
    ...otherProps,
  }

  // اگر href وجود دارد، از component="a" استفاده کن
  if (href) {
    buttonProps.component = component || 'a'
    buttonProps.href = href
    buttonProps.target = target
    buttonProps.rel = rel
  } else if (component) {
    buttonProps.component = component
  }

  return (
    <Button {...buttonProps} startIcon={icon && <FuseSvgIcon size={iconSize}>{icon}</FuseSvgIcon>}>
      {text}
    </Button>
  )
}

ActionButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  onClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  component: PropTypes.elementType,
  sx: PropTypes.object,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
}

export default ActionButton
