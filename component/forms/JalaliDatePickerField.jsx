import React from 'react';
import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AdapterJalaali from '@date-io/jalaali';
import moment from 'moment-jalaali';

moment.locale('fa');
moment.loadPersian();

/**
 * کامپوننت DatePicker شمسی ساده بدون react-hook-form
 */
const JalaliDatePickerField = ({ 
  label, 
  value, 
  onChange, 
  size = 'small',
  fullWidth = true,
  ...otherProps 
}) => {
  const handleChange = (newValue) => {
    if (onChange) {
      // تبدیل به ISO string برای backend
      onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterJalaali}>
      <DatePicker
        label={label}
        value={value ? moment(value) : null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} fullWidth={fullWidth} size={size} />
        )}
        {...otherProps}
      />
    </LocalizationProvider>
  );
};

export default JalaliDatePickerField;
