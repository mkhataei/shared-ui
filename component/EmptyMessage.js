import { Typography } from '@mui/material'

function EmptyMessage({ message, height = 100 }) {
  return (
    <Typography
      className='w-full flex justify-center items-center'
      style={{ height: `${height}px` }}
    >
      {message}
    </Typography>
  )
}

export default EmptyMessage
