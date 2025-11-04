import { LoadingButton } from '@mui/lab'
import _ from '@shared/lodash/'
import { useFormContext } from 'react-hook-form'

function SubmitButton({
  title,
  className,
  loading,
  color,
  disabled,
  hasDirtyFields,
  checkDirtyFields = true,
  Icon,
}) {
  const { formState } = useFormContext()
  const { isValid, dirtyFields } = formState

  // console.log('_.isEmpty(dirtyFields)', _.isEmpty(dirtyFields))
  // console.log('!isValid', !isValid)
  // console.log('!_.isUndefined(disabled) && !!disabled', !_.isUndefined(disabled) && !!disabled)
  const theDirtyFields = dirtyFields
  if (hasDirtyFields) {
    theDirtyFields.aDirtyField = ''
  }

  const isNotFieldsDirty = checkDirtyFields && _.isEmpty(theDirtyFields)
  const isNotFieldsValid = !isValid
  const isManuallyDisabled = !_.isUndefined(disabled) && !!disabled

  // console.log('isNotFieldsDirty', isNotFieldsDirty)
  // console.log('isNotFieldsValid', isNotFieldsValid)
  // console.log('isManuallyDisabled', isManuallyDisabled)

  return (
    <LoadingButton
      color={color || 'primary'}
      className={className}
      aria-label={title}
      loading={loading}
      disabled={isNotFieldsDirty || isNotFieldsValid || isManuallyDisabled}
      // disabled={_.isEmpty(dirtyFields) || !isValid || (!_.isUndefined(disabled) && !!disabled)}
      variant='contained'
      type='submit'
      loadingPosition={Icon ? 'end' : 'center'}
      endIcon={Icon || null}
    >
      <span>{title}</span>
    </LoadingButton>
  )
}

export default SubmitButton
