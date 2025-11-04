import { Chip, Typography } from '@mui/material'
import clsx from 'clsx'
import { useDropzone } from 'react-dropzone'
import { Controller, useFormContext } from 'react-hook-form'

function FormFieldDropzone({ name, subtitle, label, className = '', multiple, accept, required, ...rest }) {
  const { control, setValue, watch } = useFormContext()
  const selectedFiles = watch(name)

  return (
    <div className={className}>
      <Typography className='mb-4'>{`${label}${required ? '*' : ''}`}</Typography>
      {subtitle && <p className='text-sm mb-4'>{subtitle}</p>}

      <Controller
        render={({ field: { value, onChange } }) => (
          <Dropzone
            multiple={multiple}
            selectedFiles={selectedFiles}
            accept={accept}
            onDrop={(acceptedFiles) => {
              let files = acceptedFiles

              if (multiple) {
                const currentFileNames = selectedFiles ? selectedFiles?.map((sf) => sf.name) : []
                const filteredFiles = acceptedFiles.filter(
                  (af) => !currentFileNames.includes(af.name)
                )
                files = [...selectedFiles, ...filteredFiles]
              }

              onChange(files)
            }}
            {...rest}
          />
        )}
        name={name}
        control={control}
      />

      {!!selectedFiles && (
        <div className='flex gap-4 items-center flex-wrap'>
          {selectedFiles.map((file, index) => {
            return (
              <Chip
                key={index}
                label={file.name}
                onDelete={() => {
                  const files = selectedFiles.filter((item) => item.name !== file.name)
                  setValue(name, files, { shouldValidate: true, shouldDirty: true })
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

const Dropzone = ({ multiple, selectedFiles, ...rest }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    ...rest,
  })

  if (!multiple && !!selectedFiles && selectedFiles?.length > 0) {
    return null
  }

  return (
    <div
      {...getRootProps()}
      className={clsx(
        multiple && selectedFiles?.length > 0 && 'mb-4',
        'border cursor-pointer p-16 rounded-lg h-[100px] flex items-center justify-center'
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>فایل را اینجا رها کنید...</p>
      ) : (
        <p>جهت بارگذاری، فایل را اینجا بکشید و رها کنید یا بروی این قسمت کلیک کنید.</p>
      )}
    </div>
  )
}

export default FormFieldDropzone
