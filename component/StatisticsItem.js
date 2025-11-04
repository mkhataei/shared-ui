import { Paper, Typography } from '@mui/material'
import GeneralUtils from '@shared/fuse/utils/GeneralUtils'

const StatisticsItem = ({ item, color = 'text-blue-500' }) => {
  return (
    <Paper className='flex flex-col flex-auto shadow rounded-2xl overflow-hidden py-24'>
      <div className='flex items-center justify-center px-8'>
        <Typography
          className='px-16 text-lg font-medium tracking-tight leading-6 truncate'
          color='text.secondary'
        >
          {item.name}
        </Typography>
      </div>
      <div className='text-center mt-16'>
        <Typography
          className={`text-6xl sm:text-7xl font-bold tracking-tight leading-none ${color}`}
        >
          {GeneralUtils.numberWithCommas(item.value)}
        </Typography>
        <Typography className={`text-lg font-medium ${color}`}>{item.unit}</Typography>
      </div>
    </Paper>
  )
}

export default StatisticsItem
