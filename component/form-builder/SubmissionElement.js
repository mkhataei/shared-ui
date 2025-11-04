import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Constants from '@shared/fuse/constants/Constants'
import axios from 'axios'
import clsx from 'clsx'
import { Icon } from 'leaflet'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/leaflet.css'
import moment from 'moment-jalaali'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import ModalImage from 'react-modal-image'
import { v4 as uuid } from 'uuid'
import ExpandableItem from '../ExpandableItem'
import FileElement from './elements/FileElement'

const FORM_EMPTY_PLACEHOLDER = '-'

const SubmissionElement = ({ element, index, parents, hideMeta = false }) => {
  const [divisionObject, setDivisionObject] = useState(null)
  const [cascadeValue, setCascadeValue] = useState(null)

  useEffect(() => {
    if (element.value && element.type === Constants.FormTypes.COUNTRY_DIVISION) {
      const splited = element.value?.replace('[', '')?.replace(']', '')?.split(',')
      axios({
        method: 'GET',
        url: `division/${splited[splited.length - 1]}/detail`,
      })
        .then((resp) => {
          setDivisionObject(resp.data)
        })
        .catch((error) => { })
    }

    if (element.value && element.type === Constants.FormTypes.CASCADE) {
      axios({
        method: 'GET',
        url: element.ext.fetchURL,
        headers: {
          'x-all': true
        }
      })
        .then((resp) => {
          const items = resp.data
          const cascadeValue2 = element.value
            .replace('[', '')
            .replace(']', '')
            .split(', ')
            .map((v) => {
              const item = items.find((i) => i.id === v)?.name || '-'
              return item
            })
            .join('، ')
          setCascadeValue(cascadeValue2)
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
  }, [element])

  switch (element.type) {
    case Constants.FormTypes.HEADER:
      return <Element bgClass='bg-gray-100' element={element} hideMeta={hideMeta} />

    case Constants.FormTypes.NOTE:
      return <Element element={element} hideMeta={hideMeta} />

    case Constants.FormTypes.PICKER_DATE:
      return (
        <Element element={element} hideMeta={hideMeta}>
          <Paragraph>
            {element.value
              ? moment(+element.value).format('jYYYY/jMM/jDD')
              : FORM_EMPTY_PLACEHOLDER}
          </Paragraph>
        </Element>
      )

    case Constants.FormTypes.PICKER_TIME:
      return (
        <Element element={element} hideMeta={hideMeta}>
          <Paragraph>
            {element.value
              ? moment
                .utc(moment.duration(+element.value, 'minutes').asMilliseconds())
                .format('HH:mm:ss')
              : FORM_EMPTY_PLACEHOLDER}
          </Paragraph>
        </Element>
      )

    case Constants.FormTypes.EDITTEXT_NUMBER:
    case Constants.FormTypes.EDITTEXT_TEXT_SINGLELINE:
    case Constants.FormTypes.EDITTEXT_TEXT_MULTILINE:
    case Constants.FormTypes.PICKER_SINGLE:
    case Constants.FormTypes.PICKER_MULTI:
    case Constants.FormTypes.SWITCH:
      return (
        <Element element={element} hideMeta={hideMeta}>
          <Paragraph>{element.value ? element.value.toString() : FORM_EMPTY_PLACEHOLDER}</Paragraph>
        </Element>
      )

    case Constants.FormTypes.LOCATION:
      return (
        <Element element={element} hideMeta={hideMeta}>
          <div className='flex flex-col'>
            {!element.value && <Paragraph>{FORM_EMPTY_PLACEHOLDER}</Paragraph>}
            {!!element.value && (
              <div className='ltr w-full h-128 overflow-hidden'>
                <MapContainer
                  style={{ width: '100%', height: '100%' }}
                  center={{
                    lat: +element.value.split(',')[0],
                    lng: +element.value.split(',')[1],
                  }}
                  zoom={13}
                >
                  <TileLayer
                    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />

                  <Marker
                    draggable={false}
                    position={{
                      lat: +element.value.split(',')[0],
                      lng: +element.value.split(',')[1],
                    }}
                    icon={
                      new Icon({
                        iconUrl: markerIconPng,
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })
                    }
                  />
                </MapContainer>
              </div>
            )}
          </div>
        </Element>
      )
    case Constants.FormTypes.FILE: {
      // Move lexical declaration into block to avoid no-case-declarations warning
      const files =
        element?.value
          ?.toString()
          ?.replace('[', '')
          ?.replace(']', '')
          ?.split(',')
          ?.map((it) => it.trim()) || []
      return (
        <Element element={element} hideMeta={hideMeta}>
          <div className='flex flex-wrap gap-4'>
            {files?.length === 0 && <Paragraph>{FORM_EMPTY_PLACEHOLDER}</Paragraph>}
            {files?.length > 0 &&
              files.map((file, ind) => {
                return <FileElement key={ind} randomId={file} />
              })}
          </div>
        </Element>
      )
    }

    case Constants.FormTypes.PHOTO: {
      // Move lexical declaration into block to avoid no-case-declarations warning
      const images =
        element?.value
          ?.toString()
          ?.replace('[', '')
          ?.replace(']', '')
          ?.split(',')
          ?.map((it) => it.trim()) || []
      return (
        <Element element={element} hideMeta={hideMeta}>
          <div className='flex flex-wrap gap-4'>
            {images?.length === 0 && <Paragraph>{FORM_EMPTY_PLACEHOLDER}</Paragraph>}
            {images?.length > 0 &&
              images.map((image, ind) => {
                return <Photo key={ind} rId={image} />
              })}
          </div>
        </Element>
      )
    }

    case Constants.FormTypes.TABLE: {
      // Move lexical declarations into block to avoid no-case-declarations warning
      const schema =
        element.schema && typeof element.schema === 'string'
          ? JSON.parse(element.schema)
          : element.schema
      const tableRows =
        element.value && typeof element.value === 'string'
          ? JSON.parse(element.value)?.filter((it) => !!it)
          : element.value?.filter((it) => !!it)

      return (
        <Element element={element} hideMeta={hideMeta}>
          <div className='flex flex-col text-sm'>
            {!element.value && <p>{FORM_EMPTY_PLACEHOLDER}</p>}

            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    {schema &&
                      schema.map((col, innerIndex) => (
                        <TableCell key={innerIndex}>
                          <div className='flex flex-col'>
                            <div>{col.title}</div>
                            <Meta element={col} col hideMeta={hideMeta} />
                          </div>
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows?.length > 0 &&
                    tableRows.map((row, innerIndex) => (
                      <TableRow key={innerIndex}>
                        {schema &&
                          schema.map((column) => {
                            const foundCol = row.find((col) => col.tag === column.tag)
                            let foundColValue = ''
                            if (foundCol) {
                              // console.log('column', column)
                              foundColValue = foundCol.value
                              if (column.type === Constants.FormTypes.PICKER_DATE) {
                                foundColValue = moment(+foundCol.value).format('jYYYY/jMM/jDD')
                              }
                            }
                            return (
                              <TableCell key={uuid()}>
                                <ExpandableItem>
                                  {foundCol ? foundColValue : FORM_EMPTY_PLACEHOLDER}
                                </ExpandableItem>
                              </TableCell>
                            )
                          })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Element>
      )
    }

    case Constants.FormTypes.COUNTRY_DIVISION:
      return (
        <Element element={element} hideMeta={hideMeta}>
          <div className='flex flex-col'>
            {!element.value && <Paragraph>{FORM_EMPTY_PLACEHOLDER}</Paragraph>}
            {element.value && !divisionObject && <p>در حال بارگذاری ...</p>}
            {element.value && divisionObject && <p>{divisionObject.name}</p>}
          </div>
        </Element>
      )

    case Constants.FormTypes.CASCADE:
      return (
        <Element element={element} hideMeta={hideMeta}>
          <div className='flex flex-col'>
            {!element.value && <Paragraph>{FORM_EMPTY_PLACEHOLDER}</Paragraph>}
            {element.value && !cascadeValue && <p>در حال بارگذاری ...</p>}
            {element.value && cascadeValue && <p>{cascadeValue}</p>}
          </div>
        </Element>
      )
    default:
      return null
  }
}

function Photo({ rId }) {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`/file/randomId/${rId}`)
      .then((resp) => {
        setImage(resp.data)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [rId])

  if (loading || !image) return <p>{rId}</p>
  return (
    <ModalImage
      small={image.thumb ? `data:image/png;base64, ${image.thumb}` : image.url}
      // small={`data:image/png;base64, ${image.thumb}`}
      large={image.url}
      alt={image.rId}
    />
  )
}

function Title({ element, hideMeta }) {
  return (
    <div className='flex flex-col gap-4 border-b border-gray-100 p-8'>
      <p className='font-bold my-0'>{element.title}</p>
      <Meta element={element} hideMeta={hideMeta} />
    </div>
  )
}

function Meta({ element, col = false, hideMeta = false }) {
  if (hideMeta) return null

  return (
    <div className={clsx('mb-0 mt-0 text-sm text-gray-400 flex', col ? 'flex-col' : 'gap-16')}>
      <div className='flex gap-x-8 flex-col md:flex-row'>
        <span>تگ:</span>
        <span
          className='mr-1 hover:bg-gray-100 hover:cursor-pointer rounded mx-1'
          onClick={() => {
            navigator.clipboard.writeText(element.tag)
          }}
          onKeyDown={() => {
            navigator.clipboard.writeText(element.tag)
          }}
          role='button'
          tabIndex={0}
        >
          {element.tag}
        </span>
      </div>

      {element.pageTag && (
        <div className='flex gap-x-8 flex-col md:flex-row'>
          <span className=''>تگ صفحه:</span>
          <span
            className='hover:bg-gray-100 hover:cursor-pointer rounded'
            onClick={() => {
              navigator.clipboard.writeText(element.pageTag)
            }}
            onKeyDown={() => {
              navigator.clipboard.writeText(element.pageTag)
            }}
            role='button'
            tabIndex={0}
          >
            {element.pageTag}
          </span>
        </div>
      )}

      {element.code && (
        <div className='flex gap-x-8 flex-col md:flex-row'>
          <span className=''>کد سوال:</span>
          <span
            className='hover:bg-gray-100 hover:cursor-pointer rounded'
            onClick={() => {
              navigator.clipboard.writeText(element.code)
            }}
            onKeyDown={() => {
              navigator.clipboard.writeText(element.code)
            }}
            role='button'
            tabIndex={0}
          >
            {element.code || '-'}
          </span>
        </div>
      )}
    </div>
  )
}

function Paragraph({ children }) {
  return <p className='mt-0 mb-0'>{children}</p>
}

function Element({ bgClass, element, children, hideMeta }) {
  return (
    <li className={clsx('list-none flex flex-col rounded-lg border border-gray-200', bgClass)}>
      <Title element={element} hideMeta={hideMeta} />
      {children && <div className='p-12'>{children}</div>}
    </li>
  )
}

export default SubmissionElement
