import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IconButton, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { useState } from 'react'
import CustomCardTitleBar from './CustomCardTitleBar'
import SectionLoading from './SectionLoading'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const CustomCard = (props) => {
  const { title, actions, isLoading, children, className, paperClassName, expandable, outsideTitle, ...rest } =
    props

  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={clsx('w-full', className)}>
      {outsideTitle && <CustomCardTitleBar title={title} actions={actions} />}
      <Paper
        {...rest}
        className={clsx(
          `flex flex-col flex-auto relative shadow rounded-2xl overflow-hidden`,
          expanded && 'pb-48',
          paperClassName
        )}
        style={{
          maxHeight: expandable && !expanded ? '300px' : 'none',
        }}
      >
        {!outsideTitle && <CustomCardTitleBar title={title} actions={actions} />}

        {expandable && (
          <div
            className={clsx(
              'absolute left-0 right-0 bottom-0 z-10 bg-gradient-to-t from-white via-white to-transparent flex justify-center items-end pb-8',
              expanded ? 'h-64' : 'h-96'
            )}
          >
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </div>
        )}

        <div
          className={clsx(
            'w-full p-16 sm:p-24',
            (!title || outsideTitle) && 'pt-16'
          )}
        >
          {isLoading ? <SectionLoading /> : children}
        </div>
      </Paper>
    </div>
  )
}

export default CustomCard
