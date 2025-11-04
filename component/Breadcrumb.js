import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { Breadcrumbs, Link, Skeleton } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function Breadcrumb({ items, isLoading }) {
  return isLoading ? (
    <Skeleton animation='wave' variant='rounded' height={35} />
  ) : (
    <div className='mb-4 px-16 py-16'>
      <Breadcrumbs aria-label='breadcrumb' separator={<ChevronLeft fontSize='small' />}>
        {items.map((item, index) => {
          if (index === items.length - 1) {
            return <span key={index}>{item.title}</span>
          }
          return (
            <Link key={index} color='inherit' component={RouterLink} to={item.link}>
              {item.title}
            </Link>
          )
        })}
      </Breadcrumbs>
    </div>
  )
}

export default Breadcrumb
