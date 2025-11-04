import { Skeleton, Typography } from '@mui/material'
import { motion } from 'framer-motion'

function CustomCompactPageHeader({ title, subTitle, loading = false, actions }) {
  return (
    <div className='px-24 py-32 sm:py-48 sm:px-32 w-full flex flex-col-reverse sm:flex-row justify-between'>
      <div className='flex flex-col items-center sm:items-start'>
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className='text-16 md:text-24 font-extrabold tracking-tight leading-none'
        >
          {loading ? <Skeleton animation='wave' height={110} /> : title}
        </Typography>

        <Typography
          component={motion.span}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          delay={500}
          className='text-14 font-medium ml-2'
          color='text.secondary'
        >
          {subTitle}
        </Typography>
      </div>

      {actions && <div className=''>{actions}</div>}
    </div>
  )
}

export default CustomCompactPageHeader
