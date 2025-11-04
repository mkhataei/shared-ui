import { Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

function FormFieldCheckbox({ name, label, desc, className, disabled, ...otherProps }) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <FormControl fullWidth error={!!errors[name]} className={className}>
      <FormControlLabel
        control={
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                disabled={disabled}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        }
        label={label}
        disabled={disabled}
        {...otherProps}
      />
      {!!errors[name] && (
        <FormHelperText className='text-red-500'>{errors[name]?.message}</FormHelperText>
      )}
      {desc && (
        <p className='text-sm' color='text.secondary'>
          {desc}
        </p>
      )}
    </FormControl>
  )
}

export default FormFieldCheckbox
