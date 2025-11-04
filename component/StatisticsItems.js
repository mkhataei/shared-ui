import { Skeleton } from '@mui/material'
import StatisticsItem from './StatisticsItem'

const VARIENT = [
  { textColor: 'text-green-500' },
  { textColor: 'text-amber-500' },
  { textColor: 'text-red-500' },
  { textColor: 'text-blue-500' },
]

const StatisticsItems = ({ stats, loading, variant = VARIENT }) => {
  return (
    <dl className='grid grid-cols-1 gap-16 sm:grid-cols-4'>
      {(loading || !stats) &&
        Array.from(Array(4).keys()).map((item, index) => (
          <Skeleton key={index} animation='wave' variant='rounded' height={160} />
        ))}
      {!loading &&
        stats &&
        stats?.map((item, index) => {
          const { textColor } = variant[index % variant.length]
          return <StatisticsItem key={index} item={item} color={textColor} />
        })}
    </dl>
  )
}

export default StatisticsItems
