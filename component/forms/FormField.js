import { TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

function FormField({ name, label, className, type, ...otherProps }) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          className={className}
          label={label}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          variant='outlined'
          type={type}
          fullWidth
          InputProps={{
            sx: type === 'number' ? {
              '& input::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            } : undefined,
          }}
          onWheel={(e) => e.target.blur()}
          {...otherProps}
        />
      )}
    />
  )
}

export default FormField
