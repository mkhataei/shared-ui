import { Paper } from '@mui/material'

function EmptyMessageCard({ message }) {
  return (
    <Paper
      component='div'
      className='flex flex-col flex-auto items-center shadow rounded-2xl overflow-hidden p-32'
    >
      {message}
    </Paper>
  )
}

export default EmptyMessageCard
