import AdapterJalaali from '@date-io/jalaali'
import { TextField } from '@mui/material'
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers'
import { faIR } from '@mui/x-date-pickers/locales'
import * as moment from 'moment-jalaali'
import QuestionBox from './QuestionBox'

function TimePickerField({ formState, question, error, setFormState }) {
  const currentTime = formState.find((fs) => fs.tag === question.tag)?.value
  // console.log('currentTime', currentTime)

  let value = moment()
  if (currentTime) {
    value = moment.utc(moment.duration(+currentTime, 'minutes').asMilliseconds())
  }

  return (
    <QuestionBox question={question} error={error}>
      <LocalizationProvider
        dateAdapter={AdapterJalaali}
        localeText={faIR.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <MobileTimePicker
          id={question.tag}
          ampm={false}
          value={value}
          onChange={(newValue) => {
            // console.log('time', moment.duration(newValue.format('HH:mm')).asMinutes())
            return setFormState(
              question.tag,
              moment.duration(newValue.format('HH:mm')).asMinutes().toString()
            )
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>
    </QuestionBox>
  )
}

export default TimePickerField
