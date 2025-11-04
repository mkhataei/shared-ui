import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormFieldLogger from './FormFieldLogger'

function Form({ className, defaultValues, debug, onSubmit, schema, children, setValues }) {
  const methods = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  })

  const { setValue, handleSubmit } = methods

  useEffect(() => {
    if (setValues && setValue) setValues(setValue)
  }, [setValues])

  return (
    <FormProvider {...methods}>
      <form noValidate className={className} onSubmit={handleSubmit(onSubmit)}>
        {debug && <FormFieldLogger />}
        {children}
      </form>
    </FormProvider>
  )
}

export default Form
