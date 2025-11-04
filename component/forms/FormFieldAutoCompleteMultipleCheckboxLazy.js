import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material'
import { forwardRef, useCallback, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

function FormFieldAutoCompleteMultipleCheckboxLazy({
  name,
  label,
  options,
  className,
  disabled = false,
  loading = false,
  onChange,
  getOptionLabel = (option) => option.name || option.label || '',
  isOptionEqualToValue = (option, item) => option.name === item.name || option.label === item.label,
  onInputChange,
  onFetchMore,
  hasMore,
}) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  const observer = useRef()

  const lastOptionElementRef = useCallback(
    async (node) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          await onFetchMore()
        }
      })
      if (node) observer.current.observe(node)
    },
    [hasMore, onFetchMore]
  )

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onChangeReactHookForm, value, ...rest } }) => {
        return (
          <Autocomplete
            multiple
            loading={loading}
            options={options}
            value={value}
            onChange={(event, item) => {
              onChangeReactHookForm(item)
              if (onChange) onChange(event, item)
            }}
            disableCloseOnSelect
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            renderOption={(props, option, state) => {
              const isLastItem = isOptionEqualToValue(option, options[options.length - 1])
              return (
                <AutocompleteRenderOptionComponent
                  {...props}
                  isLastItem={isLastItem}
                  showLoadingBelow={loading}
                  optionLabel={getOptionLabel(option)}
                  checked={state.selected}
                  hasMore={hasMore}
                  ref={isLastItem ? lastOptionElementRef : null}
                />
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
            {...rest}
          />
        )
      }}
    />
  )
}

const AutocompleteRenderOptionComponent = forwardRef(
  ({ optionLabel, index, showLoadingBelow, isLastItem, hasMore, checked, ...props }, ref) => {
    return (
      <>
        <Box ref={ref} {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={checked}
          />
          {optionLabel}
        </Box>
        {isLastItem && showLoadingBelow && hasMore && <>در حال بارگذاری ...</>}
        {isLastItem && !hasMore && <span className='pr-16'>-- انتها --</span>}
      </>
    )
  }
)

export default FormFieldAutoCompleteMultipleCheckboxLazy
