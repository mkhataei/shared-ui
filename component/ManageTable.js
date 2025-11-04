import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import CanDo from './CanDo'
import TableEmptyState from './TableEmptyState'

function ManageTable({ cols, items, emptyText = 'هیچ داده‌ای یافت نشد.' }) {
  return (
    <TableContainer>
      <Table className='mb-0 overflow-x-auto'>
        <TableHead>
          <TableRow>
            {cols.map((col, index) => (
              <CanDo key={index} permissions={col.permissions}>
                <TableCell width={col.width} component='th'>
                  {col.name}
                </TableCell>
              </CanDo>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items?.map((item, index) => (
            <TableRow key={index} hover>
              {cols.map((col, ci) => (
                <CanDo key={ci} permissions={col.permissions}>
                  <TableCell>{col.data(item, index)}</TableCell>
                </CanDo>
              ))}
            </TableRow>
          ))}
          <TableEmptyState items={items} message={emptyText} />
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ManageTable
