import { Alert, Box, Button, Paper, Typography } from '@mui/material'
import FuseSvgIcon from '@shared/fuse/core/FuseSvgIcon'
import { useNavigate } from 'react-router-dom'
import {
  LockOutlined,
  SearchOff,
  ErrorOutline,
  PersonOutline,
} from '@mui/icons-material'

/**
 * @component ErrorPage
 * @description کامپوننت مرکزی برای نمایش تمام خطاهای HTTP
 */
const ErrorPage = ({ 
  statusCode = 403,
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
  customActions,
}) => {
  const navigate = useNavigate()

  const errorConfigs = {
    403: {
      title: 'دسترسی محدود شده',
      defaultMessage: 'شما دسترسی لازم برای مشاهده این بخش را ندارید.',
      IconComponent: LockOutlined,
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      iconGradient: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      iconColor: 'rgba(45, 55, 72, 0.3)',
      animation: true,
      fullScreen: true,
      alert: {
        severity: 'info',
        message: 'برای دریافت دسترسی با مدیر سیستم تماس بگیرید'
      }
    },
    404: {
      title: 'صفحه یافت نشد',
      defaultMessage: 'صفحه یا منبع مورد نظر شما یافت نشد.',
      IconComponent: SearchOff,
      gradient: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
      iconGradient: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
      iconColor: 'rgba(113, 128, 150, 0.3)',
      animation: true,
      fullScreen: true,
      alert: null
    },
    500: {
      title: 'خطای سرور',
      defaultMessage: 'مشکلی در سرور پیش آمده است. لطفاً بعداً تلاش کنید.',
      IconComponent: ErrorOutline,
      gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      iconGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      iconColor: 'rgba(239, 68, 68, 0.4)',
      animation: true,
      fullScreen: true,
      alert: {
        severity: 'error',
        message: 'در صورت تکرار خطا با پشتیبانی تماس بگیرید'
      }
    },
    401: {
      title: 'احراز هویت نشده',
      defaultMessage: 'برای دسترسی به این بخش باید وارد سیستم شوید.',
      IconComponent: PersonOutline,
      gradient: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      iconGradient: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
      iconColor: 'rgba(74, 85, 104, 0.3)',
      animation: true,
      fullScreen: true,
      alert: {
        severity: 'warning',
        message: 'لطفاً وارد حساب کاربری خود شوید'
      }
    }
  }

  const config = errorConfigs[statusCode] || errorConfigs[403]
  const displayTitle = title || config.title
  const displayMessage = message || config.defaultMessage

  if (config.fullScreen && config.animation) {
    return (
      <Box 
        className='flex items-center justify-center w-full'
        sx={{ 
          alignItems: 'center',
          overflow: 'hidden',
          marginTop:16
        }}
      >
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 4,
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'white',
            backdropFilter: 'none',
          }}
        >
          <Box className='flex flex-col items-center text-center gap-24'>
            {/* Animated Icon */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: config.iconGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'iconPulse 2s ease-in-out infinite',
                boxShadow: `0 8px 32px ${config.iconColor}`,
                '@keyframes iconPulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    boxShadow: `0 8px 32px ${config.iconColor}`,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 8px 48px ${config.iconColor}`,
                  },
                },
                '& svg': {
                  animation: statusCode === 403 ? 'lockShake 3s ease-in-out infinite' : 'none',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                },
                '@keyframes lockShake': {
                  '0%, 100%': { transform: 'rotate(0deg)' },
                  '10%, 30%': { transform: 'rotate(-8deg)' },
                  '20%, 40%': { transform: 'rotate(8deg)' },
                  '50%': { transform: 'rotate(0deg)' },
                },
              }}
            >
              {config.IconComponent ? (
                <config.IconComponent 
                  sx={{ 
                    fontSize: 64, 
                    color: 'white',
                    animation: statusCode === 403 ? 'lockShake 3s ease-in-out infinite' : statusCode === 500 ? 'errorPulse 1.5s ease-in-out infinite' : 'none',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    '@keyframes errorPulse': {
                      '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                      '50%': { transform: 'scale(1.1) rotate(5deg)' },
                    },
                  }} 
                />
              ) : (
                <FuseSvgIcon size={64} sx={{ color: 'white' }}>
                  {config.icon}
                </FuseSvgIcon>
              )}
            </Box>

            {/* Error Code & Message */}
            <Box>
              <Typography 
                variant='h1' 
                sx={{ 
                  fontSize: '72px',
                  fontWeight: 800,
                  background: config.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {statusCode}
              </Typography>
              <Typography 
                variant='h5' 
                className='font-bold mb-8'
                sx={{ color: 'text.primary' }}
              >
                {displayTitle}
              </Typography>
              <Typography 
                variant='body1' 
                color='text.secondary'
                sx={{ mb: 3, lineHeight: 1.8 }}
              >
                {displayMessage}
              </Typography>
            </Box>

            {/* Alert if configured */}
            {config.alert && (
              <Alert 
                severity={config.alert.severity}
                className='w-full text-right'
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '24px',
                  },
                }}
              >
                {config.alert.message}
              </Alert>
            )}

            {/* Action Buttons */}
            {customActions || (
              <Box className='flex gap-8 w-full'>
                {showBackButton && (
                  <Button
                    variant='contained'
                    fullWidth
                    size='large'
                    onClick={() => navigate(-1)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    بازگشت به صفحه قبل
                  </Button>
                )}
                {showHomeButton && (
                  <Button
                    variant='outlined'
                    fullWidth
                    size='large'
                    onClick={() => navigate('/')}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      borderWidth: 2,
                      borderColor: '#2d2d2d',
                      color: '#1a1a1a',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#1a1a1a',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    صفحه اصلی
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    )
  }

  // Component برای سایر خطاها (Simple design)
  return (
    <Box 
      className='flex items-center justify-center w-full'
      sx={{ minHeight: '60vh', p: 3 }}
    >
      <Paper 
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 450,
          width: '90%',
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Box className='flex flex-col items-center gap-20'>
          {/* Simple Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FuseSvgIcon size={48} sx={{ color: 'grey.500' }}>
              {config.icon}
            </FuseSvgIcon>
          </Box>

          {/* Error Code & Message */}
          <Box>
            <Typography 
              variant='h2' 
              sx={{ 
                fontSize: '64px',
                fontWeight: 700,
                color: 'grey.600',
                mb: 1,
              }}
            >
              {statusCode}
            </Typography>
            <Typography 
              variant='h6' 
              className='font-bold mb-8'
              sx={{ color: 'text.primary' }}
            >
              {displayTitle}
            </Typography>
            <Typography 
              variant='body2' 
              color='text.secondary'
            >
              {displayMessage}
            </Typography>
          </Box>

          {/* Action Buttons */}
          {customActions || (
            <Box className='flex gap-8 w-full' sx={{ mt: 2 }}>
              {showBackButton && (
                <Button
                  variant='contained'
                  fullWidth
                  onClick={() => navigate(-1)}
                  sx={{ borderRadius: 2 }}
                >
                  بازگشت
                </Button>
              )}
              {showHomeButton && (
                <Button
                  variant='outlined'
                  fullWidth
                  onClick={() => navigate('/')}
                  sx={{ borderRadius: 2 }}
                >
                  صفحه اصلی
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default ErrorPage
