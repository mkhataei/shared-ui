import { ListItemIcon, MenuItem, useTheme } from '@mui/material'
import PermissionUtils from '@shared/fuse/utils/PermissionUtils'
import CopyableText from '@shared/component/CopyableText'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { MRT_Localization_FA as FaLocale } from 'material-react-table/locales/fa'
import PropTypes from 'prop-types'
import AppliedFilters from '../AppliedFilters'
import CustomNoRowsOverlay from './CustomNoRowsOverlay'

function MuiReactTable({
  className,
  user,
  columns,
  data,
  columnVisibilityModel,
  density,
  renderRowActionMenuItems,
  pageSizeOptions,
  defaultPageSize,
  actionItems,
  isError,
  onRowClick,
  onRowDoubleClick,
  disableActionColumPin,
  startPinnedColumns,
  state,
  onGlobalFilterChange,
  onColumnFiltersChange,
  disableRowNumbers = false,
  enableColumnBorder = false,
  enableRowStripe = false,
  getRowBackground = null,
  showFilters = false,
  ...rest
}) {
  const theme = useTheme()

  const baseHighlightColor =
    theme.palette.mode === 'dark' ? 'rgba(10, 10, 10, 1)' : 'rgba(245, 245, 245, 1)'

  // Avoid shadowed variable 'data' in muiTableBodyProps
  const processedColumns = columns
    .filter((c) => {
      if (!user) return true
      if (!c.permissions || c.permissions.length === 0) return true
      return PermissionUtils.canList(c.permissions, user)
    })
    .map((col) => {
      if (col.copyable) {
        return {
          ...col,
          Cell: ({ cell }) => {
            const text = cell.getValue()
            if(typeof text === 'string' && text.length > 0 && text !== '-') {
              return <CopyableText text={text} copyText={text} />
            }
            return text
          },
        }
      }
      return col
    })

  const tableData = useMaterialReactTable({
    columns: processedColumns,
    data,
    // layoutMode: 'grid-no-grow',
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
      size: 180,
    },
    muiToolbarAlertBannerProps: isError
      ? { color: 'error', children: 'خطا در بارگیری اطلاعات...' }
      : undefined,
    positionPagination: 'bottom',
    muiPaginationProps: {
      rowsPerPageOptions: pageSizeOptions,
    },
    initialState: {
      columnPinning: {
        right: disableActionColumPin ? [] : ['mrt-row-actions'],
        left: startPinnedColumns || [],
      },
      columnVisibility: columnVisibilityModel,
      density,
      pagination: { pageIndex: 0, pageSize: defaultPageSize },
    },
    enableColumnPinning: true,
    enableRowNumbers: !disableRowNumbers,
    muiTablePaperProps: {
      elevation: 0,
      sx: (theTheme) => {
        return {
          boxShadow: 'none',
          backgroundColor: 'transparent',
          borderRadius: '0',
          backgroundColor: theTheme.palette.background.paper,
        }
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        if (onRowClick) onRowClick(event, row)
      },
      onDoubleClick: (event) => {
        if (onRowDoubleClick) onRowDoubleClick(event, row)
      },
      sx: (theTheme) => ({
        backgroundColor:
          getRowBackground && getRowBackground(row)
            ? `${getRowBackground(row)} !important`
            : theTheme.palette.background.paper,
        cursor: onRowClick ? 'pointer' : 'auto',
      }),
    }),
    muiTableHeadRowProps: {
      sx: (theTheme) => ({ backgroundColor: theTheme.palette.background.paper }),
    },
    muiTopToolbarProps: {
      sx: (theTheme) => ({ backgroundColor: theTheme.palette.background.paper, minHeight: '5rem' }),
    },
    muiBottomToolbarProps: {
      sx: (theTheme) => ({
        backgroundColor: theTheme.palette.background.paper,
        minHeight: '5rem',
        boxShadow: 'none',
      }),
    },
    muiTableHeadCellProps: ({ column }) => {
      const sx = {}
      if (enableColumnBorder) sx.borderLeft = `1px solid ${baseHighlightColor}`
      if (column.id === 'mrt-row-numbers' || column.id === 'mrt-row-actions') {
        sx.textAlign = 'center'
      } else {
        sx.textAlign = 'left'
      }
      return { sx }
    },
    muiTableBodyProps: () => {
      const sx = {
        '& .MuiTableCell-root[data-pinned="true"]:before': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
        },
      }
      if (enableRowStripe) {
        sx['& tr:nth-of-type(odd)'] = {
          backgroundColor: '#f5f5f5',
        }
      }
      return { sx }
    },
    muiTableBodyCellProps: ({ column }) => {
      const sx = {
        flexDirection: 'row',
        textWrap: 'auto',
      }
      if (enableColumnBorder) sx.borderLeft = `1px solid ${baseHighlightColor}`
      if (column.id === 'mrt-row-numbers' || column.id === 'mrt-row-actions') {
        sx.textAlign = 'center'
      } else {
        sx.textAlign = 'left'
      }
      return { sx }
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 50, // set custom width
        muiTableHeadCellProps: {
          align: 'center',
        },
      },
      'mrt-row-numbers': {
        enableColumnDragging: true,
        enableColumnOrdering: true,
        enableResizing: true,
        muiTableHeadCellProps: {
          align: 'center',
          sx: {
            fontSize: '1.2rem',
          },
        },
        muiTableBodyCellProps: {
          align: 'center',
          sx: { marginLeft: 0 },
        },
      },
      'mrt-row-select': {
        enableColumnActions: true,
        enableHiding: true,
        size: 100,
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
    },
    muiTableFooterCellProps: {
      sx: (theTheme) => ({ boxShadow: 'none', borderRadius: '0' }),
    },
    muiTableHeadProps: {
      sx: {
        '& .MuiTableCell-root[data-pinned="true"]:before': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
        },
      },
    },
    localization: FaLocale,
    enableRowActions: !!actionItems,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: (options) => {
      if (actionItems)
        return actionItems(options.row.original)
          ?.filter((ai) => !!ai)
          ?.filter((c) => {
            if (!user) return true
            if (!c.permissions || c.permissions.length === 0) return true
            return PermissionUtils.canList(c.permissions, user)
          })
          ?.map((action, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                if (action.onClick && !action.loading) action.onClick()
                options.closeMenu()
              }}
            >
              {!action.loading ? (
                <>
                  {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>} {action.label}
                </>
              ) : (
                <>در حال بارگذاری ...</>
              )}
            </MenuItem>
          ))
      return null
    },
    renderEmptyRowsFallback: () => <CustomNoRowsOverlay />,
    state,
    onGlobalFilterChange,
    onColumnFiltersChange,
    ...rest,
  })

  return (
    <div className={className}>
      {showFilters && (
        <AppliedFilters
          className={'mx-24 mb-24'}
          globalFilter={state.globalFilter}
          columnFilters={state.columnFilters}
          setGlobalFilter={onGlobalFilterChange}
          setColumnFilters={onColumnFiltersChange}
          columns={columns}
          showWhenEmpty={true}
        />
      )}

      <MaterialReactTable table={tableData} />
    </div>
  )
}

MuiReactTable.defaultProps = {
  ...MaterialReactTable.defaultProps,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  columnVisibilityModel: {
    id: false,
    _id: false,
  },
  density: 'compact',
}

MuiReactTable.propTypes = {
  ...MaterialReactTable.propTypes,
  defaultPageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  columnVisibilityModel: PropTypes.object,
}

export default MuiReactTable
