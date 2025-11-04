import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

function FormFieldAutoCompleteMultipleCheckbox({
  name,
  label,
  options,
  className,
  disabled = false,
  loading = false,
  getOptionLabel = (option) => option.name || option.label || '',
  isOptionEqualToValue = (option, item) => {
    let result = false
    if (option.name) result = option.name === item.name
    else if (option.label) result = option.label === item.label
    return result
  },
  onInputChange,
}) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <Autocomplete
            multiple
            loading={loading}
            options={options}
            value={value}
            onChange={(event, item) => {
              onChange(item)
            }}
            disableCloseOnSelect
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            renderOption={(props, option, state) => {
              return (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={state.selected}
                  />
                  {getOptionLabel(option)}
                </li>
              )
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

export default FormFieldAutoCompleteMultipleCheckbox
