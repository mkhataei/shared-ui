import { FormControl, FormHelperText } from '@mui/material'
import clsx from 'clsx'
import { Controller, useFormContext } from 'react-hook-form'
import WYSIWYGEditor from '../WYSIWYGEditor'

function FormFieldWYSIWYG({ name, label, className, required, ...otherProps }) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <FormControl fullWidth error={!!errors[name]} className={className}>
      <p id={`${name}-label`}>{`${label}${required ? '*' : ''}`}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ...restField } }) => (
          <WYSIWYGEditor
            className={clsx(className)}
            label={label}
            onChange={(event) => {
              onChange(event)
            }}
            {...restField}
            {...otherProps}
          />
        )}
      />
      {!!errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
    </FormControl>
  )
}

export default FormFieldWYSIWYG
