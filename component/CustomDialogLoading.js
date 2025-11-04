import { CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'

const CustomDialogLoading = ({ loading }) => {
  return loading ? (
    <div className='absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-80 text-center'>
      <CircularProgress />
    </div>
  ) : null
}

CustomDialogLoading.propTypes = {
  loading: PropTypes.bool.isRequired,
}

export default CustomDialogLoading
