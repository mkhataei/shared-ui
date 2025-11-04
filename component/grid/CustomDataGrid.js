import { LinearProgress } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import PermissionUtils from '@shared/fuse/utils/PermissionUtils'
import PropTypes from 'prop-types'
import CustomNoRowsOverlay from './CustomNoRowsOverlay'
import TableFaLocale from './TableFaLocal'

function CustomDataGrid({
  user,
  defaultPageSize,
  pageSizeOptions,
  columnVisibilityModel,
  columns,
  rows,
  getRowHeight = () => 'auto',
  disableToolbar = false,
  ...rest
}) {
  return (
    <DataGrid
      {...rest}
      // columns={columns.map((col) => {
      // if (!col.renderCell) {
      // col.renderCell = renderCellExpand
      // }
      // return col
      // })}
      columns={columns.filter((c) => {
        if (!user) return true

        if (!c.permissions || !c.permissions.length === 0) {
          return true
        }

        return PermissionUtils.canList(c.permissions, user)
      })}
      rows={rows}
      autoHeight
      localeText={TableFaLocale.getLocale()}
      slots={{
        toolbar: disableToolbar ? null : GridToolbar,
        loadingOverlay: LinearProgress,
        noRowsOverlay: CustomNoRowsOverlay,
      }}
      initialState={{
        columns: {
          columnVisibilityModel,
        },
        pagination: { paginationModel: { pageSize: defaultPageSize } },
      }}
      pageSizeOptions={pageSizeOptions}
      getRowHeight={getRowHeight}
    />
  )
}

CustomDataGrid.defaultProps = {
  ...DataGrid.defaultProps,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  columnVisibilityModel: {
    id: false,
  },
}

CustomDataGrid.propTypes = {
  ...DataGrid.propTypes,
  defaultPageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  columnVisibilityModel: PropTypes.object,
}

export default CustomDataGrid
