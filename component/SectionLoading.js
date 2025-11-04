import { CircularProgress } from '@mui/material'

function SectionLoading({ size = 40, height = 300 }) {
  return (
    <div className='flex items-center justify-center text-center w-full' style={{ height }}>
      <CircularProgress color='primary' size={size} />
    </div>
  )
}

export default SectionLoading
