import { Button } from '@mui/material'
import { useState } from 'react'

function ExpandableItem({ children }) {
  const [expanded, setExpanded] = useState(false)
  const TEXT_CHAR_LIMIT = 50

  if (!children) return null

  if (children.length < TEXT_CHAR_LIMIT) return children

  if (expanded) {
    return (
      <>
        {children}
        <p className='text-nesha-500'>
          <Button
            className='cursor-pointer'
            onClick={(e) => {
              setExpanded(false)
            }}
          >
            جمع شدن ...
          </Button>
        </p>
      </>
    )
  }
  return (
    <>
      {children.substring(0, TEXT_CHAR_LIMIT)}
      <p className='text-nesha-500'>
        <Button
          className='cursor-pointer'
          onClick={(e) => {
            setExpanded(true)
          }}
        >
          بیشتر ...
        </Button>
      </p>
    </>
  )
}

export default ExpandableItem
