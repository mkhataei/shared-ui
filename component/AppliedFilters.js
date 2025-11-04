import { Chip } from '@mui/material'
import clsx from 'clsx'
import { useMemo } from 'react'

function AppliedFilters({
  className,
  globalFilter,
  columnFilters,
  setGlobalFilter,
  setColumnFilters,
  columns,
  showWhenEmpty = true,
}) {
  const columnMap = useMemo(() => {
    const map = {}
    columns.forEach(col => {
      if (col.accessorKey) {
        map[col.accessorKey] = col.header
      }
    })
    return map
  }, [columns])

  const getFilterDisplayValue = (columnId, filterValue) => {
    const column = columns.find(col => col.accessorKey === columnId)
    if (column?.filterSelectOptions) {
      const option = column.filterSelectOptions.find(opt => opt.value === filterValue)
      return option?.text || filterValue
    }
    return filterValue
  }

  const hasFilters = !!globalFilter || columnFilters?.length > 0

  const removeColumnFilter = (id) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== id))
  }

  const clearAll = () => {
    setGlobalFilter('')
    setColumnFilters([])
  }

  if (!hasFilters && !showWhenEmpty) return null

  return (
    <div className={
      clsx("bg-white border border-gray-200 rounded-2xl p-16 shadow-sm flex flex-wrap items-center gap-8 min-h-[56px]", className)
    }>
      {hasFilters ? (
        <>
          <span className="text-md font-semibold text-gray-700 mr-2">فیلترهای فعال:</span>

          {globalFilter && (
            // <div className="flex gap-8 items-center bg-blue-100/60 text-blue-800 px-10 py-2 rounded-full text-sm shadow-sm">
            //   <span>جستجوی کلی: {globalFilter}</span>
            //   <button
            //     onClick={() => setGlobalFilter('')}
            //     className="hover:text-blue-500"
            //     aria-label="remove global filter"
            //   >
            //     <Close fontSize="small" />
            //   </button>
            // </div>
            <Chip
              label={`جستجوی کلی: ${globalFilter}`}
              onDelete={() => setGlobalFilter('')}
              color="primary"
              variant="outlined"
            />
          )}

          {columnFilters.map((filter) => (
            // <div
            //   key={filter.id}
            //   className="flex gap-8 items-center bg-indigo-100/60 text-indigo-800 px-10 py-2 rounded-full text-sm shadow-sm"
            // >
            //   <span>{columnMap[filter.id] || filter.id}: {filter.value}</span>
            //   <button
            //     onClick={() => removeColumnFilter(filter.id)}
            //     className="hover:text-indigo-500"
            //     aria-label={`remove filter ${filter.id}`}
            //   >
            //     <Close fontSize="small" />
            //   </button>
            // </div>
            <Chip
              key={filter.id}
              label={`${columnMap[filter.id] || filter.id}: ${getFilterDisplayValue(filter.id, filter.value)}`}
              onDelete={() => removeColumnFilter(filter.id)}
              color="secondary"
              variant="outlined"
            />
          ))}

          <button
            onClick={clearAll}
            className="ml-auto text-xs text-gray-500 hover:text-red-600 underline"
          >
            پاک کردن همه
          </button>
        </>
      ) : (
        <span className="text-sm text-gray-400">هیچ فیلتری اعمال نشده است</span>
      )}
    </div>
  )
}

export default AppliedFilters
