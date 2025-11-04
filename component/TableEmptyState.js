import { TableCell, TableRow } from '@mui/material'

function TableEmptyState({ message, items }) {
  if (items && items.length > 0) return null

  return (
    <TableRow>
      <TableCell colSpan={10}>
        <div className='flex justify-center items-center w-full h-[150px]'>{message}</div>
      </TableCell>
    </TableRow>
  )
}

export default TableEmptyState
