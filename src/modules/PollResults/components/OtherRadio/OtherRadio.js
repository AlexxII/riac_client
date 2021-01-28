import React from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';

const OtherRadio = ({ answer, onChange, settings }) => {

  // const onChange = () => {

  // }

  const onTextChange = () => {

  }

  return (
    <FormControlLabel
      value={answer.id}
      key={answer.id}
      control={<Radio />}
      className="other-radio-label"
      label={
        <TextField
          id="standard-bare"
          value={answer.text}
          placeholder={answer.title}
          margin="normal"
          onChange={onTextChange}
          className="radio-control-label"
        />
      }
      disabled={answer.disabled}
    />
  )
}

export default OtherRadio