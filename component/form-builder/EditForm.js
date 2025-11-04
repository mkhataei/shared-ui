import { LoadingButton } from '@mui/lab'
import { Button, CircularProgress } from '@mui/material'
import Constants from '@shared/fuse/constants/Constants'
import GeneralUtils from '@shared/fuse/utils/GeneralUtils'
import axios from 'axios'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import RenderFormFields from './RenderFormFields'

function EditForm({ formId, fields, onSubmit, onCancel, className, options, onFormStateChanged, disablePortal }) {
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  const [formState, setFormState] = useState([])
  const [formfields, setFormFields] = useState(fields || [])
  const [currentFormFields, setCurrentFormFields] = useState([])
  const [submmiting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState(null)

  const setFormStateByTag = useCallback(
    (tag, value) => {
      // if (errors && errors.find((e) => e.tag === tag)) return

      if (value === undefined || value === null) {
        setFormState((old) => old.filter((s) => s.tag !== tag))
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
    [errors]
  )

  useEffect(() => {
    if (onFormStateChanged) onFormStateChanged(formState)
  }, [formState, onFormStateChanged])

  useEffect(() => {
    setFormFields(fields)

    const values = fields
      ?.filter((f) => Boolean(f.value))
      ?.map((f) => ({ tag: f.tag, value: f.value }))
    if (values) setFormState(values)

    // fields?.forEach((f) => {
    //   // console.log('f.tag', f.tag)
    //   // console.log('f.value', f.value)
    //   setFormStateByTag(f.tag, f.value)
    // })
  }, [fields])

  const generateFormFields = useCallback(
    (questions) => {
      const mustShowFields = []
      // eslint-disable-next-line no-restricted-syntax
      for (const question of questions) {
        let displayField = true
        if (question.displayConditions) {
          const displayConditions = JSON.parse(question.displayConditions)
          // console.log('displayConditions', displayConditions)

          // eslint-disable-next-line no-restricted-syntax
          for (const condition of displayConditions.conditions) {
            // console.log('condition', condition)

            if (condition.operator === 'EQUAL') {
              const field = formState.find((fs) => fs.tag === condition.fieldTag)
              // console.log('field', field)

              if (!field) {
                displayField = false
              } else if (field.value !== condition.constant) {
                displayField = false
              }
            }
          }
          if (displayField) mustShowFields.push(question)
        } else {
          mustShowFields.push(question)
        }
      }

      setCurrentFormFields(mustShowFields)
    },
    [formState]
  )

  useEffect(() => {
    if (formfields) generateFormFields(formfields)
  }, [formfields, generateFormFields])

  const uploadFile = async (file, onSuccess, onFail, onUploadProgress) => {
    if (!file) {
      onFail()
      return
    }

    const data = new FormData()
    data.append('file', file)

    try {
      const result = await axios({
        method: 'post',
        url: `/file/upload`,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // console.log('percent', percent)

          if (onUploadProgress) {
            onUploadProgress(percent >= 100 ? 100 : percent)
          }
        },
      })
      onSuccess(result.data)
    } catch (e) {
      console.log('e', e)
      if (onFail) {
        onFail(e.response)
      }
    }
  }

  useEffect(() => {
    setUploadProgress(files.map((file) => ({ tag: file.tag, progress: 0 })))
  }, [files])

  // eslint-disable-next-line consistent-return
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const fieldErrors = []
    // eslint-disable-next-line no-restricted-syntax
    for (const field of currentFormFields) {
      const fieldSchema = formState.find((fs) => fs.tag === field.tag)
      if (field.type === Constants.FormTypes.FILE || field.type === Constants.FormTypes.PHOTO) {
        if (field.required) {
          const valueInFormState = fieldSchema
          const valueInFiles = files.find((file) => file.tag === field.tag)
          if (!valueInFormState && !valueInFiles) {
            fieldErrors.push({
              tag: field.tag,
              value: 'تکمیل این فیلد اجباری است.',
            })
          }
        }
      } else if (
        field.required &&
        (!fieldSchema || !fieldSchema?.value || fieldSchema?.value === '[]')
      ) {
        fieldErrors.push({
          tag: field.tag,
          value: 'تکمیل این فیلد اجباری است.',
        })
      }
    }

    // console.log('fieldErrors', fieldErrors)
    if (fieldErrors.length > 0) {
      return setErrors(fieldErrors)
    }

    // return console.log('formState', formState)

    setErrors(null)

    const formRandomId = generateRandomId()
    // console.log('formRandomId', formRandomId)

    if (files.length > 0) {
      setSubmitting(true)
      Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            uploadFile(
              file.file,
              (result) => {
                resolve({ tag: file.tag, result })
              },
              (err) => {
                reject(err)
              },
              (progress) => {
                // console.log('uploadProgress', uploadProgress)
                const items = [...uploadProgress]
                const item = items.find((i) => i.tag === file.tag)
                if (item) {
                  item.progress = progress
                  setUploadProgress(items)
                }
              }
            )
          })
        })
      )
        .then((uploadResults) => {
          // console.log('uploadResults', uploadResults)

          Promise.all(
            uploadResults.map(({ tag, result }) => {
              return new Promise((resolve, reject) => {
                axios({
                  method: 'POST',
                  url: `/file/send`,
                  data: {
                    peerType: 'GROUP',
                    peerId: formId,
                    peerRandomId: formRandomId,
                    fileId: result.id,
                    fileAccessHash: result.accessHash,
                    fileSize: result.size,
                    fileName: result.name,
                    mimeType: result.mimeType,
                  },
                })
                  .then((resp) => {
                    resolve({ tag, result: resp.data })
                  })
                  .catch((err) => {
                    reject(err)
                  })
              })
            })
          )
            .then(async (sentFilesResult) => {
              // console.log('sentFilesResult', sentFilesResult)

              // Use GeneralUtils.groupBy instead of Object.groupBy for compatibility
              const group = GeneralUtils.groupBy(sentFilesResult, ({ tag }) => tag)
              Object.keys(group).forEach(groupKey => {
                const value = group[groupKey]?.length > 1
                  ? `[${group[groupKey].map(it => it.result.randomId).join(",")}]`
                  : group[groupKey][0].result.randomId
                const existed = formState.find((o) => o.tag.toString() === groupKey.toString())
                if (existed) {
                  existed.value = value
                } else {
                  formState.push({
                    tag: groupKey.toString(),
                    value,
                  })
                }
              })

              // console.log('formState', formState)

              if (onSubmit) {
                const result = await onSubmit(formState, formRandomId)
                setSubmitting(false)

                if (result) {
                  setFormState([])
                }
              }
            })
            .catch((err) => {
              setSubmitting(false)

              throw err
            })
        })
        .catch((err) => {
          setSubmitting(false)

          throw err
        })
    } else if (onSubmit) {
      setSubmitting(true)
      try {
        const result = await onSubmit(formState, formRandomId)
        if (result) {
          setFormState([])
        }
      } catch (err) {
        console.log('err:', err)
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (!formfields || formfields.length === 0)
    return <div className='h-48 flex justify-center items-center'>هیچ فیلدی وجود ندارد.</div>

  return (
    <form onSubmit={handleFormSubmit} className={className}>
      {currentFormFields.length === 0 && (
        <div className='h-48 flex justify-center items-center'>
          <CircularProgress />
        </div>
      )}

      <div className='relative'>
        <div className={clsx('relative', submmiting && 'opacity-50')}>
          {currentFormFields.map((item) => {
            return (
              <div key={item.tag}>
                <RenderFormFields
                  error={errors && errors.find((i) => i.tag === item.tag)?.value}
                  question={item}
                  formState={formState}
                  setFormState={setFormStateByTag}
                  options={{
                    canEditAdminFields: !!options?.canEditAdminFields,
                  }}
                  files={files}
                  setFiles={setFiles}
                  disablePortal={disablePortal}
                />
              </div>
            )
          })}
        </div>
        {submmiting && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <CircularProgress />
          </div>
        )}
      </div>

      {errors?.length > 0 && (
        <div className='mb-16 text-red-500'>
          <p>
            داده بعضی از فیلدهای این فرم نامعتبر است. لطفا مجددا داده های ورودی را بررسی و نسبت به
            ارسال فرم اقدام نمایید.
          </p>
        </div>
      )}

      {currentFormFields.length > 0 && (
        <div className='flex gap-4 justify-center'>
          <LoadingButton
            loading={submmiting}
            type='submit'
            variant='contained'
            color='primary'
            sx={{ minWidth: '150px' }}
          >
            ذخیره
          </LoadingButton>
          {!submmiting && (

            <Button
              variant='outlined'
              onClick={() => onCancel && onCancel()}
              sx={{ minWidth: '150px' }}
            >
              انصراف
            </Button>
          )}
        </div>
      )}
    </form>
  )
}

const generateRandomId = () => {
  let formRandomId = ''
  for (let i = 0; i < 18; i += 1) formRandomId += Math.floor(Math.random() * 10)
  return formRandomId
}

export default EditForm
