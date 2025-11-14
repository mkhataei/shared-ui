import AdapterJalaali from '@date-io/jalaali'
import { FormControl, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import moment from 'moment-jalaali';
import QuestionBox from './QuestionBox'

function DatePickerField({ formState, question, error, setFormState, disablePortal }) {
  const currentDate = formState.find((fs) => fs.tag === question.tag)?.value
  const value = currentDate ? moment(+currentDate) : null

  return (
    <QuestionBox question={question} error={error}>
      <LocalizationProvider dateAdapter={AdapterJalaali}>
        <FormControl fullWidth>
          {/* <InputLabel id={`${question.tag}_label`}>{question.title}</InputLabel> */}
          <DatePicker
            // labelId={`${question.tag}_label`}
            id={question.tag}
            // label={question.title}
            mask='____/__/__'
            value={value}
            onChange={(newValue) => {
              // console.log('time', newValue.toDate().getTime().toString())
              return setFormState(question.tag, newValue?.toDate()?.getTime()?.toString())
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
            PopperProps={{ disablePortal }}
            DialogProps={{ disablePortal }}
          />
        </FormControl>
      </LocalizationProvider>
    </QuestionBox>
  )
}

export default DatePickerField
