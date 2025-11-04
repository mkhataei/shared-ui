import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import clsx from 'clsx'
import { Controller, useFormContext } from 'react-hook-form'

function FormFieldRadioGroup({ name, label, className, values, inline = false, ...otherProps }) {
  const { formState, control } = useFormContext()
  const { errors } = formState

  return (
    <FormControl
      error={!!errors[name]}
      className={clsx(className, { 'flex flex-row items-center gap-24': inline })}
    >
      <FormLabel id={name} className={clsx({ 'mb-16': !inline })}>
        {label}
      </FormLabel>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <div className={clsx({ 'flex items-center gap-8': inline })}>
              {values.map((value) => {
                return (
                  <div key={value.value} className={clsx({ 'mb-16': !inline })}>
                    <FormControlLabel
                      value={value.value}
                      control={<Radio />}
                      disabled={value.disabled}
                      label={value.label || value.name}
                    />
                    {value.desc && (
                      <Typography
                        className='mr-28 text-sm'
                        sx={{
                          color: (theme) =>
                            value.disabled
                              ? theme.palette.text.disabled
                              : theme.palette.text.secondary,
                        }}
                        disabled={value.disabled}
                      >
                        {value.desc}
                      </Typography>
                    )}
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        )}
      />

      {!!errors[name] && <p className='text-red-500'>{errors[name]?.message}</p>}
    </FormControl>
  )
}

export default FormFieldRadioGroup
