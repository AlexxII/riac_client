import React, { useState, useEffect } from 'react'

import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

import flatpickr from "flatpickr"

import "flatpickr/dist/themes/material_blue.css";
import { Russian } from "flatpickr/dist/l10n/ru.js"

const FlatPicker = ({ options, handleDataChange }) => {
  const [calendar, setCalendar] = useState(false)

  const onChange = (_, value) => {
    handleDataChange(value)
  }

  useEffect(() => {
    const picker = flatpickr('#myID', {
      onChange: onChange,
      "locale": Russian,
      ...options
    })
    setCalendar(picker)
  }, [])

  const clearDates = () => {
    calendar.clear()
    handleDataChange(null)
  }

  return (
    <TextField
      style={{ width: '100%' }}
      variant="outlined"
      id="myID"
      size="small"
      type='date'
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Tooltip title="Очистить">
              <ClearIcon style={{ cursor: "pointer" }}
                onClick={clearDates}
              />
            </Tooltip>
          </InputAdornment>
        )
      }}
    />
  )
}

export default FlatPicker