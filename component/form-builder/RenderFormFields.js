import Constants from '@shared/fuse/constants'
import CascadeField from './fields/CascadeField'
import DatePickerField from './fields/DatePickerField'
import DivisionField from './fields/DivisionField'
import EditTextField from './fields/EditTextField'
import FileField from './fields/FileField'
import HeaderField from './fields/HeaderField'
import LocationField from './fields/LocationField'
import NoteField from './fields/NoteField'
import PhotoField from './fields/PhotoField'
import PickerMultiField from './fields/PickerMultiField'
import PickerSingleField from './fields/PickerSingleField'
import SwitchField from './fields/SwitchField'
import TableField from './fields/TableField'
import TimePickerField from './fields/TimePickerField'

function RenderFormFields({
  question,
  formState,
  setFormState,
  error,
  options,
  files,
  setFiles,
  disablePortal,
}) {
  if (question.forAdmin && !options.canEditAdminFields) return null

  switch (question.type) {
    case Constants.FormTypes.HEADER:
    case Constants.FormTypesKeys[Constants.FormTypes.HEADER]:
      return <HeaderField question={question} />
    case Constants.FormTypes.EDITTEXT_TEXT_SINGLELINE:
    case Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_TEXT_SINGLELINE]:
    case Constants.FormTypes.EDITTEXT_TEXT_MULTILINE:
    case Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_TEXT_MULTILINE]:
    case Constants.FormTypes.EDITTEXT_EMAIL:
    case Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_EMAIL]:
    case Constants.FormTypes.EDITTEXT_PASSWORD:
    case Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_PASSWORD]:
    case Constants.FormTypes.EDITTEXT_NUMBER:
    case Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_NUMBER]:
    case Constants.FormTypes.EDITTEXT_PHONE:
    case Constants.FormTypesKeys[Constants.FormTypes.EDITTEXT_PHONE]: {
      return (
        <EditTextField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    }
    case Constants.FormTypes.PICKER_DATE:
    case Constants.FormTypesKeys[Constants.FormTypes.PICKER_DATE]: {
      return (
        <DatePickerField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
          disablePortal={disablePortal}
        />
      )
    }
    case Constants.FormTypes.PICKER_TIME:
    case Constants.FormTypesKeys[Constants.FormTypes.PICKER_TIME]:
      return (
        <TimePickerField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.PICKER_SINGLE:
    case Constants.FormTypesKeys[Constants.FormTypes.PICKER_SINGLE]:
      return (
        <PickerSingleField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.PICKER_MULTI:
    case Constants.FormTypesKeys[Constants.FormTypes.PICKER_MULTI]:
      return (
        <PickerMultiField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.SWITCH:
    case Constants.FormTypesKeys[Constants.FormTypes.SWITCH]:
      return (
        <SwitchField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.LOCATION:
    case Constants.FormTypesKeys[Constants.FormTypes.LOCATION]:
      return (
        <LocationField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.FILE:
    case Constants.FormTypesKeys[Constants.FormTypes.FILE]:
      return (
        <FileField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
          files={files}
          setFiles={setFiles}
        />
      )
    case Constants.FormTypes.PHOTO:
    case Constants.FormTypesKeys[Constants.FormTypes.PHOTO]:
      return (
        <PhotoField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
          files={files}
          setFiles={setFiles}
        />
      )
    case Constants.FormTypes.NOTE:
    case Constants.FormTypesKeys[Constants.FormTypes.NOTE]:
      return (
        <NoteField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.TABLE:
    case Constants.FormTypesKeys[Constants.FormTypes.TABLE]:
      return (
        <TableField
          question={question}
          error={error}
          // value={formState.find((fs) => fs.tag === question.tag)?.value || '[]'}
          // onChange={(tableState) => setFormState(question.tag, tableState)}
          formState={formState}
          setFormState={setFormState}
          files={files}
          setFiles={setFiles}
        />
      )
    case Constants.FormTypes.COUNTRY_DIVISION:
    case Constants.FormTypesKeys[Constants.FormTypes.COUNTRY_DIVISION]:
      return (
        <DivisionField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    case Constants.FormTypes.CASCADE:
    case Constants.FormTypesKeys[Constants.FormTypes.CASCADE]:
      return (
        <CascadeField
          question={question}
          error={error}
          formState={formState}
          setFormState={setFormState}
        />
      )
    default:
      return null
  }
}

export default RenderFormFields
