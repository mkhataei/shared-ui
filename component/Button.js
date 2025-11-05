import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import FuseSvgIcon from './FuseSvgIcon' // یا استفاده از آیکون Material-UI

const StyledButton = styled(Button)(({ theme, color }) => ({
  // استایل‌های پایه
  transition: theme.transitions.create(
    ['background-color', 'box-shadow', 'border-color', 'transform'],
    {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeInOut,
    }
  ),

  // استایل‌های hover
  '&:hover': {
    backgroundColor:
      color === 'primary' ? theme.palette.primary.dark : theme.palette.secondary.dark,
    transform: 'translateY(-1px)', // حرکت بالا
    boxShadow: theme.shadows[4], // سایه بیشتر

    // انیمیشن آیکون در hover
    '& .MuiButton-startIcon': {
      transform: 'scale(1.1)',
      transition: theme.transitions.create(['transform'], {
        duration: theme.transitions.duration.short,
      }),
    },
  },

  // استایل‌های active (کلیک)
  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: theme.shadows[2],
  },

  // استایل‌های focus
  '&:focus': {
    boxShadow: `0 0 0 3px ${
      color === 'primary' ? theme.palette.primary.light : theme.palette.secondary.light
    }40`, // حلقه focus شفاف
  },
}))

function CustomButton({
  className,
  children,
  onClick,
  href,
  target,
  component,
  variant = 'contained',
  color = 'secondary',
  startIcon,
  endIcon,
  size,
  sx,
  ...otherProps
}) {
  // Default purchase button behavior if no custom props provided
  if (!children && !onClick && !href) {
    return (
      <StyledButton
        component='a'
        href='https://1.envato.market/zDGL6'
        target='_blank'
        rel='noreferrer noopener'
        role='button'
        className={clsx('', className)}
        variant='contained'
        color='secondary'
        startIcon={<FuseSvgIcon size={16}>heroicons-outline:shopping-cart</FuseSvgIcon>}
      >
        Purchase FUSE React
      </StyledButton>
    )
  }

  // Custom button with provided props
  return (
    <StyledButton
      component={component}
      href={href}
      target={target}
      onClick={onClick}
      className={clsx('', className)}
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      size={size}
      sx={sx}
      {...otherProps}
    >
      {children}
    </StyledButton>
  )
}

export default CustomButton
