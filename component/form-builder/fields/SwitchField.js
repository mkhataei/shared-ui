import { FormControl, MenuItem, Select } from '@mui/material'
import QuestionBox from './QuestionBox'

function SwitchField({ formState, question, error, setFormState }) {
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
          // label={question.title}
          onChange={(e) => setFormState(question.tag, e.target.value)}
        >
          <MenuItem value={question.positiveText || 'بله'}>
            {question.positiveText || 'بله'}
          </MenuItem>
          <MenuItem value={question.negativeText || 'خیر'}>
            {question.negativeText || 'خیر'}
          </MenuItem>
        </Select>
      </FormControl>
    </QuestionBox>
  )
}

export default SwitchField
