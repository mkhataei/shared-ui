import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import QuestionBox from './QuestionBox'

const DivisionField = ({ formState, question, error, setFormState }) => {
  const [display, setDisplay] = useState({})
  const [provinces, setProvinces] = useState(null)
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [counties, setCounties] = useState(null)
  const [selectedCounty, setSelectedCounty] = useState(null)
  const [districtsOrCities, setDistrictsOrCities] = useState(null)
  const [selectedDistrictOrCities, setSelectedDistrictOrCities] = useState(null)
  const [villages, setVillages] = useState(null)
  const [isVillagesActive, setIsVillagesActive] = useState(false)
  const [selectedVillage, setSelectedVillage] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [requestError, setRequestError] = useState(null)

  useEffect(() => {
    if (question) {
      setDisplay(JSON.parse(question.display))
    }
  }, [question])

  useEffect(() => {
    setWaiting(true)
    axios({
      method: 'GET',
      url: `division?divisionType=Province`,
    })
      .then((resp) => {
        setProvinces(resp.data.items)
        // setSelectedProvince(resp.data.items[0].id)
        setWaiting(false)
      })
      .then((err) => {
        setWaiting(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedProvince) return
    axios({
      method: 'GET',
      url: `division?divisionType=County&parentId=${selectedProvince}`,
    })
      .then((resp) => {
        setCounties(resp.data.items)
        // setSelectedCounty(resp.data.items[0].id)
      })
      .catch((err) => { })
  }, [selectedProvince])

  useEffect(() => {
    if (!selectedCounty) return
    axios({
      method: 'GET',
      url: `division?divisionType=District&parentId=${selectedCounty}`,
    })
      .then((resp) => {
        const districts = resp.data.items

        if (display.city) {
          axios({
            method: 'GET',
            url: `division?divisionType=City&parentId=${selectedCounty}`,
          })
            .then((resp2) => {
              const cities = resp2.data.items

              setDistrictsOrCities([...districts, ...cities])
              // setSelectedDistrictOrCities(districts[0].id)
            })
            .catch((err) => { })
        } else {
          setDistrictsOrCities(districts)
          // setSelectedDistrictOrCities(districts[0].id)
        }
      })
      .catch((err) => { })
  }, [display, selectedCounty])

  useEffect(() => {
    if (!selectedDistrictOrCities) return

    setSelectedVillage(null)
    setVillages(null)
    setIsVillagesActive(false)

    const foundedDistrictsOrCities = districtsOrCities.find(
      (i) => i.id.toString() === selectedDistrictOrCities.toString()
    )

    if (foundedDistrictsOrCities && foundedDistrictsOrCities.type === 'District') {
      setIsVillagesActive(true)
      axios({
        method: 'GET',
        url: `division?divisionType=Village&parentId=${selectedDistrictOrCities}`,
      })
        .then((resp) => {
          setVillages(resp.data.items)
          // setSelectedVillage(resp.data.items[0].id)
        })
        .catch((err) => { })
    }
  }, [districtsOrCities, selectedDistrictOrCities])

  const changeInput = (value, id) => {
    setRequestError(null)

    if (id === 'province') setSelectedProvince(value)

    if (id === 'county') setSelectedCounty(value)

    if (id === 'district') setSelectedDistrictOrCities(value)

    if (id === 'village') setSelectedVillage(value)
  }

  useEffect(() => {
    const state = [103]

    if (!selectedProvince) return

    if (
      display.province ||
      display.township ||
      display.district ||
      display.city ||
      display.village
    ) {
      if (selectedProvince) {
        state.push(selectedProvince)
      } else {
        setRequestError('استان را انتخاب کنید.')
        return
      }
    }
    if (display.township || display.district || display.city || display.village) {
      if (selectedCounty) {
        state.push(selectedCounty)
      } else {
        setRequestError('شهرستان را انتخاب کنید.')
        return
      }
    }
    if (display.district || display.city) {
      if (selectedDistrictOrCities) {
        state.push(selectedDistrictOrCities)
      } else {
        setRequestError('شهر/دهستان را انتخاب کنید.')
        return
      }
    }
    if (display.village) {
      if (selectedVillage) {
        state.push(selectedVillage)
      } else {
        setRequestError('روستا را انتخاب کنید.')
        return
      }
    }

    // console.log('question.tag', question.tag)
    setFormState(question.tag, `[${state.join(',')}]`)
  }, [
    display,
    setFormState,
    question.tag,
    selectedProvince,
    selectedCounty,
    selectedDistrictOrCities,
    selectedVillage,
  ])

  return (
    <QuestionBox question={question} error={error}>
      {display.province && (
        <div className='mb-12'>
          <FormControl fullWidth>
            <InputLabel id={`${question.tag}_province_label`}>استان</InputLabel>
            <Select
              labelId={`${question.tag}_province_label`}
              value={selectedProvince || ''}
              label='استان'
              onChange={(e) => changeInput(e.target.value, 'province')}
            >
              {provinces &&
                provinces.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </div>
      )}

      {display.township && (
        <div className='mb-12'>
          <FormControl fullWidth>
            <InputLabel id={`${question.tag}_township_label`}>شهرستان</InputLabel>
            <Select
              labelId={`${question.tag}_township_label`}
              value={selectedCounty || ''}
              label='شهرستان'
              disabled={selectedProvince === null}
              onChange={(e) => changeInput(e.target.value, 'county')}
            >
              {counties &&
                counties.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </div>
      )}

      {(display.district || display.city) && (
        <div className='mb-12'>
          <FormControl fullWidth>
            <InputLabel id={`${question.tag}_district_label`}>شهر / دهستان</InputLabel>
            <Select
              labelId={`${question.tag}_district_label`}
              value={selectedDistrictOrCities || ''}
              label='شهر / دهستان'
              disabled={
                selectedProvince === null || selectedCounty === null || districtsOrCities === null
              }
              onChange={(e) => changeInput(e.target.value, 'district')}
            >
              {districtsOrCities &&
                districtsOrCities.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </div>
      )}

      {display.village && !display.city && (
        <div>
          <FormControl fullWidth>
            <InputLabel id={`${question.tag}_village_label`}>روستا</InputLabel>
            <Select
              labelId={`${question.tag}_village_label`}
              value={selectedVillage || ''}
              label='روستا'
              disabled={
                selectedProvince === null ||
                selectedCounty === null ||
                selectedDistrictOrCities === null ||
                villages === null ||
                !isVillagesActive
              }
              onChange={(e) => changeInput(e.target.value, 'village')}
            >
              {villages &&
                villages.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </div>
      )}

      {requestError && <div className='mt-8 text-red-500'>{requestError}</div>}
    </QuestionBox>
  )
}

export default DivisionField
