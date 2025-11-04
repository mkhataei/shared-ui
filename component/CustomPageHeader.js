import { Skeleton } from '@mui/material'
import clsx from 'clsx'

function CustomPageHeader({ title, subTitle, loading = false, actions }) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-7xl relative',
        actions ? 'pt-72 pb-44 sm:py-96' : ' py-44 sm:py-96'
      )}
    >
      {actions && <div className='absolute left-32 top-32'>{actions}</div>}

      <div className='text-center max-w-screen-md mx-auto'>
        {loading ? (
          <h1 className='text-3xl leading-tight font-extrabold sm:text-4xl md:text-6xl'>
            <Skeleton animation='wave' height={110} />
          </h1>
        ) : (
          <h1 className='text-3xl leading-tight font-extrabold sm:text-4xl md:text-6xl'>{title}</h1>
        )}

        {subTitle &&
          (loading ? (
            <h2 className='text-xl sm:text-2xl md:text-4xl'>
              <Skeleton animation='wave' height={80} />
            </h2>
          ) : (
            <h2 className='text-xl sm:text-2xl md:text-4xl'>{subTitle}</h2>
          ))}
      </div>
    </div>
  )
}

export default CustomPageHeader
