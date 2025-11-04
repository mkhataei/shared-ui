import FuseSvgIcon from '@shared/fuse/core/FuseSvgIcon'

function ManageIcon({ onClick, icon }) {
  return (
    <button
      type='button'
      className='ml-8 inline-flex items-center rounded-lg border border-transparent bg-gray-200 p-4 text-gray-600 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      onClick={onClick}
    >
      <FuseSvgIcon className='text-24' size={20} color='action'>
        {icon}
      </FuseSvgIcon>
    </button>
  )
}

export default ManageIcon
