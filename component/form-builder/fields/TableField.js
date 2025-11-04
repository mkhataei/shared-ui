import { Delete, Edit } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import CustomDialogTitle from '@shared/component/CustomDialogTitle'
import ExpandableItem from '@shared/component/ExpandableItem'
import Constants from '@shared/fuse/constants/Constants'
import * as moment from 'moment-jalaali'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import DatePickerField from './DatePickerField'
import DivisionField from './DivisionField'
import EditTextField from './EditTextField'
import FileField from './FileField'
import HeaderField from './HeaderField'
import LocationField from './LocationField'
import NoteField from './NoteField'
import PhotoField from './PhotoField'
import PickerMultiField from './PickerMultiField'
import PickerSingleField from './PickerSingleField'
import QuestionBox from './QuestionBox'
import SwitchField from './SwitchField'
import TimePickerField from './TimePickerField'

function TableField({ question, error, formState, setFormState, files, setFiles }) {
  // console.log('question', question)

  const [questionState, setQuestionState] = useState(question)
  const [selectedItemIndex, setSelectedItemIndex] = useState(null)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setQuestionState((old) => {
      const q = { ...old }
      q.value = formState.find((fs) => fs.tag === question.tag)?.value || '[]'
      return q
    })
    // console.log('questionState', questionState)
  }, [formState, question])

  let currentItems = JSON.parse(questionState.value || '[]')
  if (typeof currentItems === 'number') {
    currentItems = []
  }
  return (
    <QuestionBox question={question} error={error} showLabel>
      {question.hint && <p>{question.hint}</p>}

      <RenderTable
        element={questionState}
        onDelete={(index) => {
          currentItems.splice(index, 1)
          setFormState(question.tag, JSON.stringify(currentItems))
        }}
        onEdit={(index) => {
          // console.log('index', index)

          setSelectedItemIndex(index)
          setOpen(true)
        }}
      />

      <div className='text-center mt-4'>
        <Button
          variant='outlined'
          onClick={() => {
            setOpen(true)
          }}
        >
          افزودن
        </Button>
      </div>

      <TableDialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        currentItems={currentItems}
        selectedItemIndex={selectedItemIndex}
        fields={JSON.parse(question.schema)}
        files={files}
        setFiles={setFiles}
        onSubmit={(state) => {
          // console.log('state', state)

          let items = []
          if (selectedItemIndex != null) {
            currentItems.splice(selectedItemIndex, 1, state)
            items = currentItems
            // items = currentItems.map((ci) =>
            //   ci.toString() === selectedItemIndex.toString() ? state : ci
            // )
          } else {
            currentItems.push(state)
            items = currentItems
          }
          setFormState(question.tag, JSON.stringify(items))
          setOpen(false)

          setSelectedItemIndex(null)
          return true
        }}
      />
    </QuestionBox>
  )
}

const RenderTable = ({ element, onDelete, onEdit }) => {
  // console.log('element', element)
  const schema = JSON.parse(element.schema)
  const tableRows = (element.value && JSON.parse(element.value)) || []

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow hover>
              {schema?.map((col, index) => (
                <TableCell key={index}>{col.title}</TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.length > 0 &&
              tableRows.map((row, index) => {
                if (!row) return null
                return (
                  <TableRow key={index} hover>
                    {schema &&
                      schema.map((column) => {
                        const foundCol = row.find((col) => col.tag === column.tag)
                        let foundColValue = foundCol?.value || '-'
                        if (column.type === Constants.FormTypes.PICKER_DATE) {
                          foundColValue = foundCol?.value
                            ? moment(+foundCol.value).format('jYYYY/jMM/jDD')
                            : '-'
                        }

                        return (
                          <TableCell key={uuid()}>
                            <ExpandableItem>{foundColValue}</ExpandableItem>
                          </TableCell>
                        )
                      })}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Tooltip title='ویرایش'>
                          <IconButton aria-label='ویرایش' onClick={() => onEdit(index)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='حذف'>
                          <IconButton aria-label='حذف' onClick={() => onDelete(index)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
            {tableRows.length === 0 && (
              <TableRow hover>
                <TableCell
                  colSpan={10}
                  style={{
                    height: '50px',
                    textAlign: 'center',
                  }}
                >
                  هیچ داده‌ای وجود ندارد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const TableDialog = ({
  open,
  onClose,
  fields,
  onSubmit,
  currentItems,
  selectedItemIndex,
  files,
  setFiles,
}) => {
  const [errors, setErrors] = useState(null)
  const [formState, setFormState] = useState([])

  useEffect(() => {
    if (currentItems?.length > selectedItemIndex - 1)
      setFormState(currentItems[selectedItemIndex] || [])
  }, [currentItems, selectedItemIndex])

  const setFormStateByTag = useCallback(
    (tag, value) => {
      if (errors && errors.find((e) => e.tag === tag)) {
        setErrors((old) => old.filter((e) => e.tag !== tag))
      }

      if (value === undefined || value === null) {
        setFormState(formState.filter((s) => s.tag !== tag))
        return
      }

      setFormState((old) => {
        const items = [...old]
        const existed = items.find((o) => o.tag === tag)
        if (existed) {
          existed.value = value
        } else {
          items.push({ tag, value })
        }
        return items
      })
    },
    [errors, formState]
  )

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // return console.log('formState', formState)

    const fieldErrors = []
    // eslint-disable-next-line no-restricted-syntax
    for (const field of fields) {
      const fieldSchema = formState.find((fs) => fs.tag === field.tag)
      if (field.required && (!fieldSchema || !fieldSchema?.value)) {
        fieldErrors.push({
          tag: field.tag,
          value: 'تکمیل این فیلد اجباری است.',
        })
      }
    }

    // console.log('fieldErrors', fieldErrors)

    if (fieldErrors.length > 0) {
      setErrors(fieldErrors)
      return
    }

    setErrors(null)

    // return console.log('onSubmit', onSubmit)
    if (onSubmit) {
      const result = await onSubmit(formState)
      if (result) {
        setFormState([])
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <CustomDialogTitle title='سطر جدید' onClose={onClose} />

      <DialogContent>
        <div>
          {fields.length === 0 && (
            <div className='h-48 flex justify-center items-center'>
              <CircularProgress />
            </div>
          )}

          <div className='relative'>
            {fields?.map((item) => {
              return (
                <div key={item.tag}>
                  <RenderTableFields
                    error={errors && errors.find((i) => i.tag === item.tag)?.value}
                    question={item}
                    formState={formState}
                    setFormState={setFormStateByTag}
                    files={files}
                    setFiles={setFiles}
                  />
                </div>
              )
            })}
          </div>

          {errors?.length > 0 && (
            <div className='mb-8 text-red-500'>
              <p>
                داده بعضی از فیلدهای این فرم نامعتبر است. لطفا مجددا داده های ورودی را بررسی و نسبت
                به ارسال فرم اقدام نمایید.
              </p>
            </div>
          )}

          {fields.length > 0 && (
            <div className='flex gap-4 justify-center'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                sx={{ minWidth: '150px' }}
                onClick={handleFormSubmit}
              >
                ذخیره
              </Button>
              <Button variant='outlined' onClick={onClose} sx={{ minWidth: '150px' }}>
                انصراف
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RenderTableFields({ question, formState, setFormState, error, files, setFiles }) {
  if (question.forAdmin) return null

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
    default:
      return null
  }
}

export default TableField
