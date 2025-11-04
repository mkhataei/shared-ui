import AdapterJalaali from '@date-io/jalaali'
import { TextField } from '@mui/material'
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers'
import { faIR } from '@mui/x-date-pickers/locales'
import { Controller, useFormContext } from 'react-hook-form'

function FormFieldTimePicker({ name, label, className, ...otherProps }) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...restField } }) => (
        <LocalizationProvider
          dateAdapter={AdapterJalaali}
          localeText={faIR.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <MobileTimePicker
            ampm={false}
            label={label}
            onChange={(event) => {
              onChange(event)
            }}
            renderInput={(params) => <TextField {...params} className={className} />}
            {...restField}
            {...otherProps}
          />
        </LocalizationProvider>
      )}
    />
  )
}

export default FormFieldTimePicker
