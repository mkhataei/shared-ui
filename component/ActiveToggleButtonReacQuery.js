import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, CircularProgress, IconButton, Tooltip, Zoom } from '@mui/material'
import { alpha } from '@mui/material/styles'

const ActiveToggleButtonReactQuery = ({
  isActive,
  mutation,
  id,
  getRequestDataObject = (visibility) => ({ enable: visibility }),
  activeLabel = 'فعال',
  disableLabel = 'غیر فعال',
  tooltipPlacement = 'top',
}) => {
  const isWaiting = mutation.isPending && mutation?.variables?.id === id

  const sendToggleVisibilityRequest = (visibility) => {
    if (isWaiting) {
      return
    }

    mutation.mutate({
      id,
      body: getRequestDataObject(visibility),
    })
  }

  const currentStateLabel = isActive ? activeLabel : disableLabel
  const tooltipActionLabel = isActive ? disableLabel : activeLabel
  const tooltipTitle = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box component='span' sx={{ fontSize: 12, opacity: 0.7 }}>
        {`وضعیت فعلی: ${currentStateLabel}`}
      </Box>
      <Box component='span' sx={{ fontSize: 12, fontWeight: 600 }}>
        {`تغییر به: ${tooltipActionLabel}`}
      </Box>
    </Box>
  )
  const ariaLabel = `وضعیت فعلی ${currentStateLabel}. تغییر وضعیت به ${tooltipActionLabel}`

  return (
    <Tooltip title={tooltipTitle} placement={tooltipPlacement} arrow enterDelay={200}>
      <span>
        <IconButton
          size='small'
          aria-label={ariaLabel}
          aria-pressed={isActive}
          disabled={isWaiting}
          onClick={() => sendToggleVisibilityRequest(!isActive)}
          sx={(theme) => {
            const palette = isActive ? theme.palette.success : theme.palette.error

            return {
              padding: theme.spacing(1),
              borderRadius: 2,
              transition: theme.transitions.create([
                'background-color',
                'transform',
                'box-shadow',
              ]),
              backgroundColor: alpha(palette.main, 0.08),
              boxShadow: `inset 0 0 0 1px ${alpha(palette.main, 0.18)}`,
              '&:hover': {
                backgroundColor: alpha(palette.main, 0.16),
                transform: 'translateY(-1px) scale(1.05)',
                boxShadow: `0 8px 18px ${alpha(palette.main, 0.25)}`,
              },
              '&:active': {
                transform: 'scale(0.94)',
              },
              '&.Mui-disabled': {
                color: palette.main,
                backgroundColor: alpha(palette.main, 0.05),
                boxShadow: `inset 0 0 0 1px ${alpha(palette.main, 0.12)}`,
                opacity: 0.7,
              },
              '& .MuiTouchRipple-root': {
                color: palette.main,
              },
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zoom in={isActive} mountOnEnter unmountOnExit>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VisibilityIcon
                  sx={{
                    fontSize: 22,
                    color: (theme) => theme.palette.success.main,
                    filter: 'drop-shadow(0 2px 4px rgba(46, 125, 50, 0.35))',
                  }}
                />
              </Box>
            </Zoom>

            <Zoom in={!isActive} mountOnEnter unmountOnExit>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VisibilityOffIcon
                  sx={{
                    fontSize: 22,
                    color: (theme) => theme.palette.error.main,
                    filter: 'drop-shadow(0 2px 4px rgba(211, 47, 47, 0.3))',
                  }}
                />
              </Box>
            </Zoom>

            {isWaiting && (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
                    backdropFilter: 'blur(2px)',
                  }}
                />
                <CircularProgress
                  size={28}
                  thickness={5}
                  sx={{
                    position: 'absolute',
                    color: (theme) =>
                      isActive ? theme.palette.success.main : theme.palette.error.main,
                    animationDuration: '600ms',
                  }}
                />
              </>
            )}
          </Box>
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default ActiveToggleButtonReactQuery
