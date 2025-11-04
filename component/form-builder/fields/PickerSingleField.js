import { FormControl, MenuItem, Select } from '@mui/material'
import QuestionBox from './QuestionBox'

function PickerSingleField({ formState, question, error, setFormState }) {
  return (
    <QuestionBox question={question} error={error}>
      <FormControl fullWidth>
        {/* <InputLabel id={`${question.tag}_label`}>
              {question.title}
            </InputLabel> */}
        <Select
          // labelId={`${question.tag}_label`}
          id={question.tag}
          value={formState?.find((fs) => fs.tag === question.tag)?.value || ''}
          // label={`${question.title} ${question?.required ? '*' : ''}`}
          onChange={(e) => setFormState(question.tag, e.target.value)}
        >
          {question.options.map((option, index) => {
            return (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </QuestionBox>
  )
}

export default PickerSingleField
