import { Box, Button, Chip } from '@mui/material'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import QuestionBox from './QuestionBox'

function FileField({ question, error, formState, setFormState, files, setFiles }) {
  // console.log('question', question)

  const [currentFiles, setCurrentFiles] = useState([])

  const maxFileSize = +question?.ext?.maxFileCount || 1
  const allowedTypes =
    question?.ext?.allowedTypes
      ?.split(',')
      .map((item) => `.${item}`)
      .join(',') || '*/*'

  useEffect(() => {
    const values = formState
      ?.find((fs) => fs.tag === question.tag)
      ?.value?.replace('[', '')
      ?.replace(']', '')
      ?.split(', ')
    if (values) setCurrentFiles(values)
  }, [formState, question])

  function handleChange(evt) {
    // console.log('evt.target.files', evt.target.files)
    if (evt.target.files.length > 0)
      setFiles(
        Array.from(evt.target.files).map((f) => ({ id: uuid(), tag: question.tag, file: f }))
      )
  }

  function RenderFiles() {
    if (files.length === 0 && currentFiles.length === 0) return null

    return (
      <div className='flex gap-4 mt-4 flex-wrap'>
        {currentFiles.map((file, index) => {
          return (
            <Chip
              key={index}
              label={file}
              onDelete={() => {
                const values = formState
                  ?.find((fs) => fs.tag === question.tag)
                  ?.value?.replace('[', '')
                  ?.replace(']', '')
                  ?.split(', ')
                const filterValues = values.filter((v) => v !== file)
                const desiredValues =
                  maxFileSize === 1 ? filterValues.toString() : `[${filterValues.join(', ')}]`
                setFormState(question.tag, desiredValues)
              }}
            />
          )
        })}
        {files
          .filter((f) => f.tag === question.tag)
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((file, index) => {
            return (
              <ProgressChip
                key={index}
                label={`${file.file.name}`}
                onDelete={() => {
                  setFiles((old) => old.filter((item) => item !== file))
                }}
                progress={file.progress}
              />
            )
          })}
      </div>
    )
  }

  return (
    <QuestionBox question={question} error={error} showLabel>
      {question.hint && <p className='mb-2'>{question.hint}</p>}

      <Button variant='outlined' component='label'>
        انتخاب
        <input
          type='file'
          hidden
          multiple={maxFileSize > 1}
          onChange={handleChange}
          accept={allowedTypes}
        />
      </Button>

      <div className='mt-12'>
        <RenderFiles />
      </div>
    </QuestionBox>
  )
}

const ProgressChip = ({ label, progress, onDelete }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block', direction: 'rtl' }}>
      <Chip
        label={label}
        onDelete={onDelete} // Delete function
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pl: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0, // Ensures right-to-left filling
            height: '100%',
            width: `${progress}%`, // Dynamic progress fill
            backgroundColor: 'rgba(76, 175, 80, 0.5)', // Progress color
            zIndex: 0, // Behind text
          },
          '& .MuiChip-label, & .MuiChip-deleteIcon': {
            position: 'relative',
            zIndex: 1, // Keep text & delete icon on top,
            pl: 0,
          },
        }}
      />
    </Box>
  )
}

export default FileField
