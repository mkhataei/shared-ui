import { Close } from '@mui/icons-material'
import { DialogTitle } from '@mui/material'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const CustomDialogTitle = ({ onClose, title, ButtonComponent, bottomLine = false }) => {
  return (
    <DialogTitle className={clsx(bottomLine && 'border-b border-gray-200')}>
      <div className='flex items-center justify-between'>
        <span>{title}</span>
        <div className='flex flex-row gap-4'>
          {ButtonComponent}
          <button
            type='button'
            onClick={onClose}
            className='inline-flex items-center rounded-full border border-transparent p-8 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-4'
          >
            <Close className='h-24 w-24' aria-hidden='true' />
          </button>
        </div>
      </div>
    </DialogTitle >
  )
}

CustomDialogTitle.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  ButtonComponent: PropTypes.object,
}

export default CustomDialogTitle
