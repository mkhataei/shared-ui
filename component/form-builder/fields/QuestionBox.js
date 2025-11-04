function QuestionBox({ question, children, error, showLabel = true }) {
  return (
    <div className='mb-24'>
      {showLabel && (
        <div className='mb-12'>
          {question?.title} <span className='text-red-500'>{question?.required ? '*' : ''}</span>
          {question?.description && <p>{question.description}</p>}
        </div>
      )}

      {children}

      {error && <div className='mt-8 text-red-500'>{error}</div>}
    </div>
  )
}

export default QuestionBox
