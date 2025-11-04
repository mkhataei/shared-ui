import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TablePagination,
} from '@mui/material'
import Constants from '@shared/fuse/constants'
import FuseSvgIcon from '@shared/fuse/core/FuseSvgIcon'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'

function usePaginatedTable(items, options) {
  const tableOptions = {
    searchKeys: ['name'],
    defaultRowsCount: 50,
    rowsPerPageList: [10, 25, 50, 100],
    ...options,
  }

  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(tableOptions.defaultRowsCount)
  const [filteredItems, setFilteredItems] = useState([])
  const [currentItems, setCurrentItems] = useState([])

  useEffect(() => {
    if (query && items) {
      const fuseOptions = {
        includeScore: true,
        threshold: Constants.defaultFusejsThreshold,
        keys: tableOptions.searchKeys,
      }
      const fuse = new Fuse(items, fuseOptions)
      const result = fuse.search(query)
      setFilteredItems(result.map((item) => item.item))
    } else {
      setFilteredItems(items || [])
    }
  }, [items, query, tableOptions.searchKeys])

  useEffect(() => {
    setCurrentItems(
      filteredItems.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
    )
  }, [currentPage, filteredItems, rowsPerPage])

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setCurrentPage(0)
  }

  const renderSearchInput = () => (
    <FormControl variant='outlined'>
      <InputLabel htmlFor='search-table'>جستجو هوشمند</InputLabel>
      <OutlinedInput
        id='search-table'
        label='جستجو هوشمند'
        endAdornment={
          <InputAdornment position='end'>
            <FuseSvgIcon color='action'>heroicons-solid:search</FuseSvgIcon>
          </InputAdornment>
        }
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setCurrentPage(0)
        }}
      />
    </FormControl>
  )

  const renderPagination = () =>
    filteredItems && (
      <TablePagination
        component='div'
        page={currentPage}
        labelDisplayedRows={({ from, to, count }) => {
          return `${from} - ${to} از ${count}`
        }}
        labelRowsPerPage='تعداد سطر در هر صفحه:'
        rowsPerPageOptions={tableOptions.rowsPerPageList}
        rowsPerPage={rowsPerPage}
        count={filteredItems ? filteredItems.length : 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    )

  return [
    currentItems,
    currentPage,
    rowsPerPage,
    renderPagination,
    renderSearchInput,
    handleChangePage,
    handleChangeRowsPerPage,
  ]
}

export default usePaginatedTable
