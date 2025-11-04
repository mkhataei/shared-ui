import {
  Checkbox,
  Chip,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import { Box } from '@mui/system'
import QuestionBox from './QuestionBox'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function PickerMultiField({ formState, question, error, setFormState }) {
  return (
    <QuestionBox question={question} error={error}>
      <FormControl fullWidth>
        {/* <InputLabel id={`${question.tag}_label`}>{`${question.title} ${
              question?.required ? '*' : ''
            }`}</InputLabel> */}
        <Select
          // labelId={question.tag}
          id={question.tag}
          multiple
          value={formState?.find((fs) => fs.tag === question.tag)?.value?.split(', ') || []}
          onChange={(event) => {
            const {
              target: { value },
            } = event
            const items = typeof value === 'string' ? value.split(',') : value.toString()
            setFormState(question.tag, items.split(',').join(', '))
          }}
          input={<OutlinedInput label={question.title} />}
          renderValue={(selected) => {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip sx={{ fontFamily: 'inherit' }} key={value} label={value} />
                ))}
              </Box>
            )
          }}
          MenuProps={MenuProps}
        >
          {question.options.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox
                checked={
                  formState?.find((fs) => fs.tag === question.tag)?.value?.includes(name) || false
                }
              />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </QuestionBox>
  )
}

export default PickerMultiField
