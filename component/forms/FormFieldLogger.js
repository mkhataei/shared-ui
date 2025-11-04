import { Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'

function FormFieldLogger() {
  const { getValues } = useFormContext()
  return (
    <Button className='mb-24' onClick={() => console.log(getValues())}>
      Log Values
    </Button>
  )
}

export default FormFieldLogger
