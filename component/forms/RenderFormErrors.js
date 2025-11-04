function RenderFormErrors({ formErrors }) {
  if (!formErrors) return null

  return (
    <div className='text-red-500 mb-24'>
      {formErrors.map((err, index) => (
        <p key={index}>{err}</p>
      ))}
    </div>
  )
}

export default RenderFormErrors
