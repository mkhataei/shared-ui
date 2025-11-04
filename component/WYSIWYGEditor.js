import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { convertToRaw, EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import draftToHtml from 'draftjs-to-html'
import { forwardRef, useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const Root = styled('div')({
  '& .rdw-dropdown-selectedtext': {
    color: 'inherit',
  },
  '& .rdw-editor-toolbar': {
    borderWidth: '0 0 1px 0!important',
    margin: '0!important',
  },
  '& .rdw-editor-main': {
    padding: '8px 12px',
    height: `${256}px!important`,
  },
})

const WYSIWYGEditor = forwardRef(({ onChange, className, value }, ref) => {
  const [editorState, setEditorState] = useState(
    value ? EditorState.createWithContent(stateFromHTML(value)) : EditorState.createEmpty()
  )

  useEffect(() => {
    if (value === undefined || value === null) {
      const hasText = editorState.getCurrentContent().hasText()
      if (hasText) {
        setEditorState(EditorState.createEmpty())
      }
      return
    }

    const currentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if (value && value.trim() === currentHtml.trim()) {
      return
    }

    const nextState = value
      ? EditorState.createWithContent(stateFromHTML(value))
      : EditorState.createEmpty()

    setEditorState(nextState)
  }, [value, editorState])

  function onEditorStateChange(_editorState) {
    setEditorState(_editorState)

    return onChange(draftToHtml(convertToRaw(_editorState.getCurrentContent())))
  }

  return (
    <Root className={clsx('rounded-4 border-1 overflow-hidden w-full', className)} ref={ref}>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        textAlignment='right'
      />
    </Root>
  )
})

export default WYSIWYGEditor
