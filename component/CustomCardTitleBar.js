import { Typography } from '@mui/material'

function CustomCardTitleBar({ title, actions }) {
  if (!title && !actions) return null

  return (
    <div className='flex flex-col md:flex-row items-center justify-between p-16 sm:p-24 gap-16'>
      {title ? (
        <Typography className='text-xl font-medium tracking-tight leading-6 truncate'>
          {title}
        </Typography>
      ) : <div />}
      {actions && <div className='mt-12 sm:mt-0 sm:ml-8 sm:rtl:mr-8'>{actions}</div>}
    </div>
  )
}

export default CustomCardTitleBar
