import { Autocomplete, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

/**
 * default option format is like this
 * [{name: string}]
 */
function FormFieldAutoCompleteSingle({
  name,
  label,
  options,
  className,
  disabled = false,
  loading = false,
  onChange,
  isOptionEqualToValue = (option, item) => option.name === item.name || option.label === item.label,
  getOptiontitle = (option) => option.name || option.label || '',
  onInputChange,
  required = false,
}) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onChangeReactHookForm, value } }) => {
        return (
          <Autocomplete
            loading={loading}
            options={options}
            value={value}
            onChange={(event, item) => {
              onChangeReactHookForm(item)
              if (onChange) onChange(event, item)
            }}
            getOptionLabel={getOptiontitle}
            isOptionEqualToValue={isOptionEqualToValue}
            renderOption={(props, option, state) => {
              return <li {...props}>{getOptiontitle(option)}</li>
            }}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                className={className}
                label={label}
                error={!!errors[name]}
                helperText={errors[name]?.message}
                variant='outlined'
                fullWidth
                required={required}
              />
            )}
            noOptionsText='هیج داده‌ای وجود ندارد.'
            onInputChange={(event, newInputValue) => {
              if (onInputChange) onInputChange(event, newInputValue)
            }}
          />
        )
      }}
    />
  )
}

export default FormFieldAutoCompleteSingle
