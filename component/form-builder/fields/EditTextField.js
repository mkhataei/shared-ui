import { FormControl, TextField } from '@mui/material'
import Constants from '@shared/fuse/constants/Constants'
import QuestionBox from './QuestionBox'

function EditTextField({ formState, question, error, setFormState }) {
  const multiline =
    question.type === Constants.FormTypes.EDITTEXT_TEXT_MULTILINE ||
    question.type === Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_TEXT_MULTILINE]

  let type = 'text'
  if (
    question.type === Constants.FormTypes.EDITTEXT_EMAIL ||
    question.type === Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_EMAIL]
  ) {
    type = 'email'
  } else if (
    question.type === Constants.FormTypes.EDITTEXT_PASSWORD ||
    question.type === Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_PASSWORD]
  ) {
    type = 'password'
  } else if (
    question.type === Constants.FormTypes.EDITTEXT_NUMBER ||
    question.type === Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_NUMBER]
  ) {
    type = 'number'
  } else if (
    question.type === Constants.FormTypes.EDITTEXT_PHONE ||
    question.type === Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_PHONE]
  ) {
    type = 'number'
  }

  return (
    <QuestionBox question={question} error={error}>
      <FormControl fullWidth>
        <TextField
          id={question.tag}
          // label={`${question.title} ${question?.required ? '*' : ''}`}
          variant='outlined'
          value={formState.find((fs) => fs.tag === question.tag)?.value || ''}
          onChange={(e) => setFormState(question.tag, e.target.value)}
          multiline={multiline}
          rows={multiline ? 4 : 1}
          type={type}
          disabled={question.readOnly}
          InputProps={{
            sx: type === 'number' ? {
              '& input::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            } : undefined,
          }}
          onWheel={(e) => e.target.blur()}
        />
      </FormControl>
    </QuestionBox>
  )
}

export default EditTextField
