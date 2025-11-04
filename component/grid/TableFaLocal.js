import { faIR } from '@mui/x-data-grid'

class TableFaLocale {
  static getLocale() {
    const locale = faIR.components.MuiDataGrid.defaultProps.localeText
    locale.MuiTablePagination.labelDisplayedRows = ({ from, to, count }) =>
      `${from} - ${to} از ${count}`

    return locale
  }
}

export default TableFaLocale
