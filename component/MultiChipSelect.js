import { Cancel as CancelIcon } from '@mui/icons-material'
import { Chip, MenuItem, Paper, TextField } from '@mui/material'
import Constants from '@shared/fuse/constants'
import Downshift from 'downshift'
import Fuse from 'fuse.js'

function MultiChipSelect(props) {
  const { classes, availableItems, onRemoveItem, className, label, searchKeys, ...rest } = props

  const getItems = (value) => {
    const fuseOptions = {
      includeScore: true,
      threshold: Constants.defaultFusejsThreshold,
      keys: searchKeys || ['name'],
    }
    const fuse = new Fuse(availableItems, fuseOptions)

    return value
      ? fuse
          .search(value)
          .slice(0, 100)
          .map((item) => item.item)
      : availableItems.slice(0, 100)
  }

  return (
    <Downshift {...rest} itemToString={(item) => (item ? item.name : '')}>
      {({
        getInputProps,
        getItemProps,
        inputValue,
        selectedItem,
        highlightedIndex,
        toggleMenu,
        isOpen,
      }) => (
        <div className={`relative ${className || ''}`}>
          <div className='inline-block bg-transparent'>
            {selectedItem.length > 0 &&
              selectedItem.map((item, index) => (
                <Chip
                  key={index}
                  sx={{
                    '& .MuiChip-label': {
                      fontFamily: 'Vazir',
                    },
                    marginTop: 1,
                    marginRight: 1,
                  }}
                  label={item.name}
                  deleteIcon={<CancelIcon />}
                  onDelete={() => onRemoveItem(item)}
                  onClick={() => onRemoveItem(item)}
                />
              ))}
          </div>

          <TextField
            fullWidth
            sx={{
              marginTop: selectedItem.length > 0 ? 2 : 0,
            }}
            label={`${label || 'انتخاب'} ${
              availableItems.length === 0 ? '(موردی باقی نمانده است)' : ''
            }`}
            disabled={availableItems.length === 0}
            InputProps={{
              ...getInputProps({
                onClick: () => toggleMenu(),
                value: inputValue || '',
              }),
            }}
          />

          {isOpen && (
            <Paper
              sx={{
                maxHeight: '280px',
                overflowY: 'auto',
                position: 'fixed',
                zIndex: 100,
                borderRadius: 1,
                // width: '100%',
                minWidth: '250px',
                visibility: isOpen ? 'visible' : 'hidden',
              }}
              square
            >
              {getItems(inputValue).map((item, index) => {
                return (
                  !selectedItem.map((t) => t.name).includes(item.name) && (
                    <MenuItem
                      {...getItemProps({
                        item,
                      })}
                      key={item.key || item._id || item.value}
                      selected={highlightedIndex === index}
                      component='div'
                    >
                      {item.name}
                    </MenuItem>
                  )
                )
              })}
            </Paper>
          )}
        </div>
      )}
    </Downshift>
  )
}

export default MultiChipSelect
