import React from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const OtherCheckbox = ({ answer, onChange, settings }) => {

  // const onChange = () => {

  // }

  const onTextChange = () => {

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
          placeholder={answer.title}
          value={answer.text}
          margin="normal"
          onChange={onTextChange}
          className="checkbox-control-label"
        />
      }
    />
  )
}

export default OtherCheckbox