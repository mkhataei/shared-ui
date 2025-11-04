import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import QuestionBox from './QuestionBox'

const CascadeField = ({ formState, question, error, setFormState }) => {
  // console.log('question', question)

  const [cascadeLevels, setCascadeLevels] = useState(null)
  const [selectedValues, setSelectedValues] = useState([])
  const [requestError, setRequestError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cascadeCurrentValue = formState.find((fs) => fs.tag === question.tag)
    if (cascadeCurrentValue) {
      setSelectedValues(cascadeCurrentValue.value?.replace('[', '').replace(']', '').split(',').map(it => it.trim()))
    }
  }, [formState, question.tag])

  useEffect(() => {
    setLoading(true)
    axios({
      method: 'GET',
      url: question.ext.fetchURL,
      headers: {
        'x-all': false
      }
    })
      .then((resp) => {
        setLoading(false)

        const levelsValue = JSON.parse(question.ext.cascadeLevels)
        let prevStageIds = null
        setCascadeLevels(
          levelsValue.map((lv) => {
            lv.items = resp.data.filter((d) => {
              if (!prevStageIds) {
                return !d.parent_id
              }
              return prevStageIds.includes(d.parent_id)
            })
            prevStageIds = lv.items.map((l) => l.id)

            return lv
          })
        )
      })
      .catch((e) => {
        setLoading(false)
        setRequestError('دریافت داده ها با خطا روبرو شد.')
      })
  }, [question.ext])

  const changeInput = (value, index) => {
    setRequestError(null)

    const cloneValues = [...selectedValues]
    if (cloneValues.length > index) {
      cloneValues[index] = value
      cloneValues.splice(index + 1)
    } else {
      cloneValues.push(value)
    }

    // console.log('selectedValues', cloneValues)
    setSelectedValues(cloneValues)

    if (cloneValues.length < cascadeLevels.length) {
      setRequestError(`لطفاً ${cascadeLevels[cloneValues.length].name} را انتخاب نمایید.`)
    }
    if (cloneValues.length === cascadeLevels.length) {
      setFormState(question.tag, `[${cloneValues.join(', ')}]`)
    }
  }

  // console.log('cascadeLevels', cascadeLevels)

  return (
    <QuestionBox question={question} error={error}>
      {loading && <p>در حال بارگذاری ...</p>}

      {!loading &&
        cascadeLevels?.length > 0 &&
        cascadeLevels.map((level, index) => {
          return (
            <div className='mb-4' key={index}>
              <FormControl fullWidth>
                <InputLabel id={`${level.name}_label`}>{level.name}</InputLabel>
                <Select
                  labelId={`${level.name}_label`}
                  value={selectedValues.length > index ? selectedValues[index] : ''}
                  label={level.name}
                  onChange={(e) => changeInput(e.target.value, index)}
                  disabled={selectedValues.length < index}
                >
                  {level.items
                    .filter((item) => {
                      const selected =
                        selectedValues.length > index - 1 ? selectedValues[index - 1] : null

                      if (selected) {
                        return item.parent_id.toString() === selected.toString()
                      }
                      return true
                    })
                    .map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      )
                    })}
                </Select>
              </FormControl>
            </div>
          )
        })}

      {requestError && <div className='mt-4 mb-8 text-red-500'>{requestError}</div>}
    </QuestionBox>
  )
}

export default CascadeField
