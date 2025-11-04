import QuestionBox from './QuestionBox'

function LocationField({ question, error, formState, setFormState }) {
  return (
    <QuestionBox question={question} error={error} showLabel>
      LOCATION
    </QuestionBox>
  )
}

export default LocationField
