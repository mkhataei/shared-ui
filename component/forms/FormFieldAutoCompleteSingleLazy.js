import { Autocomplete, Box, TextField } from '@mui/material'
import { forwardRef, useCallback, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

function FormFieldAutoCompleteSingleLazy({
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
              const isLastItem = isOptionEqualToValue(option, options[options.length - 1])
              return (
                <AutocompleteRenderOptionComponent
                  {...props}
                  isLastItem={isLastItem}
                  showLoadingBelow={loading}
                  optionLabel={getOptiontitle(option)}
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
  ({ optionLabel, index, showLoadingBelow, isLastItem, hasMore, ...props }, ref) => {
    return (
      <>
        <Box ref={ref} {...props}>
          {optionLabel}
        </Box>
        {isLastItem && showLoadingBelow && hasMore && <>در حال بارگذاری ...</>}
        {isLastItem && !hasMore && <span className='pr-16'>-- انتها --</span>}
      </>
    )
  }
)

export default FormFieldAutoCompleteSingleLazy
