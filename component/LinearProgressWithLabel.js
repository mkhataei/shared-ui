import { Box, LinearProgress } from '@mui/material'

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant='determinate'
          {...props}
          sx={{
            borderRadius: '5px',
            height: '9px',
            backgroundColor: '#e6e7e850',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#e4be92',
            },
          }}
        />
      </Box>
      <div className='min-w-min text-xs'>{`${Math.round(props.value)}%`}</div>
    </Box>
  )
}

export default LinearProgressWithLabel
