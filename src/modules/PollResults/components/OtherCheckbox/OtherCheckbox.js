import React, { useEffect, useRef } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const OtherCheckbox = ({ answer, onChange, settings, onBlur }) => {
  const inputEl = useRef(null)
  useEffect(() => {
    inputEl.current.value = answer.text
  })

  const onTextChange = () => {

  }

  const handleBlur = () => {
    const val = inputEl.current.value
    console.log(val);
    onBlur(val)
  }

  return (
    <FormControlLabel
      className="other-check-label"
      key={answer.id}
      control={
        <Checkbox
          onChange={onChange}
          checked={answer.selected}
          disabled={answer.disabled}
          value={answer.id}
        />
      }
      label={
        <TextField
          id="standard-bare"
          inputRef={inputEl}
          autoFocus={false}
          name={answer.id}
          placeholder={answer.title}
          margin="normal"
          onChange={onTextChange}
          onBlur={handleBlur}
          className="checkbox-control-label"
        />
      }
    />
  )
}

export default OtherCheckbox