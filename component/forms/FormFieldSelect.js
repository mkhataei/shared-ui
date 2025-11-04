import { Clear } from '@mui/icons-material'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

function FormFieldSelect({ name, label, className, values, required, desc, disabled, ...otherProps }) {
  const { formState, control, setValue, getValues } = useFormContext()
  const { errors } = formState

  return (
    <FormControl fullWidth error={!!errors[name]} className={className}>
      <InputLabel id={`${name}-label`}>{`${label}${required ? '*' : ''}`}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${name}-label`}
            label={label}
            variant='outlined'
            fullWidth
            disabled={disabled}
            {...otherProps}
            endAdornment={
              !disabled && (
                <IconButton
                  sx={{ display: getValues()[name] ? '' : 'none', marginRight: 2 }}
                  onClick={() => {
                    setValue(name, '', { shouldValidate: true, shouldDirty: true })
                  }}
                >
                  <Clear fontSize='small' />
                </IconButton>
              )
            }
          >
            {values &&
              values.map((value, index) => {
                return (
                  <MenuItem key={index} value={value.value}>
                    {value.label || value.name}
                  </MenuItem>
                )
              })}
          </Select>
        )}
      />
      {!!errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
      {desc && (
        <p className='text-sm' color='text.secondary'>
          {desc}
        </p>
      )}
    </FormControl>
  )
}

export default FormFieldSelect
