import AdapterJalaali from '@date-io/jalaali'
import { TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import moment from 'moment-jalaali'
import { Controller, useFormContext } from 'react-hook-form'

moment.locale('fa')
moment.loadPersian()

function FormFieldJalaliDatePicker({ name, label, className, required, disablePortal, ...otherProps }) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...restField } }) => (
        <LocalizationProvider dateAdapter={AdapterJalaali}>
          <DatePicker
            label={`${label}${required ? ' *' : ''}`}
            mask='____/__/__'
            value={value ? moment(+value) : null}
            onChange={(event) => {
              onChange(event)
              // setreqDate(event)
            }}
            renderInput={(params) => <TextField fullWidth {...params} className={className} />}
            PopperProps={{ disablePortal }}
            DialogProps={{ disablePortal }}
            {...restField}
            {...otherProps}
          />
        </LocalizationProvider>
      )}
    />
  )
}

export default FormFieldJalaliDatePicker
