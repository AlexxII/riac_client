import React from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';

const OtherRadio = ({ placeholder }) => {

  const onChange = () => {

  }

  const onTextChange = () => {

  }

  return (
    <FormControlLabel
      // value={value}
      onChange={onChange}
      checked={false}
      control={<Radio />}
      className="other-radio-label"
      label={
        <TextField
          id="standard-bare"
          placeholder={placeholder}
          margin="normal"
          onChange={onTextChange}
          className="radio-control-label"
        />
      }
    />
  )
}

export default OtherRadio